<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LetterApprovalController extends Controller
{
    /**
     * Secretary reviews a letter (Kembalikan or Teruskan)
     */
    public function secretaryReview(Request $request, Letter $letter)
    {
        $user = Auth::user();
        
        // Check if user is Secretary
        if (!$user->isSekdes()) {
            abort(403, 'Hanya Sekretaris Desa yang dapat melakukan review.');
        }
        
        // Validate request
        $validated = $request->validate([
            'action' => 'required|in:revoke,continue',
            'notes' => 'nullable|string|max:1000',
        ]);
        
        // Check if letter is in 'sent' status
        if ($letter->status !== Letter::STATUS_SENT) {
            return back()->with('error', 'Surat ini tidak dapat direview.');
        }
        
        if ($validated['action'] === 'revoke') {
            // Kembalikan ke Pegawai
            $letter->update([
                'status' => Letter::STATUS_REVOKED,
                'secretary_notes' => $validated['notes'] ?? null,
                'verified_by' => $user->id,
                'verified_at' => now(),
            ]);
            
            return back()->with('success', 'Surat berhasil dikembalikan ke Pegawai untuk revisi.');
        } else {
            // Teruskan ke Kepala Desa
            $letter->update([
                'status' => Letter::STATUS_CONTINUED,
                'recipient' => 'Kepala Desa', // Change recipient to Kepala Desa
                'secretary_notes' => $validated['notes'] ?? null,
                'verified_by' => $user->id,
                'verified_at' => now(),
            ]);
            
            return back()->with('success', 'Surat berhasil diteruskan ke Kepala Desa.');
        }
    }
    
    /**
     * Head approves or rejects a letter
     */
    public function headApproval(Request $request, Letter $letter)
    {
        $user = Auth::user();
        
        // Check if user is Head
        if (!$user->isKades()) {
            abort(403, 'Hanya Kepala Desa yang dapat melakukan approval.');
        }
        
        // Validate request
        $validated = $request->validate([
            'action' => 'required|in:reject,approve',
            'notes' => 'nullable|string|max:1000',
        ]);
        
        // Check if letter is in 'continued' status
        if ($letter->status !== Letter::STATUS_CONTINUED) {
            return back()->with('error', 'Surat ini tidak dapat diapprove.');
        }
        
        if ($validated['action'] === 'reject') {
            // Tolak surat
            $letter->update([
                'status' => Letter::STATUS_REJECTED,
                'head_notes' => $validated['notes'] ?? null,
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
            
            return back()->with('success', 'Surat telah ditolak.');
        } else {
            // Setujui surat
            $letter->update([
                'status' => Letter::STATUS_APPROVED,
                'head_notes' => $validated['notes'] ?? null,
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
            
            return back()->with('success', 'Surat telah disetujui.');
        }
    }
    
    /**
     * Get letters for secretary review
     */
    public function secretaryIndex()
    {
        $user = Auth::user();
        
        if (!$user->isSekdes()) {
            abort(403, 'Akses ditolak.');
        }
        
        $letters = Letter::with(['user'])
            ->sent()
            ->latest()
            ->paginate(20);
        
        return inertia('SecretaryReview', [
            'letters' => $letters,
        ]);
    }
    
    /**
     * Get letters for head approval
     */
    public function headIndex()
    {
        $user = Auth::user();
        
        if (!$user->isKades()) {
            abort(403, 'Akses ditolak.');
        }
        
        $letters = Letter::with(['user', 'verifier'])
            ->continued()
            ->latest()
            ->paginate(20);
        
        return inertia('HeadApproval', [
            'letters' => $letters,
        ]);
    }
}
