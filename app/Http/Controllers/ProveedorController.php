<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EnvioProveedores\ProveedorModel;
use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use App\Models\EnvioProveedores\PedidoColegioModel;
use App\Models\EnvioProveedores\ProductoModel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    public function index()
    {
        $proveedores = ProveedorModel::with('productos')->get();
        $colegios    = ColegioVeterinarioModel::orderBy('nombre')->get();

        return Inertia::render('EnvioProveedores/Dashboard/Dashboard', [
            'proveedores' => $proveedores,
            'colegios'    => $colegios,
        ]);
    }

    public function crearPedido(Request $request)
    {
        $request->validate([
            'proveedor_id'           => 'required|exists:proveedores,id',
            'colegio_veterinario_id' => 'required|exists:colegios_veterinarios,id',
            'lineas'                 => 'required|array|min:1',
            'lineas.*.producto_id'   => 'required|exists:productos,id',
            'lineas.*.unidades'      => 'required|integer|min:1',
        ]);

        $pedido = PedidoColegioModel::create([
            'numero_pedido'          => 'PED-' . strtoupper(uniqid()),
            'fecha'                  => now()->toDateString(),
            'proveedor_id'           => $request->proveedor_id,
            'colegio_veterinario_id' => $request->colegio_veterinario_id,
            'subtotal'               => 0,
            'iva_total'              => 0,
            'total'                  => 0,
            'estado'                 => 'pendiente',
        ]);

        foreach ($request->lineas as $linea) {
            $producto = ProductoModel::find($linea['producto_id']);
            $pedido->lineas()->create([
                'producto_id'     => $producto->id,
                'descripcion'     => $producto->nombre,
                'unidades'        => $linea['unidades'],
                'precio_unitario' => $producto->precio,
                'importe'         => $linea['unidades'] * $producto->precio,
            ]);
        }

        $pedido->recalcularTotales();

        return response()->json(['pedido_id' => $pedido->id]);
    }

    public function generarPdf($id)
    {
        $pedido = PedidoColegioModel::with([
            'proveedor', 'colegio', 'lineas.producto'
        ])->findOrFail($id);

        $pdf = Pdf::loadView('envio-proveedores.albaran', compact('pedido'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('albaran-' . $pedido->numero_pedido . '.pdf');
    }
}