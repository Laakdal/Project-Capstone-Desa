<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    /**
     * Display a listing of folders
     */
    public function index()
    {
        $folders = Folder::with(['creator', 'letters'])
            ->withCount('letters')
            ->latest()
            ->get();

        return response()->json($folders);
    }

    /**
     * Store a newly created folder
     */
    public function store(Request $request)
    {
        // Only Sekdes & Kades can create folders
        if (!$request->user()->isSekdes() && !$request->user()->isKades()) {
            return back()->with('error', 'Hanya Sekretaris Desa dan Kepala Desa yang dapat membuat folder.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $folder = Folder::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Folder berhasil dibuat!');
    }

    /**
     * Update the specified folder
     */
    public function update(Request $request, Folder $folder)
    {
        // Only Sekdes & Kades can update folders (must be owner)
        $user = $request->user();
        if ((!$user->isSekdes() && !$user->isKades()) || $folder->created_by !== $user->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah folder ini.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $folder->update($validated);

        return back()->with('success', 'Folder berhasil diperbarui!');
    }

    /**
     * Remove the specified folder
     */
    public function destroy(Request $request, Folder $folder)
    {
        // Only Sekdes & Kades can delete folders (must be owner)
        $user = $request->user();
        if ((!$user->isSekdes() && !$user->isKades()) || $folder->created_by !== $user->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menghapus folder ini.');
        }

        $folder->delete();

        return back()->with('success', 'Folder berhasil dihapus!');
    }

    /**
     * Add letter to folder
     */
    public function addLetter(Request $request, Folder $folder)
    {
        // Only Sekdes & Kades can manage folder contents (must be owner)
        $user = $request->user();
        if ((!$user->isSekdes() && !$user->isKades()) || $folder->created_by !== $user->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengelola folder ini.');
        }

        $validated = $request->validate([
            'letter_id' => 'required|exists:letters,id',
        ]);

        // Check if letter is already in folder
        if ($folder->letters()->where('letter_id', $validated['letter_id'])->exists()) {
            return back()->with('error', 'Surat sudah ada di folder ini.');
        }

        $folder->letters()->attach($validated['letter_id']);

        return back()->with('success', 'Surat berhasil ditambahkan ke folder!');
    }

    /**
     * Remove letter from folder
     */
    public function removeLetter(Request $request, Folder $folder)
    {
        // Only Sekdes & Kades can manage folder contents (must be owner)
        $user = $request->user();
        if ((!$user->isSekdes() && !$user->isKades()) || $folder->created_by !== $user->id) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengelola folder ini.');
        }

        $validated = $request->validate([
            'letter_id' => 'required|exists:letters,id',
        ]);

        $folder->letters()->detach($validated['letter_id']);

        return back()->with('success', 'Surat berhasil dihapus dari folder!');
    }
}
