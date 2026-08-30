<?php

use Illuminate\Support\Facades\Route;
use Modules\Certificate\Http\Controllers\CertificateController;
use Modules\Certificate\Http\Controllers\CertificateTemplateController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/templates', [CertificateTemplateController::class, 'index'])->name('templates.index');
    Route::post('/templates', [CertificateTemplateController::class, 'store'])->name('templates.store');
    Route::get('/templates/{id}/media', [CertificateTemplateController::class, 'media'])->name('templates.media');
    Route::post('/templates/{id}', [CertificateTemplateController::class, 'update'])->name('templates.update');
    Route::delete('/templates/{id}', [CertificateTemplateController::class, 'destroy'])->name('templates.destroy');

    Route::get('/certificates/templates', [CertificateTemplateController::class, 'index'])->name('certificate.templates.index');
    Route::post('/certificates/templates', [CertificateTemplateController::class, 'store'])->name('certificate.templates.store');
    Route::get('/certificates/templates/{id}/media', [CertificateTemplateController::class, 'media'])->name('certificate.templates.media');
    Route::post('/certificates/templates/{id}/placeholders', [CertificateTemplateController::class, 'updatePlaceholders'])->name('certificate.templates.placeholders');
    Route::post('/certificates/templates/{id}', [CertificateTemplateController::class, 'update'])->name('certificate.templates.update');
    Route::delete('/certificates/templates/{id}', [CertificateTemplateController::class, 'destroy'])->name('certificate.templates.destroy');

    Route::resource('certificates', CertificateController::class)->names('certificate');
});
