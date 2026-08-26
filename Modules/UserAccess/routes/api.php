<?php

use Illuminate\Support\Facades\Route;
use Modules\UserAccess\Http\Controllers\UserAccessController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('useraccesses', UserAccessController::class)->names('useraccess');
});
