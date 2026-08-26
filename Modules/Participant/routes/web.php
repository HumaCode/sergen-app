<?php

use Illuminate\Support\Facades\Route;
use Modules\Participant\Http\Controllers\ParticipantController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('participants', ParticipantController::class)->names('participant');
});
