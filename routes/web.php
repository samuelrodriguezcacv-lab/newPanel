<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProfileController;
use App\Models\PedidoMetacrilato;
use App\Models\Sellos\PedidoModel as PedidoSellosModel;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::get('/', fn () => redirect()->route('dashboard'))->middleware('auth');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/metricas', [PedidoController::class, 'metricas'])->name('dashboard.metricas');
    Route::get('/dashboard/notificaciones', [DashboardController::class, 'notificaciones'])->name('dashboard.notificaciones');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/email', fn () => Inertia::render('Email/Index'))->name('email.index');
    Route::get('/email/ultimo-pedido', function () {
        $modulo = request()->query('modulo');

        if ($modulo === 'sellos') {
            $pedido = PedidoSellosModel::orderByDesc('numero_pedido')->first();
        } elseif ($modulo === 'metacrilatos') {
            $pedido = PedidoMetacrilato::orderByDesc('numero_pedido')->first();
        } else {
            return response()->json(['pedido' => null]);
        }

        if (!$pedido) {
            return response()->json(['pedido' => null]);
        }

        return response()->json([
            'pedido' => [
                'id' => $pedido->id,
                'numero_pedido' => $pedido->numero_pedido,
                'fecha' => $pedido->fecha,
                'estado' => $pedido->estado,
            ],
        ]);
    })->name('email.ultimo-pedido');

    require __DIR__.'/sellos.php';
    require __DIR__.'/logistica.php';
    require __DIR__.'/proveedores.php';
    require __DIR__.'/pedidos.php';
    require __DIR__.'/metacrilatos.php';
    require __DIR__.'/tareas.php';
    require __DIR__.'/incidencias.php';
    require __DIR__.'/plantilla_envio.php';
});
