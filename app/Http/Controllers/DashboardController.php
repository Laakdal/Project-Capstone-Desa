<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with role-specific statistics
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

        // Role-specific data
        $pendingActions = [];
        $pendingLetters = [];
        
        if ($user->isPegawai()) {
            // PBI#6: Pegawai Dashboard
            $pendingActions = [
                'drafts' => Letter::where('user_id', $user->id)->draft()->count(),
                'waiting_approval' => Letter::where('user_id', $user->id)
                    ->whereIn('status', [Letter::STATUS_SENT, Letter::STATUS_CONTINUED])
                    ->count(),
                'rejected' => Letter::where('user_id', $user->id)
                    ->where('status', Letter::STATUS_REJECTED)
                    ->count(),
                'dispositions' => 0, // TODO: Implement dispositions
            ];
            
            // Get recent letters for Pegawai that need action
            $pendingLetters = Letter::where('user_id', $user->id)
                ->whereIn('status', [
                    Letter::STATUS_DRAFT, 
                    Letter::STATUS_SENT, 
                    Letter::STATUS_CONTINUED,
                    Letter::STATUS_REJECTED,  // Need to fix/resubmit
                    Letter::STATUS_REVOKED,   // Need to revise
                ])
                ->with(['user'])
                ->latest()
                ->limit(5)
                ->get();
        }
        
        if ($user->isSekdes()) {
            // PBI#8: Sekdes Dashboard
            $pendingActions = [
                'pending_review' => Letter::sent()->count(),
                'total_this_month' => Letter::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'active_users' => User::where('status', 'Aktif')->count(),
            ];
            
            // Get letters waiting for Sekdes review
            $pendingLetters = Letter::with(['user'])
                ->sent()
                ->latest()
                ->limit(5)
                ->get();
        }
        
        if ($user->isKades()) {
            // PBI#7: Kades Dashboard
            $pendingActions = [
                'pending_approval' => Letter::continued()->count(),
                'approved_this_month' => Letter::where('status', Letter::STATUS_APPROVED)
                    ->whereMonth('updated_at', now()->month)
                    ->whereYear('updated_at', now()->year)
                    ->count(),
                'total_this_month' => Letter::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ];
            
            // Get letters waiting for Kades approval
            $pendingLetters = Letter::with(['user'])
                ->continued()
                ->latest()
                ->limit(5)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'statistics' => $statistics,
            'myStatistics' => $myStatistics,
            'recentLetters' => $recentLetters,
            'pendingActions' => $pendingActions,
            'pendingLetters' => $pendingLetters,
            'userRole' => $user->role,
        ]);
    }
}
