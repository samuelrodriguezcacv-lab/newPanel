<?php

use App\Http\Controllers\TareaController;
use Illuminate\Support\Facades\Route;

Route::prefix('tareas')->name('tareas.')->group(function () {
    Route::get('/', [TareaController::class, 'index'])->name('index');
    Route::post('/', [TareaController::class, 'store'])->name('store');
    Route::post('/asignar-sellos', [TareaController::class, 'asignarSellos'])->name('asignar-sellos');
    Route::put('/{id}', [TareaController::class, 'update'])->name('update');
    Route::delete('/{id}', [TareaController::class, 'destroy'])->name('destroy');
    Route::post('/{id}/sellos', [TareaController::class, 'asignarSellos'])->name('sellos.asignar');
    Route::delete('/{tareaId}/sellos/{selloId}', [TareaController::class, 'eliminarSello'])->name('sellos.eliminar');
});
