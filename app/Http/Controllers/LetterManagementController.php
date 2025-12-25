<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterManagementController extends Controller
{
    /**
     * Display a listing of all letters for admin
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get letters based on user role
        $query = Letter::with(['user'])
            ->latest();
        
        // If Pegawai, only show their own letters
        if ($user->isPegawai()) {
            $query->where('user_id', $user->id);
        }
        
        // Get letters with pagination
        $letters = $query->paginate(20);
        
        return Inertia::render('LetterManagement', [
            'letters' => $letters,
        ]);
    }

    /**
     * Show PDF preview
     */
    public function showPdf(Letter $letter)
    {
        $user = auth()->user();
        
        // Check permission
        if ($user->isPegawai() && $letter->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke surat ini.');
        }
        
        // Check if PDF exists
        if (!$letter->pdf_path || !file_exists(storage_path('app/public/' . $letter->pdf_path))) {
            abort(404, 'PDF tidak ditemukan.');
        }
        
        return response()->file(storage_path('app/public/' . $letter->pdf_path));
    }

    /**
     * Download PDF
     */
    public function downloadPdf(Letter $letter)
    {
        $user = auth()->user();
        
        // Check permission
        if ($user->isPegawai() && $letter->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke surat ini.');
        }
        
        // Check if PDF exists
        if (!$letter->pdf_path || !file_exists(storage_path('app/public/' . $letter->pdf_path))) {
            abort(404, 'PDF tidak ditemukan.');
        }
        
        return response()->download(
            storage_path('app/public/' . $letter->pdf_path),
            'Surat_' . $letter->letter_number . '.pdf'
        );
    }
}
