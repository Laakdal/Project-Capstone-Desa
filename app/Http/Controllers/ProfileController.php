<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = Auth::user();
        
        return Inertia::render('Profile/UserEdit', [
            'user' => $user,
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'role' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'divisi' => 'nullable|string',
            'status' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'nik' => $validated['nik'],
        ];
        
        // Update optional fields if provided
        if (isset($validated['role'])) $userData['role'] = $validated['role'];
        if (isset($validated['jabatan'])) $userData['jabatan'] = $validated['jabatan'];
        if (isset($validated['divisi'])) $userData['divisi'] = $validated['divisi'];
        if (isset($validated['status'])) $userData['status'] = $validated['status'];
        if (isset($validated['permissions'])) $userData['permissions'] = $validated['permissions'];

        if (!empty($validated['password'])) {
            $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($userData);

        return Redirect::route('profile.edit')->with('success', 'Profile berhasil diupdate');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
