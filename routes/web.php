<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // User Management Routes
    Route::get('/manajemen-akun', [UserController::class, 'index'])->name('users.index');
    Route::get('/manajemen-akun/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/manajemen-akun', [UserController::class, 'store'])->name('users.store');
    Route::get('/manajemen-akun/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('/manajemen-akun/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/manajemen-akun/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    // Letter Management Routes
    Route::resource('surat', \App\Http\Controllers\LetterController::class)->names('letters');
    Route::get('/surat/{letter}/preview', [\App\Http\Controllers\LetterController::class, 'preview'])->name('letters.preview');
    Route::post('/surat/preview-pdf', [\App\Http\Controllers\LetterController::class, 'previewPdf'])->name('letters.preview_pdf');
    
    // Letter Management Page (Admin/Sekdes/Kades view all letters)
    Route::get('/pengelolaan-surat', [\App\Http\Controllers\LetterManagementController::class, 'index'])->name('letter-management.index');
    Route::get('/pengelolaan-surat/{letter}/pdf', [\App\Http\Controllers\LetterManagementController::class, 'showPdf'])->name('letter-management.show-pdf');
    Route::get('/pengelolaan-surat/{letter}/download', [\App\Http\Controllers\LetterManagementController::class, 'downloadPdf'])->name('letter-management.download-pdf');
    
    // Approval Workflow Routes
    // Secretary Review
    Route::get('/review-surat', [\App\Http\Controllers\LetterApprovalController::class, 'secretaryIndex'])->name('secretary.review.index');
    Route::post('/review-surat/{letter}', [\App\Http\Controllers\LetterApprovalController::class, 'secretaryReview'])->name('secretary.review');
    
    // Head Approval
    Route::get('/approval-surat', [\App\Http\Controllers\LetterApprovalController::class, 'headIndex'])->name('head.approval.index');
    Route::post('/approval-surat/{letter}', [\App\Http\Controllers\LetterApprovalController::class, 'headApproval'])->name('head.approval');
    
    // Settings Page
    Route::get('/pengaturan', function () {
        return Inertia::render('Settings');
    })->name('settings');
});

require __DIR__.'/auth.php';
