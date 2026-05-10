<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AllSellosController;

// API de sellos
Route::post('/sellos', [AllSellosController::class, 'store']);