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
            'sent' => $stats->get(Letter::STATUS_SENT)?->total ?? 0,
            'revoked' => $stats->get(Letter::STATUS_REVOKED)?->total ?? 0,
            'continued' => $stats->get(Letter::STATUS_CONTINUED)?->total ?? 0,
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
            'sent' => $myLettersStats->get(Letter::STATUS_SENT)?->total ?? 0,
            'revoked' => $myLettersStats->get(Letter::STATUS_REVOKED)?->total ?? 0,
            'continued' => $myLettersStats->get(Letter::STATUS_CONTINUED)?->total ?? 0,
            'approved' => $myLettersStats->get(Letter::STATUS_APPROVED)?->total ?? 0,
            'rejected' => $myLettersStats->get(Letter::STATUS_REJECTED)?->total ?? 0,
        ];

        // Recent letters (5 latest)
        $recentLetters = Letter::with(['user'])
            ->latest()
            ->limit(5)
            ->get();

        // Pending actions for current user based on role
        $pendingActions = [];
        
        // Sekretaris can see letters that are 'sent' (waiting for review)
        if ($user->isSekdes()) {
            $pendingActions['pending_review'] = Letter::sent()->count();
        }
        
        // Kepala Desa can see letters that are 'continued' (waiting for approval)
        if ($user->isKades()) {
            $pendingActions['pending_approval'] = Letter::continued()->count();
        }

        return Inertia::render('Dashboard', [
            'statistics' => $statistics,
            'myStatistics' => $myStatistics,
            'recentLetters' => $recentLetters,
            'pendingActions' => $pendingActions,
        ]);
    }
}
