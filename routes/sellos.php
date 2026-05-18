<?php 
use App\Http\Controllers\AllSellosController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\TareaController;
use Inertia\Inertia;
// ============================================================
// MÓDULO SELLOS — Vistas Inertia
// ============================================================
Route::prefix('sellos')->group(function () {
    Route::get('/dashboard-sellos',     fn() => Inertia::render('Sellos/Dashboard/DashboardSellos'));
    Route::get('/pedidos/nuevo-pedido', fn() => Inertia::render('Sellos/Pedidos/NuevoPedido'));
    Route::get('/pedidos',              fn() => Inertia::render('Sellos/Pedidos/PedidosList'));
    Route::get('/tareas',               fn() => Inertia::render('Sellos/Tareas/TareasList'));
    Route::get('/gestion/todos',        fn() => Inertia::render('Sellos/GestionSellos/TodosSellos'));
    Route::get('/gestion/repetidos',    fn() => Inertia::render('Sellos/GestionSellos/SellosRepetidos'));
    Route::get('/gestion/provincia',    fn() => Inertia::render('Sellos/GestionSellos/SellosPorProvincia'));
});

Route::prefix('api-sellos')->group(function () {
    Route::get('/todos',         [AllSellosController::class, 'index']);
    Route::get('/repetidos',     [AllSellosController::class, 'repetidos']);
    Route::get('/por-provincia', [AllSellosController::class, 'porProvincia']);
});

Route::post('/sellos',        [AllSellosController::class, 'store']);
Route::post('/sellos/buscar', [AllSellosController::class, 'buscar']);
Route::put('/sellos/{id}',    [AllSellosController::class, 'update']);