<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Certificate\Http\Controllers\CertificateTemplateController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/templates', [CertificateTemplateController::class, 'index'])->name('templates.index');
    Route::post('/templates', [CertificateTemplateController::class, 'store'])->name('templates.store');
    Route::get('/templates/{id}/media', [CertificateTemplateController::class, 'media'])->name('templates.media');
    Route::post('/templates/{id}', [CertificateTemplateController::class, 'update'])->name('templates.update');
    Route::delete('/templates/{id}', [CertificateTemplateController::class, 'destroy'])->name('templates.destroy');

    Route::get('/certificates/templates', [CertificateTemplateController::class, 'index'])->name('certificate.templates.index');
    Route::post('/certificates/templates', [CertificateTemplateController::class, 'store'])->name('certificate.templates.store');
    Route::get('/certificates/templates/{id}/media', [CertificateTemplateController::class, 'media'])->name('certificate.templates.media');
    Route::post('/certificates/templates/{id}', [CertificateTemplateController::class, 'update'])->name('certificate.templates.update');
    Route::delete('/certificates/templates/{id}', [CertificateTemplateController::class, 'destroy'])->name('certificate.templates.destroy');

    Route::get('/participants', [\Modules\Participant\Http\Controllers\ParticipantController::class, 'index'])->name('participants.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
