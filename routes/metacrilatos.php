<?php

use App\Http\Controllers\MetacrilatoController;
use Illuminate\Support\Facades\Route;

Route::prefix('metacrilatos')->name('metacrilatos.')->group(function () {
    Route::get('/', [MetacrilatoController::class, 'index'])->name('index');
    Route::get('/pedidos', [MetacrilatoController::class, 'pedidos'])->name('pedidos');
    Route::post('/pedidos/{id}/cerrar', [MetacrilatoController::class, 'cerrarPedido'])->name('pedidos.cerrar');
    Route::put('/pedidos/{id}/estado', [MetacrilatoController::class, 'actualizarEstadoPedido'])->name('pedidos.estado');
    Route::get('/tareas', [MetacrilatoController::class, 'tareas'])->name('tareas');
    Route::get('/gestion/todos', [MetacrilatoController::class, 'todos'])->name('gestion.todos');
    Route::post('/', [MetacrilatoController::class, 'store'])->name('store');
    Route::get('/preview', [MetacrilatoController::class, 'previewFormulario'])->name('preview');
    Route::delete('/{id}', [MetacrilatoController::class, 'destroy'])->name('destroy');
    Route::get('/{id}/pdf', [MetacrilatoController::class, 'generarPdf'])->name('pdf');
});
