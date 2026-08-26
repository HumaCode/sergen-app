<?php

use Illuminate\Support\Facades\Route;
use Modules\Participant\Http\Controllers\ParticipantController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('participants', ParticipantController::class)->names('participant');
});
