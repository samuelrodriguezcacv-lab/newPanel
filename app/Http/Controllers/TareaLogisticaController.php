<?php

namespace App\Http\Controllers;

use App\Models\Sellos\TareaSellosModel;
use App\Models\TareaLogistica;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TareaLogisticaController extends Controller
{
    public function index()
    {
        $tareas = TareaLogistica::orderByRaw("FIELD(estado, 'pendiente', 'en_proceso', 'completada')")
            ->orderByDesc('created_at')
            ->get()
            ->groupBy('tipo');

        return Inertia::render('TareasLogistica/Index', [
            'tareas' => $tareas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'numero_tarea' => 'required|string',
            'tipo' => 'required|in:sellos,metacrilato,anulacion,devolucion,carnets,otro',
            'descripcion' => 'nullable|string|max:255',
            'tarea_sellos' => 'nullable|string',
            'provincia' => 'nullable|integer|in:4,11,14,18,21,23,29,41',
        ]);

        TareaLogistica::updateOrCreate(
            ['numero_tarea' => $request->numero_tarea],
            [
                'tipo' => $request->tipo,
                'descripcion' => $request->descripcion,
                'tarea_sellos' => $request->tarea_sellos,
                'provincia' => $request->provincia,
                'estado' => 'pendiente',
            ]
        );

        return redirect()->route('tareas-logistica.index');
    }

    public function asignarSellos(Request $request, $id)
    {
        $request->validate([
            'pedido_id' => 'nullable|exists:pedidos,id',
            'sellos' => 'required|array|max:18',
            'sellos.*' => 'exists:All_sellos,id',
        ]);

        $tareaLogistica = TareaLogistica::findOrFail($id);

        foreach ($request->sellos as $selloId) {
            TareaSellosModel::firstOrCreate(
                [
                    'tareas_logistica_id' => $tareaLogistica->id,
                    'sello_id' => $selloId,
                    'pedido_id' => $request->pedido_id,
                ],
                [
                    'tipo_uso' => 'asignado',
                    'fecha_uso' => now(),
                ]
            );
        }

        $tareaLogistica->update(['estado' => 'completada']);

        return response()->json([
            'tarea' => $tareaLogistica->load('sellos'),
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,completada',
        ]);

        TareaLogistica::findOrFail($id)->update(['estado' => $request->estado]);

        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }

        return redirect()->route('tareas-logistica.index');
    }

    public function destroy($id)
    {
        TareaSellosModel::where('tareas_logistica_id', $id)->delete();
        TareaLogistica::findOrFail($id)->delete();

        return redirect()->route('tareas-logistica.index');
    }
}
