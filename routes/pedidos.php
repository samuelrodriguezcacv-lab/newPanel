<?php
// routes/pedidos.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\TareaController;

/*
|--------------------------------------------------------------------------
| RUTAS DEL MÓDULO: PEDIDOS (API)
|--------------------------------------------------------------------------
*/

Route::prefix('pedidos')->name('pedidos.')->group(function () {
    Route::get('/', [PedidoController::class, 'index'])->name('index');
    Route::post('/', [PedidoController::class, 'store'])->name('store');
    Route::get('/{id}', [PedidoController::class, 'show'])->name('show');
    Route::post('/{id}/cerrar', [PedidoController::class, 'cerrar'])->name('cerrar');
    Route::put('/{id}/estado', [PedidoController::class, 'actualizarEstado'])->name('estado');
    Route::put('/pedidos/{id}/estado', [PedidoController::class, 'actualizarEstado']);
});

// ============================================================
// MÓDULO SELLOS — API Pedidos / Tareas
// ============================================================


Route::post('/tareas/asignar-sellos', [TareaController::class, 'asignarSellos'])
    ->name('tareas.asignar-sellos');

Route::get('/tareas', [TareaController::class, 'index']);
Route::post('/tareas', [TareaController::class, 'store']);
Route::put('/tareas/{id}', [TareaController::class, 'update']);
Route::delete('/tareas/{id}', [TareaController::class, 'destroy']);
Route::delete('/tareas/{tareaId}/sellos/{selloId}', [TareaController::class, 'eliminarSello']);



Route::get('/pedidos', [PedidoController::class, 'index']);
Route::post('/pedidos', [PedidoController::class, 'store']);
Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
Route::post('/pedidos/{id}/cerrar', [PedidoController::class, 'cerrar']);