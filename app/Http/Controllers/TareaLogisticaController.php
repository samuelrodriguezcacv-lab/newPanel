<?php

namespace App\Http\Controllers;

use App\Models\TareaLogistica;
use Illuminate\Http\Request;
use App\Models\Sellos\TareaModel;
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
    // Validamos, pero eliminamos el "unique" estricto para que no falle la petición antes de tiempo
    $request->validate([
        'numero_tarea' => 'required|string',
        'tipo'         => 'required|in:sellos,metacrilato,anulacion,devolucion,carnets,otro',
        'descripcion'  => 'nullable|string|max:255',
        'tarea_sellos' => 'nullable|string',
    ]);

    // En lugar de TareaLogistica::create(), usamos firstOrCreate para evitar duplicados
    $tarea = TareaLogistica::firstOrCreate(
        ['numero_tarea' => $request->numero_tarea], // Condición de búsqueda
        [
            'tipo'         => $request->tipo,
            'descripcion'  => $request->descripcion,
            'tarea_sellos' => $request->tarea_sellos,
            'estado'       => 'pendiente' // Estado inicial por defecto
        ]
    );

    if ($request->wantsJson() || $request->ajax()) {
        return response()->json($tarea, 201);
    }

    return redirect()->route('tareas-logistica.index')
        ->with('success', 'Tarea procesada correctamente');
}
    


public function asignarSellos(Request $request, $id)
{
    try {

        $request->validate([
            'sellos' => 'required|array|max:18',
            'sellos.*' => 'exists:All_sellos,id',
        ]);

        // ✔ CORRECTO: ahora sí TareaLogistica
        $tareaLogistica = TareaLogistica::findOrFail($id);

        // Si tienes relación con tareas reales
        $tarea = TareaModel::where('tarea_logistica_id', $id)->first();

        if (!$tarea) {
            return response()->json([
                'error' => 'No existe tarea asociada a esta tarea logística'
            ], 404);
        }

        // asignar sellos
        $tarea->sellos()->attach($request->sellos);

        // marcar logística como completada
        $tareaLogistica->update([
            'estado' => 'completada'
        ]);

        return response()->json([
            'tarea' => $tarea->load('sellos'),
            'logistica' => $tareaLogistica
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}

public function update(Request $request, $id)
{
    $request->validate([
        'estado' => 'required|in:pendiente,en_proceso,completada',
    ]);

    $tarea = TareaLogistica::findOrFail($id);
    $tarea->update(['estado' => $request->estado]);

    return response()->json([
        'success' => true,
        'tarea' => $tarea
    ]);
}

public function destroy(TareaLogistica $tareaLogistica)
{
    $tareaLogistica->delete();

    if (request()->wantsJson() || request()->ajax()) {
        return response()->json(['success' => true, 'message' => 'Tarea eliminada'], 200);
    }

    return redirect()->route('tareas-logistica.index')
        ->with('success', 'Tarea eliminada correctamente');
}
}