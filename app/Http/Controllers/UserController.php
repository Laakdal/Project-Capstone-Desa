<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        // Authorization: Only Kepala Desa and Sekretaris Desa can access
        if (Auth::user()->role === 'Pegawai Desa') {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }
        
        $users = User::orderBy('created_at', 'desc')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'last_login' => $user->last_login ? $this->formatLastLogin($user->last_login) : 'Belum pernah login'
            ];
        });

        // Calculate statistics
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'Aktif')->count();
        $kepalaDesaCount = User::where('role', 'Kepala Desa')->count();
        $sekretarisDesaCount = User::where('role', 'Sekretaris Desa')->count();
        $pegawaiDesaCount = User::where('role', 'Pegawai Desa')->count();

        return Inertia::render('Profile/ListUser', [
            'users' => $users,
            'statistics' => [
                'total_users' => $totalUsers > 0 ? $totalUsers : null,
                'active_users' => $activeUsers > 0 ? $activeUsers : null,
                'kepala_desa' => $kepalaDesaCount > 0 ? $kepalaDesaCount : null,
                'sekretaris_desa' => $sekretarisDesaCount > 0 ? $sekretarisDesaCount : null,
                'pegawai_desa' => $pegawaiDesaCount > 0 ? $pegawaiDesaCount : null,
            ]
        ]);
    }

    /**
     * Format last login timestamp to human readable format
     */
    private function formatLastLogin($timestamp)
    {
        $lastLogin = Carbon::parse($timestamp);
        $now = Carbon::now();
        
        $diffInMinutes = $lastLogin->diffInMinutes($now);
        
        if ($diffInMinutes < 5) {
            return 'Online';
        } elseif ($diffInMinutes < 60) {
            return $diffInMinutes . ' menit yang lalu';
        } elseif ($diffInMinutes < 1440) { // Less than 24 hours
            $hours = floor($diffInMinutes / 60);
            return $hours . ' jam yang lalu';
        } elseif ($diffInMinutes < 10080) { // Less than 7 days
            $days = floor($diffInMinutes / 1440);
            return $days . ' hari yang lalu';
        } elseif ($diffInMinutes < 43200) { // Less than 30 days
            $weeks = floor($diffInMinutes / 10080);
            return $weeks . ' minggu yang lalu';
        } else {
            return $lastLogin->format('d M Y');
        }
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Profile/CreateUser');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'jabatan' => 'nullable|string',
            'divisi' => 'nullable|string',
            'status' => 'required|string',
            'permissions' => 'nullable|array',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'phone' => $validated['phone'],
            'nik' => $validated['nik'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
            'jabatan' => $validated['jabatan'],
            'divisi' => $validated['divisi'],
            'status' => $validated['status'],
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil ditambahkan');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        // Authorization: Kepala Desa & Sekretaris Desa can edit anyone
        // Pegawai Desa can only edit their own profile
        if (Auth::user()->role === 'Pegawai Desa' && Auth::id() !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit user lain.');
        }
        
        return Inertia::render('Profile/UserEdit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Authorization: Same as edit method
        if (Auth::user()->role === 'Pegawai Desa' && Auth::id() !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengupdate user lain.');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'phone' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'jabatan' => 'nullable|string',
            'divisi' => 'nullable|string',
            'status' => 'required|string',
            'permissions' => 'nullable|array',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'nik' => $validated['nik'],
            'role' => $validated['role'],
            'jabatan' => $validated['jabatan'],
            'divisi' => $validated['divisi'],
            'status' => $validated['status'],
            'permissions' => $validated['permissions'] ?? [],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($userData);

        return redirect()->route('users.index')
            ->with('success', 'User berhasil diupdate');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus');
    }
}
