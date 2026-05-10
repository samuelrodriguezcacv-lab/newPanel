<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EnvioProveedores\PedidoColegioModel;

class OrdenCompraColegioController extends Controller
{
    // 📄 LISTAR
    public function index()
    {
        $pedidos = PedidoColegioModel::with(['colegio', 'proveedor', 'lineas'])->get();

        return inertia('Sellos/Pedidos/PedidosList', [
            'pedidos' => $pedidos
        ]);
    }

    // 📄 VER UNO
    public function show($id)
    {
        $pedido = PedidoColegioModel::with(['colegio', 'proveedor', 'lineas'])
            ->findOrFail($id);

        return inertia('Sellos/Pedidos/DetallePedido', [
            'pedido' => $pedido
        ]);
    }

    // 🧾 CREAR
    public function store(Request $request)
    {
        $pedido = PedidoColegioModel::create([
            'numero_pedido' => $request->numero_pedido,
            'fecha' => $request->fecha,
            'colegio_veterinario_id' => $request->colegio_veterinario_id,
            'proveedor_id' => $request->proveedor_id,
            'estado' => 'borrador'
        ]);

        foreach ($request->lineas as $linea) {
            $pedido->lineas()->create([
                'descripcion' => $linea['descripcion'],
                'unidades' => $linea['unidades'],
                'precio_unitario' => $linea['precio_unitario'],
                'importe' => $linea['unidades'] * $linea['precio_unitario']
            ]);
        }

        // ⚠️ SOLO SI EXISTE
        if (method_exists($pedido, 'recalcularTotales')) {
            $pedido->recalcularTotales();
        }

        return redirect('/sellos/pedidos');
    }

    // 🧾 AÑADIR LÍNEA
    public function addLinea(Request $request, $id)
    {
        $pedido = PedidoColegioModel::findOrFail($id);

        $pedido->lineas()->create([
            'descripcion' => $request->descripcion,
            'unidades' => $request->unidades,
            'precio_unitario' => $request->precio_unitario,
            'importe' => $request->unidades * $request->precio_unitario
        ]);

        return redirect()->back();
    }

    // 🔄 ESTADO
    public function actualizarEstado(Request $request, $id)
    {
        $pedido = PedidoColegioModel::findOrFail($id);

        $pedido->estado = $request->estado;
        $pedido->save();

        return redirect()->back();
    }

    // 🔒 CERRAR
    public function cerrar($id)
    {
        $pedido = PedidoColegioModel::findOrFail($id);

        $pedido->estado = 'cerrado';
        $pedido->save();

        return redirect()->back();
    }
}