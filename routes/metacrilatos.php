<?php
// routes/metacrilatos.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MetacrilatoController;

/*
|--------------------------------------------------------------------------
| RUTAS DEL MÓDULO: METACRILATOS
|--------------------------------------------------------------------------
*/

Route::prefix('metacrilatos')->name('metacrilatos.')->group(function () {
    Route::get('/', [MetacrilatoController::class, 'index'])->name('index');
});

Route::get('/metacrilatos', [MetacrilatoController::class, 'index'])->name('metacrilatos.index');
Route::post('/metacrilatos', [MetacrilatoController::class, 'store'])->name('metacrilatos.store');
Route::get('/metacrilatos/preview', [MetacrilatoController::class, 'previewFormulario'])->name('metacrilatos.preview');
Route::delete('/metacrilatos/{id}', [MetacrilatoController::class, 'destroy'])->name('metacrilatos.destroy');
Route::get('/metacrilatos/{id}/pdf', [MetacrilatoController::class, 'generarPdf'])->name('metacrilatos.pdf');