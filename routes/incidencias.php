<?php

use App\Http\Controllers\IncidenciaController;
use Illuminate\Support\Facades\Route;

Route::prefix('incidencias')->name('incidencias.')->group(function () {
    Route::get('/', [IncidenciaController::class, 'index'])->name('index');
    Route::post('/', [IncidenciaController::class, 'store'])->name('store');
    Route::put('/{incidencia}/estado', [IncidenciaController::class, 'updateEstado'])->name('estado');
});
