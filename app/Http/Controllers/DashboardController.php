<?php

namespace App\Http\Controllers;

use App\Models\PedidoMetacrilato;
use App\Models\Sellos\PedidoModel;
use App\Models\TareaLogistica;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private const HORAS_PEDIDO_ABIERTO_ALERTA = 4;

    public function index()
    {
        $total = TareaLogistica::count();
        $pendiente = TareaLogistica::where('estado', 'pendiente')->count();
        $enProceso = TareaLogistica::where('estado', 'en_proceso')->count();
        $completada = TareaLogistica::where('estado', 'completada')->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total'      => $total,
                'pendiente'  => $pendiente,
                'en_proceso' => $enProceso,
                'completada' => $completada,
            ]
        ]);
    }

    public function notificaciones()
    {
        $limitePedidoAbierto = now()->subHours(self::HORAS_PEDIDO_ABIERTO_ALERTA);

        $tareasPendientes = TareaLogistica::where('estado', 'pendiente')->count();
        $tareasEnProceso = TareaLogistica::where('estado', 'en_proceso')->count();

        $pedidosSellosAbiertos = PedidoModel::where(function ($query) {
                $query->where('estado', 'abierto')->orWhereNull('estado');
            })
            ->where('created_at', '<=', $limitePedidoAbierto)
            ->orderBy('created_at')
            ->get(['id', 'numero_pedido', 'created_at']);

        $pedidosMetacrilatosAbiertos = PedidoMetacrilato::where('estado', 'abierto')
            ->where('created_at', '<=', $limitePedidoAbierto)
            ->orderBy('created_at')
            ->get(['id', 'numero_pedido', 'created_at']);

        return response()->json([
            'umbral_horas_pedido_abierto' => self::HORAS_PEDIDO_ABIERTO_ALERTA,
            'tareas' => [
                'pendientes' => $tareasPendientes,
                'en_proceso' => $tareasEnProceso,
                'sin_finalizar' => $tareasPendientes + $tareasEnProceso,
            ],
            'pedidos_abiertos' => [
                'sellos' => $pedidosSellosAbiertos->count(),
                'metacrilatos' => $pedidosMetacrilatosAbiertos->count(),
                'total' => $pedidosSellosAbiertos->count() + $pedidosMetacrilatosAbiertos->count(),
                'muestras' => $pedidosSellosAbiertos
                    ->map(fn ($pedido) => [
                        'tipo' => 'Sellos',
                        'numero_pedido' => $pedido->numero_pedido,
                        'abierto_desde' => optional($pedido->created_at)->diffForHumans(),
                    ])
                    ->concat($pedidosMetacrilatosAbiertos->map(fn ($pedido) => [
                        'tipo' => 'Metacrilatos',
                        'numero_pedido' => $pedido->numero_pedido,
                        'abierto_desde' => optional($pedido->created_at)->diffForHumans(),
                    ]))
                    ->take(3)
                    ->values(),
            ],
        ]);
    }
}
