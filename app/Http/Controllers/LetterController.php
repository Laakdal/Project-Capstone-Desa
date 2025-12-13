<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

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
            'status' => 'required|in:draft,sent',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
        ]);

        $request->user()->letters()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Surat berhasil disimpan.');
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
