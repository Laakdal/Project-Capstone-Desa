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
            'subject' => 'nullable|string|max:255',
            'recipient' => 'nullable|string|max:255',
            'status' => 'required|in:draft,sent',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
        ]);

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
}
