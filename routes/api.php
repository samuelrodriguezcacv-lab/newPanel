<?php

use App\Http\Controllers\AllSellosController;
use Illuminate\Support\Facades\Route;

// API de sellos
Route::middleware('auth:sanctum')->post('/sellos', [AllSellosController::class, 'store']);
