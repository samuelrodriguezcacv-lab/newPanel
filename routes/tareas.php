<?php
// routes/tareas.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TareaController;

/*
|--------------------------------------------------------------------------
| RUTAS DEL MÓDULO: TAREAS GENERALES (API)
|--------------------------------------------------------------------------
*/

Route::prefix('tareas')->name('tareas.')->group(function () {
    Route::get('/', [TareaController::class, 'index'])->name('index');
    Route::post('/', [TareaController::class, 'store'])->name('store');
    Route::put('/{id}', [TareaController::class, 'update'])->name('update');
    Route::delete('/{id}', [TareaController::class, 'destroy'])->name('destroy');
    
    // Relación Tareas -> Sellos
    Route::post('/{id}/sellos', [TareaController::class, 'asignarSellos'])->name('sellos.asignar');
    Route::delete('/{tareaId}/sellos/{selloId}', [TareaController::class, 'eliminarSello'])->name('sellos.eliminar');
    
});