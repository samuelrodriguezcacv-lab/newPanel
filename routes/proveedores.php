<?php
// routes/proveedores.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrdenProveedorController;
use App\Models\EnvioProveedores\ProveedorModel;

/*
|--------------------------------------------------------------------------
| RUTAS DEL MÓDULO: ENVÍO PROVEEDORES
|--------------------------------------------------------------------------
*/

Route::prefix('envio-proveedores')->name('envio-proveedores.')->group(function () {
    Route::get('/', [OrdenProveedorController::class, 'index'])->name('index');
    Route::post('/pedidos/preparar-borrador', [OrdenProveedorController::class, 'prepararBorrador'])->name('pedidos.preparar-borrador');
    Route::post('/pedidos', [OrdenProveedorController::class, 'store'])->name('pedidos.store');
    Route::get('/pedidos/{id}/pdf', [OrdenProveedorController::class, 'generarPdf'])->name('pedidos.pdf');
    Route::put('/pedidos/{id}/estado', [OrdenProveedorController::class, 'actualizarEstado'])->name('pedidos.estado');
    Route::get('/pedido/{id}/enviar', [OrdenProveedorController::class, 'vistaEnvio'])->name('pedido.enviar');
    Route::post('/pedido/{id}/enviar', [OrdenProveedorController::class, 'enviarDesdePanel'])->name('pedido.enviar.store');
});

Route::get('/api/proveedores/{id}/productos', function ($id) {
    return response()->json(
        ProveedorModel::with('productos')->findOrFail($id)->productos
    );
})->name('api.proveedores.productos');
