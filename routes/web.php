<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

Route::get('/', fn () => Inertia::render('Home'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    require __DIR__.'/sellos.php';
    require __DIR__.'/logistica.php';
    require __DIR__.'/proveedores.php';
    require __DIR__.'/pedidos.php';
    require __DIR__.'/metacrilatos.php';
    require __DIR__.'/tareas.php';
});
