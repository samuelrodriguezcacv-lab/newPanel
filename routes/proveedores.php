<?php
// routes/proveedores.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrdenProveedorController;

/*
|--------------------------------------------------------------------------
| RUTAS DEL MÓDULO: ENVÍO PROVEEDORES
|--------------------------------------------------------------------------
*/

Route::prefix('envio-proveedores')->name('envio-proveedores.')->group(function () {
    Route::get('/', [OrdenProveedorController::class, 'index'])->name('index');
    Route::post('/pedidos', [OrdenProveedorController::class, 'store'])->name('pedidos.store');
    Route::get('/pedidos/{id}/pdf', [OrdenProveedorController::class, 'generarPdf'])->name('pedidos.pdf');

    Route::put('/pedidos/{id}/estado', [OrdenProveedorController::class, 'actualizarEstado'])->name('pedidos.estado');
});