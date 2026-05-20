<?php

use App\Http\Controllers\PedidoController;
use Illuminate\Support\Facades\Route;

Route::prefix('pedidos')->name('pedidos.')->group(function () {
    Route::get('/', [PedidoController::class, 'index'])->name('index');
    Route::post('/', [PedidoController::class, 'store'])->name('store');
    Route::get('/{id}', [PedidoController::class, 'show'])->name('show');
    Route::post('/{id}/cerrar', [PedidoController::class, 'cerrar'])->name('cerrar');
    Route::put('/{id}/estado', [PedidoController::class, 'actualizarEstado'])->name('estado');
});
