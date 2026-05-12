<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestSelloController;
use App\Http\Controllers\AllSellosController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\OrdenCompraColegioController;
use App\Http\Controllers\TareaLogisticaController;
use App\Http\Controllers\MetacrilatoController;

use Inertia\Inertia;

// VISTAS INERTIA
Route::get('/', fn() => Inertia::render('Home'));
Route::get('/sellos/dashboard-sellos', fn() => Inertia::render('Sellos/Dashboard/DashboardSellos'));
Route::get('/sellos/pedidos/nuevo-pedido', fn() => Inertia::render('Sellos/Pedidos/NuevoPedido'));
Route::get('/sellos/pedidos', fn() => Inertia::render('Sellos/Pedidos/PedidosList'));
Route::get('/sellos/tareas', fn() => Inertia::render('Sellos/Tareas/TareasList'));
Route::get('/sellos/gestion/todos', fn() => Inertia::render('Sellos/GestionSellos/TodosSellos'));
Route::get('/sellos/gestion/repetidos', fn() => Inertia::render('Sellos/GestionSellos/SellosRepetidos'));
Route::get('/sellos/gestion/provincia', fn() => Inertia::render('Sellos/GestionSellos/SellosPorProvincia'));

Route::get('metacrilatos/{id}/pdf', [MetacrilatoController::class, 'generarPdf'])->name('metacrilatos.pdf');



Route::resource('tareas-logistica', TareaLogisticaController::class)
    ->only(['index', 'store', 'update', 'destroy']);



Route::get('metacrilatos', [MetacrilatoController::class, 'index'])->name('metacrilatos.index');
Route::post('metacrilatos', [MetacrilatoController::class, 'store'])->name('metacrilatos.store');
Route::delete('metacrilatos/{id}', [MetacrilatoController::class, 'destroy'])->name('metacrilatos.destroy');

// Vista Pedidos Proveedores

// OPCIÓN CORRECTA
Route::get('envio-proveedores/dashboard-orden-proveedores', [ProveedorController::class, 'index']);
//Ruta CRUD Proveedores
// Opción A: Usar la ruta que ya tienes (Recomendado para que funcione el recurso)
Route::resource('proveedores', ProveedorController::class)->except(['index']);

Route::get('envio-proveedores/dashboard-orden-proveedores', [ProveedorController::class, 'index']);
Route::post('envio-proveedores/pedidos', [ProveedorController::class, 'crearPedido'])->name('pedidos.crear');
Route::get('envio-proveedores/pedidos/{id}/pdf', [ProveedorController::class, 'generarPdf'])->name('pedidos.pdf');

// API PEDIDOS
Route::get('/pedidos', [PedidoController::class, 'index']);
Route::post('/pedidos', [PedidoController::class, 'store']);
Route::get('/pedidos/{id}', [PedidoController::class, 'show']);

// API TAREAS
Route::get('/tareas', [TareaController::class, 'index']);
Route::post('/tareas', [TareaController::class, 'store']);
Route::put('/tareas/{id}', [TareaController::class, 'update']);
Route::post('/tareas/{id}/sellos', [TareaController::class, 'asignarSellos']);

// API SELLOS
Route::post('/sellos', [AllSellosController::class, 'store']);
Route::get('/api-sellos/todos', [AllSellosController::class, 'index']);
Route::get('/api-sellos/repetidos', [AllSellosController::class, 'repetidos']);
Route::get('/api-sellos/por-provincia', [AllSellosController::class, 'porProvincia']);
Route::post('/sellos/buscar', [AllSellosController::class, 'buscar']);

Route::post('/pedidos/{id}/cerrar', [PedidoController::class, 'cerrar']);
Route::put('/pedidos/{id}/estado', [PedidoController::class, 'actualizarEstado']);

Route::delete('/tareas/{tareaId}/sellos/{selloId}', [TareaController::class, 'eliminarSello']);
Route::delete('/tareas/{id}', [TareaController::class, 'destroy']);
Route::put('/sellos/{id}', [AllSellosController::class, 'update']);

Route::get('/dashboard/metricas', [PedidoController::class, 'metricas']);






