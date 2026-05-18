<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController; // <--- Importamos el controlador
use App\Http\Controllers\OrdenProveedorController;
use App\Http\Controllers\AllSellosController;
use App\Http\Controllers\TareaLogisticaController;
use App\Http\Controllers\TareaController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| PUBLIC & BREEZE AUTH
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';

Route::get('/', fn() => Inertia::render('Home'));

/*
|--------------------------------------------------------------------------
| AUTH PROTECTED AREA (Toda tu App)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // El Dashboard ahora es una sola línea súper limpia
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /*
    |--- PROFILE (Breeze) ---
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    // Ruta 1: La que pide el borrador del texto para el textarea de React
Route::post('/envio-proveedores/pedidos/preparar-borrador', [OrdenProveedorController::class, 'prepararBorrador']);
Route::get('/envio-proveedores/pedido/{id}/enviar', [OrdenProveedorController::class, 'vistaEnvio']);
Route::post('/envio-proveedores/pedido/{id}/enviar', [OrdenProveedorController::class, 'enviarDesdePanel']);

// Ruta 2: La que ya tienes que guarda en BD y envía el correo definitivo
Route::post('/envio-proveedores/pedidos', [OrdenProveedorController::class, 'store']);
    
//  Route::prefix('sellos')->group(function () {

//     // CRUD sellos
//     Route::get('/', [AllSellosController::class, 'index']);
//     Route::post('/', [AllSellosController::class, 'store']);
//     Route::put('/{id}', [AllSellosController::class, 'update']);

// });



Route::prefix('tareas-logistica')->group(function () {

    Route::get('/', [TareaLogisticaController::class, 'index']);
    Route::post('/', [TareaLogisticaController::class, 'store']);
    Route::put('/{id}', [TareaLogisticaController::class, 'update']);
    Route::delete('/{id}', [TareaLogisticaController::class, 'destroy']);

    // 🔥 CLAVE: asignar sellos a tarea logística
    Route::post('/{id}/sellos', [TareaLogisticaController::class, 'asignarSellos']);

    // estado
    Route::put('/{id}/estado', [TareaLogisticaController::class, 'update']);
});

/*
    |--------------------------------------------------------------------------
    | CARGA MODULAR DE RUTAS (Tus módulos limpios)
    |--------------------------------------------------------------------------
    */
    require __DIR__.'/sellos.php';
    require __DIR__.'/logistica.php';
    require __DIR__.'/proveedores.php';
    require __DIR__.'/pedidos.php';
    require __DIR__.'/metacrilatos.php';
    require __DIR__.'/tareas.php';
});