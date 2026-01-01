<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterManagementController extends Controller
{
    /**
     * Display a listing of letters with filters
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Determine if this is Arsip (read-only) or Pengelolaan (manage own letters)
        $isArsip = $request->is('arsip') || $request->is('arsip/*');
        
        // Authorization
        if ($isArsip) {
            // ARSIP: Only Sekdes & Kades can access
            if (!in_array($user->role, ['Sekretaris Desa', 'Kepala Desa'])) {
                abort(403);
            }
        } else {
            // PENGELOLAAN: Only Pegawai Desa can access (manage own letters)
            if ($user->role !== 'Pegawai Desa') {
                abort(403);
            }
        }
        
        // Base query with relationships
        $query = Letter::with(['user', 'folders']);
        
        // Role-based filtering
        if ($isArsip) {
            // ARSIP MODE: Show only approved/rejected letters (read-only archive)
            $query->whereIn('status', [Letter::STATUS_APPROVED, Letter::STATUS_REJECTED]);
        } else {
            // PENGELOLAAN MODE: Show user's own letters (all statuses)
            $query->where('user_id', $user->id);
        }
        
        // Filter by template type
        if ($request->filled('template_type') && $request->template_type !== 'all') {
            $query->where('template_type', $request->template_type);
        }
        
        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        // Filter by year
        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }
        
        // Filter by month
        if ($request->filled('month')) {
            $query->whereMonth('created_at', $request->month);
        }
        
        
        // Filter by folder (Sekdes & Kades)
        if (($user->isSekdes() || $user->isKades()) && $request->filled('folder_id') && $request->folder_id !== 'all') {
            $query->whereHas('folders', function($q) use ($request) {
                $q->where('folders.id', $request->folder_id);
            });
        }
        
        // Search by name, letter number, or subject
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('letter_number', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Get letters with pagination
        $letters = $query->latest()->paginate(20)->withQueryString();
        
        // Get total archive count (for Sekdes/Kades - always show total regardless of folder filter)
        $totalArchiveCount = 0;
        if ($user->isSekdes() || $user->isKades()) {
            $totalArchiveCount = Letter::whereIn('status', [Letter::STATUS_APPROVED, Letter::STATUS_REJECTED])->count();
        } elseif ($user->isPegawai()) {
            $totalArchiveCount = Letter::where('user_id', $user->id)->count();
        }
        
        
        // Get folders for Sekdes & Kades (only their own folders)
        $folders = [];
        if ($user->isSekdes() || $user->isKades()) {
            $folders = Folder::where('created_by', $user->id)
                ->withCount('letters')
                ->latest()
                ->get();
        }
        
        // Get available template types for filter
        $templateTypes = [
            ['value' => 'all', 'label' => 'Semua Jenis'],
            ['value' => 'surat_pengunduran_diri', 'label' => 'Surat Pengunduran Diri'],
            ['value' => 'surat_keputusan', 'label' => 'Surat Keputusan (SK)'],
            ['value' => 'surat_perintah_perjalanan_dinas', 'label' => 'SPPD'],
            ['value' => 'surat_tugas', 'label' => 'Surat Tugas (ST)'],
            ['value' => 'surat_cuti', 'label' => 'Surat Cuti'],
            ['value' => 'memo', 'label' => 'Memo'],
        ];
        
        return Inertia::render('LetterManagement', [
            'letters' => $letters,
            'folders' => $folders,
            'templateTypes' => $templateTypes,
            'totalArchiveCount' => $totalArchiveCount,
            'filters' => [
                'template_type' => $request->template_type ?? 'all',
                'status' => $request->status ?? 'all',
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'year' => $request->year,
                'month' => $request->month,
                'folder_id' => $request->folder_id ?? 'all',
                'search' => $request->search,
            ],
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show PDF preview
     */
    public function showPdf(Letter $letter)
    {
        $user = auth()->user();
        
        // STRICT AUTHORIZATION: Only Sekretaris Desa and Kepala Desa
        if (!in_array($user->role, ['Sekretaris Desa', 'Kepala Desa'])) {
            abort(403, 'Anda tidak memiliki akses. Hanya Sekretaris Desa dan Kepala Desa yang dapat melihat PDF arsip.');
        }
        
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
        
        // STRICT AUTHORIZATION: Only Sekretaris Desa and Kepala Desa
        if (!in_array($user->role, ['Sekretaris Desa', 'Kepala Desa'])) {
            abort(403, 'Anda tidak memiliki akses. Hanya Sekretaris Desa dan Kepala Desa yang dapat mendownload PDF arsip.');
        }
        
        // Check permission
        if ($user->isPegawai() && $letter->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke surat ini.');
        }
        
        
        // Check if PDF exists
        if (!$letter->pdf_path || !file_exists(storage_path('app/public/' . $letter->pdf_path))) {
            abort(404, 'PDF tidak ditemukan.');
        }
        
        // Sanitize filename - remove / and \ characters
        $safeFilename = str_replace(['/', '\\'], '_', $letter->letter_number);
        
        return response()->download(
            storage_path('app/public/' . $letter->pdf_path),
            'Surat_' . $safeFilename . '.pdf'
        );
    }
}
