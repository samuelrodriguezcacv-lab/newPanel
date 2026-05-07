<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestSelloController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/sellos/dashboard-sellos', function () {
    return Inertia::render('Sellos/DashboardSellos');
});

Route::get('/sellos/sellos-tareas', function () {
    return Inertia::render('Sellos/Tareas/SellosTareas');
});

Route::get('/test', function () {
    return Inertia::render('Test');
});
Route::get('/test-sello', [TestSelloController::class, 'test']);


