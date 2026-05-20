<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sellos\PedidoModel;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index()
    {
        $pedidos = PedidoModel::with([
            'tareas.sello',
            'tareas.tareaLogistica',
        ])->get();

        return response()->json($pedidos, 200);
    }

    public function store(Request $request)
    {
        $pedido = PedidoModel::abiertoActual();

        return response()->json($pedido, 201);
    }

    public function cerrar($id)
{
    $pedido = PedidoModel::findOrFail($id);
    $pedido->update(['estado' => 'cerrado']);
    return response()->json($pedido, 200);
}

public function actualizarEstado(Request $request, $id)
{
    $pedido = PedidoModel::findOrFail($id);
    $request->validate([
        'estado' => 'required|in:abierto,cerrado,enviado',
    ]);
    $pedido->update(['estado' => $request->estado]);
    return response()->json($pedido, 200);
}

    public function show($id)
    {
        $pedido = PedidoModel::with([
            'tareas.sello',
            'tareas.tareaLogistica',
        ])->findOrFail($id);

        return response()->json($pedido, 200);
    }

public function metricas()
{
    $totalPedidos      = PedidoModel::whereMonth('created_at', now()->month)->count();
    $totalSellos       = \App\Models\Sellos\AllSellosModel::count();
    $sellosRepetidos   = \App\Models\Sellos\AllSellosModel::where('veces_generado', '>', 0)->count();
    $pedidosAbiertos   = PedidoModel::where('estado', 'abierto')->orWhereNull('estado')->count();
    $pedidosCerrados   = PedidoModel::where('estado', 'cerrado')->count();
    $pedidosEnviados   = PedidoModel::where('estado', 'enviado')->count();
    $totalManuales     = \App\Models\Sellos\AllSellosModel::where('tipo_sello', 'manual')->count();
    $totalAutomaticos  = \App\Models\Sellos\AllSellosModel::where('tipo_sello', 'automatico')->count();
    $sellosPorProvincia = \App\Models\Sellos\AllSellosModel::selectRaw('prefijo_postal, count(*) as total')
        ->groupBy('prefijo_postal')
        ->get();

    return response()->json([
        'total_pedidos'     => $totalPedidos,
        'total_sellos'      => $totalSellos,
        'sellos_repetidos'  => $sellosRepetidos,
        'total_manuales'    => $totalManuales,
        'total_automaticos' => $totalAutomaticos,
        'pedidos_abiertos'  => $pedidosAbiertos,
        'pedidos_cerrados'  => $pedidosCerrados,
        'pedidos_enviados'  => $pedidosEnviados,
        'sellos_provincia'  => $sellosPorProvincia,
    ]);
}
}
