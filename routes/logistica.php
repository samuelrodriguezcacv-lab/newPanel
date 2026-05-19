<?php
// routes/logistica.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TareaLogisticaController;

/*
|--------------------------------------------------------------------------
| RUTAS DEL MÓDULO: LOGÍSTICA
|--------------------------------------------------------------------------
*/

Route::prefix('tareas-logistica')->name('tareas-logistica.')->group(function () {
    Route::get('/', [TareaLogisticaController::class, 'index'])->name('index');
    Route::post('/', [TareaLogisticaController::class, 'store'])->name('store');
    
    // Cambiamos el parámetro a {tareaLogistica} para que coincida exactamente con el Controlador de Laravel
    Route::put('/{tareaLogistica}', [TareaLogisticaController::class, 'update'])->name('update');
    Route::put('/tareas-logistica/{id}', [TareaLogisticaController::class, 'update']);
    Route::delete('/{tareaLogistica}', [TareaLogisticaController::class, 'destroy'])->name('destroy');
});