<?php

use Illuminate\Support\Facades\Route;
use Modules\UserAccess\Http\Controllers\UserAccessController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('useraccesses', UserAccessController::class)->names('useraccess');
});
