<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with real statistics
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get statistics by status
        $stats = Letter::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        // Calculate statistics
        $statistics = [
            'total_letters' => Letter::count(),
            'draft' => $stats->get(Letter::STATUS_DRAFT)?->total ?? 0,
            'pending_verification' => $stats->get(Letter::STATUS_PENDING_VERIFICATION)?->total ?? 0,
            'pending_approval' => $stats->get(Letter::STATUS_PENDING_APPROVAL)?->total ?? 0,
            'approved' => $stats->get(Letter::STATUS_APPROVED)?->total ?? 0,
            'rejected' => $stats->get(Letter::STATUS_REJECTED)?->total ?? 0,
        ];

        // My letters statistics (for current user)
        $myLettersStats = Letter::where('user_id', $user->id)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $myStatistics = [
            'total' => Letter::where('user_id', $user->id)->count(),
            'draft' => $myLettersStats->get(Letter::STATUS_DRAFT)?->total ?? 0,
            'pending_verification' => $myLettersStats->get(Letter::STATUS_PENDING_VERIFICATION)?->total ?? 0,
            'pending_approval' => $myLettersStats->get(Letter::STATUS_PENDING_APPROVAL)?->total ?? 0,
            'approved' => $myLettersStats->get(Letter::STATUS_APPROVED)?->total ?? 0,
            'rejected' => $myLettersStats->get(Letter::STATUS_REJECTED)?->total ?? 0,
        ];

        // Recent letters (5 latest)
        $recentLetters = Letter::with(['user', 'verifier', 'approver', 'letterType'])
            ->latest()
            ->limit(5)
            ->get();

        // Pending actions for current user
        $pendingActions = [];
        
        if ($user->isSekdes() || $user->isKades()) {
            $pendingActions['pending_verification'] = Letter::pendingVerification()->count();
        }
        
        if ($user->isKades()) {
            $pendingActions['pending_approval'] = Letter::pendingApproval()->count();
        }

        return Inertia::render('Dashboard', [
            'statistics' => $statistics,
            'myStatistics' => $myStatistics,
            'recentLetters' => $recentLetters,
            'pendingActions' => $pendingActions,
        ]);
    }
}
