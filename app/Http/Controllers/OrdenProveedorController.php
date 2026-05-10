<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EnvioProveedores\PedidoColegioModel;

class OrdenProveedorController extends Controller
{
    public function store(Request $request)
    {
        $pedido = PedidoColegioModel::create([
            'numero_pedido' => 'OP-' . time(),
            'fecha' => now(),
            'colegio_veterinario_id' => $request->colegio_id,
            'proveedor_id' => $request->proveedor_id,
            'estado' => 'borrador'
        ]);

        foreach ($request->lineas as $linea) {
            $pedido->lineas()->create([
                'producto_id' => $linea['producto_id'],
                'descripcion' => $linea['nombre'],
                'unidades' => $linea['cantidad'],
                'precio_unitario' => $linea['precio'],
                'importe' => $linea['cantidad'] * $linea['precio']
            ]);
        }

        $pedido->recalcularTotales();

        return response()->json(
            $pedido->load(['lineas', 'proveedor', 'colegio'])
        );
    }
}