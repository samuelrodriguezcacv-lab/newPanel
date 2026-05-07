<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestSelloController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/dashboard-sellos', function () {
    return Inertia::render('DashboardSellos');
});

Route::get('/test', function () {
    return Inertia::render('Test');
});
Route::get('/test-sello', [TestSelloController::class, 'test']);


