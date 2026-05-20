<?php

namespace App\Http\Controllers;

use App\Models\Sellos\AllSellosModel;
use App\Models\Sellos\TareaSellosModel;
use Illuminate\Http\Request;

class AllSellosController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'prefijo_postal' => ['required', 'string', 'regex:/^\d{1,2}$/'],
            'numero_colegiado' => ['required', 'string', 'regex:/^\d{1,4}$/'],
            'nombre' => 'required|string|max:255',
            'apellido1' => 'required|string|max:255',
            'apellido2' => 'nullable|string|max:255',
            'tipo_sello' => 'required|in:manual,automatico',
        ]);

        $prefijo = str_pad((int) $request->prefijo_postal, 2, '0', STR_PAD_LEFT);
        $numeroColegiado = str_pad((int) $request->numero_colegiado, 4, '0', STR_PAD_LEFT);

        $codigo = AllSellosModel::generarCodigoSello($prefijo, $numeroColegiado);

        $selloExistente = AllSellosModel::where('codigo_sello', $codigo)->first();

        if ($selloExistente) {
            $selloExistente->increment('veces_generado');

            $pedidosAnteriores = TareaSellosModel::where('sello_id', $selloExistente->id)
                ->with('pedido')
                ->get()
                ->map(fn ($asignacion) => $asignacion->pedido?->numero_pedido)
                ->filter()
                ->unique()
                ->values();

            return response()->json([
                'sello' => $selloExistente->refresh(),
                'repetido' => true,
                'mensaje' => 'Este sello ya fue generado anteriormente.',
                'pedidos' => $pedidosAnteriores,
            ], 200);
        }

        $sello = AllSellosModel::create([
            'codigo_sello' => $codigo,
            'prefijo_postal' => $prefijo,
            'numero_colegiado' => $numeroColegiado,
            'nombre' => $request->nombre,
            'apellido1' => $request->apellido1,
            'apellido2' => $request->apellido2,
            'tipo_sello' => $request->tipo_sello,
            'veces_generado' => 0,
        ]);

        return response()->json([
            'sello' => $sello,
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
            ->with(['tareas'])
            ->orderBy('veces_generado', 'desc')
            ->get()
            ->map(function ($sello) {
                $asignaciones = TareaSellosModel::where('sello_id', $sello->id)
                    ->with(['pedido', 'tareaLogistica'])
                    ->get();

                $sello->historial = $asignaciones->map(fn ($asignacion) => [
                    'tarea' => $asignacion->tareaLogistica?->numero_tarea,
                    'pedido' => $asignacion->pedido?->numero_pedido,
                ])->filter(fn ($item) => $item['pedido'])->values();

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
        $request->validate([
            'prefijo_postal' => ['required', 'string', 'regex:/^\d{1,2}$/'],
            'numero_colegiado' => ['required', 'string', 'regex:/^\d{1,4}$/'],
        ]);

        $prefijo = str_pad((int) $request->prefijo_postal, 2, '0', STR_PAD_LEFT);
        $numeroColegiado = str_pad((int) $request->numero_colegiado, 4, '0', STR_PAD_LEFT);
        $codigo = AllSellosModel::generarCodigoSello($prefijo, $numeroColegiado);
        $sello = AllSellosModel::where('codigo_sello', $codigo)->first();

        return response()->json([
            'existe' => (bool) $sello,
            'sello' => $sello,
            'codigo' => $codigo,
        ]);
    }

    public function update(Request $request, $id)
    {
        $sello = AllSellosModel::findOrFail($id);

        $request->validate([
            'prefijo_postal' => ['required', 'string', 'regex:/^\d{1,2}$/'],
            'numero_colegiado' => ['required', 'string', 'regex:/^\d{1,4}$/'],
            'nombre' => 'required|string|max:255',
            'apellido1' => 'required|string|max:255',
            'apellido2' => 'nullable|string|max:255',
            'tipo_sello' => 'required|in:manual,automatico',
        ]);

        $prefijo = str_pad((int) $request->prefijo_postal, 2, '0', STR_PAD_LEFT);
        $numeroColegiado = str_pad((int) $request->numero_colegiado, 4, '0', STR_PAD_LEFT);
        $codigo = AllSellosModel::generarCodigoSello($prefijo, $numeroColegiado);

        $codigoDuplicado = AllSellosModel::where('codigo_sello', $codigo)
            ->whereKeyNot($sello->id)
            ->exists();

        if ($codigoDuplicado) {
            return response()->json([
                'message' => 'Ya existe otro sello con ese prefijo y numero de colegiado.',
            ], 422);
        }

        $sello->update([
            'codigo_sello' => $codigo,
            'prefijo_postal' => $prefijo,
            'numero_colegiado' => $numeroColegiado,
            'nombre' => $request->nombre,
            'apellido1' => $request->apellido1,
            'apellido2' => $request->apellido2,
            'tipo_sello' => $request->tipo_sello,
        ]);

        return response()->json($sello, 200);
    }
}
