<?php

use App\Http\Controllers\TareaLogisticaController;
use Illuminate\Support\Facades\Route;

Route::prefix('tareas-logistica')->name('tareas-logistica.')->group(function () {
    Route::get('/', [TareaLogisticaController::class, 'index'])->name('index');
    Route::post('/', [TareaLogisticaController::class, 'store'])->name('store');
    Route::put('/{id}', [TareaLogisticaController::class, 'update'])->name('update');
    Route::put('/{id}/estado', [TareaLogisticaController::class, 'update'])->name('estado');
    Route::post('/{id}/sellos', [TareaLogisticaController::class, 'asignarSellos'])->name('sellos.asignar');
    Route::delete('/{id}', [TareaLogisticaController::class, 'destroy'])->name('destroy');
});
