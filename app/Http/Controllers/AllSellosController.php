<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sellos\AllSellosModel;
use Illuminate\Http\Request;

class AllSellosController extends Controller
{
public function store(Request $request)
{
    $request->validate([
        'prefijo_postal'   => 'required|integer|between:1,99',
        'numero_colegiado' => 'required|integer',
        'nombre'           => 'required|string|max:255',
        'apellido1'        => 'required|string|max:255',
        'apellido2'        => 'nullable|string|max:255',
        'tipo_sello'       => 'required|in:manual,automatico',
    ]);

    $codigo = AllSellosModel::generarCodigoSello(
        $request->prefijo_postal,
        $request->numero_colegiado
    );

    // Busca si el sello ya existe
    $selloExistente = AllSellosModel::where('codigo_sello', $codigo)->first();

    if ($selloExistente) {
        

        // Busca en qué pedidos apareció
        $pedidosAnteriores = $selloExistente->tareas()
            ->with('pedido')
            ->get()
            ->map(fn($t) => $t->pedido?->numero_pedido)
            ->filter()
            ->unique()
            ->values();

        return response()->json([
            'sello'      => $selloExistente,
            'repetido'   => true,
            'mensaje'    => 'Este sello ya fue generado anteriormente.',
            'pedidos'    => $pedidosAnteriores,
        ], 200);
    }

    // Si no existe lo crea
    $sello = AllSellosModel::create([
        'codigo_sello'     => $codigo,
        'prefijo_postal'   => $request->prefijo_postal,
        'numero_colegiado' => $request->numero_colegiado,
        'nombre'           => $request->nombre,
        'apellido1'        => $request->apellido1,
        'apellido2'        => $request->apellido2,
        'tipo_sello'       => $request->tipo_sello,
        'veces_generado'   => 0,
    ]);

    return response()->json([
        'sello'    => $sello,
        'repetido' => false,
    ], 201);
}

     public function index()
{
    $sellos = AllSellosModel::orderBy('created_at', 'desc')->get();
    return response()->json($sellos, 200);
}

public function repetidos()
{
    $sellos = AllSellosModel::where('veces_generado', '>', 0)
        ->with(['tareas.pedido'])
        ->orderBy('veces_generado', 'desc')
        ->get()
        ->map(function ($sello) {
            $sello->historial = $sello->tareas->map(fn($t) => [
                'tarea'  => $t->Tarea,
                'pedido' => $t->pedido?->numero_pedido,
            ])->filter(fn($t) => $t['pedido'])->values();
            return $sello;
        });

    return response()->json($sellos, 200);
}
public function porProvincia()
{
    $sellos = AllSellosModel::orderBy('prefijo_postal')
        ->get()
        ->groupBy('prefijo_postal');
    return response()->json($sellos, 200);
}


public function buscar(Request $request)
{
    $codigo = AllSellosModel::generarCodigoSello(
        $request->prefijo_postal,
        $request->numero_colegiado
    );

    $sello = AllSellosModel::where('codigo_sello', $codigo)->first();

    return response()->json([
        'existe'  => (bool) $sello,
        'sello'   => $sello,
        'codigo'  => $codigo,
    ]);
}
public function update(Request $request, $id)
{
    $sello = AllSellosModel::findOrFail($id);

    $request->validate([
        'prefijo_postal'   => 'required|integer|between:1,99',
        'numero_colegiado' => 'required|integer',
        'nombre'           => 'required|string|max:255',
        'apellido1'        => 'required|string|max:255',
        'apellido2'        => 'nullable|string|max:255',
        'tipo_sello'       => 'required|in:manual,automatico',
    ]);

    // Regenera el código
    $codigo = AllSellosModel::generarCodigoSello(
        $request->prefijo_postal,
        $request->numero_colegiado
    );

    $sello->update([
        'codigo_sello'     => $codigo,
        'prefijo_postal'   => $request->prefijo_postal,
        'numero_colegiado' => $request->numero_colegiado,
        'nombre'           => $request->nombre,
        'apellido1'        => $request->apellido1,
        'apellido2'        => $request->apellido2,
        'tipo_sello'       => $request->tipo_sello,
    ]);

    return response()->json($sello, 200);
}
}
