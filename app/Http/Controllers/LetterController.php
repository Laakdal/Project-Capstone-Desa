<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class LetterController extends Controller
{
    public function create()
    {
        return Inertia::render('Letters/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_type' => 'required|string',
            'letter_number' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'status' => 'required|in:draft,sent',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
        ]);

        // Auto-set recipient based on workflow
        // When Pegawai creates letter, recipient is always Sekretaris Desa
        $validated['recipient'] = 'Sekretaris Desa';
        
        // Auto-populate sender info from user account
        $user = $request->user();
        if (!isset($validated['meta_data'])) {
            $validated['meta_data'] = [];
        }
        $validated['meta_data']['nama_pengirim'] = $user->name;
        $validated['meta_data']['jabatan_pengirim'] = $user->role;

        // Auto-generate letter number if not provided
        if (empty($validated['letter_number'])) {
            $validated['letter_number'] = $this->generateLetterNumber($validated['template_type']);
        }

        // Create letter
        $letter = $request->user()->letters()->create($validated);

        // Generate PDF if status is 'sent'
        if ($validated['status'] === 'sent' && !empty($validated['content'])) {
            $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $validated['content']]);
            
            // Create filename
            $filename = 'surat_' . $letter->id . '_' . time() . '.pdf';
            
            // Save PDF to storage/app/public/letters
            $path = 'letters/' . $filename;
            Storage::disk('public')->put($path, $pdf->output());
            
            // Update letter with PDF path
            $letter->update(['pdf_path' => $path]);
        }

        return redirect()->route('dashboard')->with('success', 'Surat berhasil dikirim!');
    }

    public function preview(Letter $letter)
    {
        // For security, ensure the user owns the letter or has permission
        if ($letter->user_id !== auth()->id()) {
            abort(403);
        }

        $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $letter->content]);
        return $pdf->stream('Surat_' . $letter->id . '.pdf');
    }

    public function previewPdf(Request $request)
    {
        $content = $request->input('content');
        // We might want to validate or sanitize, but for preview it's okay.
        $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $content]);
        return $pdf->stream('preview.pdf');
    }

    public function edit($id)
    {
        // Manually fetch the letter instead of using route model binding
        $letter = Letter::findOrFail($id);
        
        $currentUserId = auth()->id();
        $letterUserId = $letter->user_id;
        
        // Debug logging
        \Log::info('Edit attempt', [
            'current_user_id' => $currentUserId,
            'current_user_id_type' => gettype($currentUserId),
            'letter_user_id' => $letterUserId,
            'letter_user_id_type' => gettype($letterUserId),
            'letter_id' => $letter->id,
            'letter_status' => $letter->status,
            'comparison_strict' => ($letter->user_id !== auth()->id()),
            'comparison_loose' => ($letter->user_id != auth()->id()),
        ]);
        
        // Ensure the user owns the letter (use loose comparison or cast to int)
        if ((int)$letter->user_id !== (int)auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit surat ini. (User ID: ' . $currentUserId . ' ['.gettype($currentUserId).'] vs Letter User ID: ' . $letterUserId . ' ['.gettype($letterUserId).'])');
        }

        // Only allow editing if status is draft or revoked
        if (!in_array($letter->status, ['draft', 'revoked'])) {
            return redirect()->route('letter-management.index')
                ->with('error', 'Surat ini tidak dapat diedit. Status saat ini: ' . $letter->status);
        }

        return Inertia::render('Letters/Edit', [
            'letter' => $letter,
            'secretaryNotes' => $letter->secretary_notes,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Manually fetch the letter instead of using route model binding
        $letter = Letter::findOrFail($id);
        // Ensure the user owns the letter (cast to int for comparison)
        if ((int)$letter->user_id !== (int)auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit surat ini.');
        }

        // Only allow updating if status is draft or revoked
        if (!in_array($letter->status, ['draft', 'revoked'])) {
            return redirect()->route('letter-management.index')
                ->with('error', 'Surat ini tidak dapat diedit.');
        }

        $validated = $request->validate([
            'template_type' => 'required|string',
            'letter_number' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'status' => 'required|in:draft,sent',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
        ]);

        // Auto-set recipient (always Sekretaris Desa for Pegawai)
        $validated['recipient'] = 'Sekretaris Desa';

        // Auto-generate letter number if not provided
        if (empty($validated['letter_number'])) {
            $validated['letter_number'] = $this->generateLetterNumber($validated['template_type']);
        }

        // Update letter
        $letter->update($validated);

        // If status changed to 'sent', regenerate PDF and clear secretary notes
        if ($validated['status'] === 'sent' && !empty($validated['content'])) {
            $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $validated['content']]);
            
            // Create filename
            $filename = 'surat_' . $letter->id . '_' . time() . '.pdf';
            
            // Delete old PDF if exists
            if ($letter->pdf_path && Storage::disk('public')->exists($letter->pdf_path)) {
                Storage::disk('public')->delete($letter->pdf_path);
            }
            
            // Save new PDF
            $path = 'letters/' . $filename;
            Storage::disk('public')->put($path, $pdf->output());
            
            // Update letter with new PDF path and clear notes
            $letter->update([
                'pdf_path' => $path,
                'secretary_notes' => null,
                'verified_by' => null,
                'verified_at' => null,
            ]);
        }

        return redirect()->route('letter-management.index')
            ->with('success', 'Surat berhasil diperbarui!');
    }

    /**
     * Generate letter number based on template type
     */
    private function generateLetterNumber($templateType)
    {
        $year = date('Y');
        
        // Define prefixes for each template type
        $prefixes = [
            'surat_pengunduran_diri' => 'SPD',
            'surat_keputusan' => 'SK',
            'surat_tugas' => 'ST',
            'surat_perintah_perjalanan_dinas' => 'SPPD',
            'surat_cuti' => 'SC',
            'memo' => 'MEMO',
        ];
        
        $prefix = $prefixes[$templateType] ?? 'SRT';
        
        // Get the last letter number for this template type this year
        $lastLetter = Letter::where('template_type', $templateType)
            ->where('letter_number', 'LIKE', "{$prefix}/%/{$year}")
            ->orderBy('id', 'desc')
            ->first();
        
        if ($lastLetter && preg_match("/{$prefix}\/(\d+)\/{$year}/", $lastLetter->letter_number, $matches)) {
            $nextNumber = intval($matches[1]) + 1;
        } else {
            $nextNumber = 1;
        }
        
        return sprintf('%s/%03d/%s', $prefix, $nextNumber, $year);
    }
}
