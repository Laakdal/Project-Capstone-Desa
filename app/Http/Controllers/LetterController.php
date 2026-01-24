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
        $user = auth()->user();
        
        // Kepala Desa cannot create letters
        if ($user->isKades()) {
            return redirect()->route('dashboard')
                ->with('error', 'Kepala Desa tidak dapat membuat surat.');
        }
        
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

        // Define allowed templates per role
        $allowedTemplates = [
            'Pegawai Desa' => ['surat_pengunduran_diri', 'surat_cuti', 'memo'],
            'Sekretaris Desa' => ['surat_keputusan', 'surat_perintah_perjalanan_dinas', 'surat_tugas'],
        ];
        
        $user = $request->user();
        
        // Validate template access based on role
        if (!isset($allowedTemplates[$user->role]) || 
            !in_array($validated['template_type'], $allowedTemplates[$user->role])) {
            return back()->withErrors([
                'template_type' => 'Anda tidak memiliki akses untuk membuat jenis surat ini.'
            ]);
        }

        // Auto-set recipient based on workflow
        // Pegawai → Sekretaris Desa
        // Sekretaris Desa → Kepala Desa
        if ($user->role === 'Pegawai Desa') {
            $validated['recipient'] = 'Sekretaris Desa';
        } elseif ($user->role === 'Sekretaris Desa') {
            $validated['recipient'] = 'Kepala Desa';
            // Sekdes letters go directly to Kades (skip review)
            if ($validated['status'] === 'sent') {
                $validated['status'] = Letter::STATUS_CONTINUED; // 'continued'
            }
        }
        
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

        // Generate PDF regardless of status (draft or sent) as long as content exists
        if (!empty($validated['content'])) {
            $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $validated['content']]);
            
            // Create filename
            $filename = 'surat_' . $letter->id . '_' . time() . '.pdf';
            
            // Save PDF to storage/app/public/letters
            $path = 'letters/' . $filename;
            
            // Simpan ke File System (Storage)
            Storage::disk('public')->put($path, $pdf->output());
            
            // Update letter with PDF path
            $letter->update(['pdf_path' => $path]);
            
            // Simpan ke Database (Tabel letter_attachments)
            \App\Models\LetterAttachment::create([
                'letter_id' => $letter->id,
                'filename' => $filename,
                'mime_type' => 'application/pdf',
                'file_content' => base64_encode($pdf->output()) // Encode binary to base64 if needed, or save raw binary
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Surat berhasil dikirim!');
    }

    public function preview(Letter $letter)
    {
        return Inertia::render('Letters/Show', [
            'letter' => $letter->load('user', 'letterType'),
        ]);
    }

    public function previewPdf(Request $request)
    {
        $content = $request->input('content');
        // We might want to validate or sanitize, but for preview it's okay.
        $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $content]);
        return $pdf->stream('preview.pdf');
    }

    /**
     * Show PDF for viewing (from Dashboard)
     */
    public function show(Letter $letter)
    {
        $user = auth()->user();
        
        // Authorization: Pegawai can view own letters, Sekdes/Kades can view all
        if ($user->isPegawai()) {
            // Pegawai can only view their own letters
            if ($letter->user_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke surat ini.');
            }
        } elseif (!in_array($user->role, ['Sekretaris Desa', 'Kepala Desa'])) {
            // Only Sekdes and Kades can view all letters
            abort(403, 'Anda tidak memiliki akses.');
        }
        
        // Priority 1: Check File System
        if ($letter->pdf_path && file_exists(storage_path('app/public/' . $letter->pdf_path))) {
            return response()->file(storage_path('app/public/' . $letter->pdf_path));
        }
        
        // Priority 2: Check Database (Attachments table)
        $attachment = \App\Models\LetterAttachment::where('letter_id', $letter->id)->latest()->first();
        if ($attachment) {
            $fileContent = base64_decode($attachment->file_content); // If stored as base64
            // $fileContent = $attachment->file_content; // If stored as raw binary
            
            return response($fileContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $attachment->filename . '"');
        }
        
        abort(404, 'PDF tidak ditemukan.');
    }

    public function edit($id)
    {
        // Manually fetch the letter instead of using route model binding
        // to troubleshoot the 404 issue
        $letter = Letter::find($id);

        if (!$letter) {
            return redirect()->route('dashboard')->with('error', 'Surat tidak ditemukan');
        }

        // Check authorization
        if ($letter->user_id !== auth()->id()) {
            abort(403);
        }

        // Only draft letters can be edited
        // But we allow editing if it's rejected or revoked too, just to be safe
        // if (!in_array($letter->status, ['draft', 'rejected', 'revoked'])) {
        //     return redirect()->route('dashboard')->with('error', 'Surat tidak dapat diedit karena statusnya ' . $letter->status);
        // }

        return Inertia::render('Letters/Edit', [
            'letter' => $letter,
            // Pass any other necessary data (templates, etc.)
            'templates' => [
                ['id' => 'surat_keterangan', 'name' => 'Surat Keterangan'],
                ['id' => 'surat_pengantar', 'name' => 'Surat Pengantar'],
                ['id' => 'surat_rekomendasi', 'name' => 'Surat Rekomendasi'],
                ['id' => 'surat_cuti', 'name' => 'Surat Cuti'],
                ['id' => 'memo', 'name' => 'Memo'],
            ]
        ]);
    }
    
    public function update(Request $request, $id)
    {
        // Manually fetch the letter instead of using route model binding
        $letter = Letter::findOrFail($id);
        
        // Ensure the user owns the letter
        if ($letter->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit surat ini.');
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

        // Update letter (except PDF path for now)
        $letter->update($validated);

        // If content is present, always generate PDF regardless of status (draft or sent)
        if (!empty($validated['content'])) {
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
            
            // Update letter with new PDF path
            // Clear secretary notes if sent back
            $updateData = ['pdf_path' => $path];
            if ($validated['status'] === 'sent') {
                $updateData['secretary_notes'] = null;
                $updateData['verified_by'] = null;
                $updateData['verified_at'] = null;
            }
            $letter->update($updateData);
            
            // Simpan juga ke Database (Attachment)
            $existingAttachment = \App\Models\LetterAttachment::where('letter_id', $letter->id)->latest()->first();
            
            if ($existingAttachment) {
                // Update existing attachment
                $existingAttachment->update([
                    'filename' => $filename,
                    'file_content' => base64_encode($pdf->output())
                ]);
            } else {
                // Create new attachment
                \App\Models\LetterAttachment::create([
                    'letter_id' => $letter->id,
                    'filename' => $filename,
                    'mime_type' => 'application/pdf',
                    'file_content' => base64_encode($pdf->output())
                ]);
            }
        }

        return redirect()->route('dashboard')
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

    /**
     * Delete a letter (only drafts can be deleted)
     */
    public function destroy(Letter $surat)
    {
        $user = auth()->user();
        
        // Only the creator can delete their own letter
        if ($surat->user_id !== $user->id) {
            return redirect()->back()
                ->with('error', 'Anda tidak memiliki akses untuk menghapus surat ini.');
        }
        
        // Only draft letters can be deleted
        if ($surat->status !== Letter::STATUS_DRAFT) {
            return redirect()->back()
                ->with('error', 'Hanya surat dengan status draft yang dapat dihapus.');
        }
        
        // Delete PDF file if exists
        if ($surat->pdf_path && Storage::disk('public')->exists($surat->pdf_path)) {
            Storage::disk('public')->delete($surat->pdf_path);
        }
        
        // Delete the letter
        $surat->delete();
        
        // Return back without flash message (handled by frontend)
        return back();
    }
}
