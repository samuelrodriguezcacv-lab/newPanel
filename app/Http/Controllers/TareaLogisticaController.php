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
        'provincia'    => 'nullable|integer|in:4,11,14,18,21,23,29,41',
    ]);

    // En lugar de TareaLogistica::create(), usamos firstOrCreate para evitar duplicados
$tarea = TareaLogistica::updateOrCreate(
    ['numero_tarea' => $request->numero_tarea],
    [
        'tipo'         => $request->tipo,
        'descripcion'  => $request->descripcion,
        'tarea_sellos' => $request->tarea_sellos,
        'provincia'    => $request->provincia,
        'estado'       => 'pendiente',
    ]
);
   
   return redirect()->route('tareas-logistica.index');
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

    TareaLogistica::findOrFail($id)->update(['estado' => $request->estado]);

    if ($request->expectsJson()) {
        return response()->json(['ok' => true]);
    }

    return redirect()->route('tareas-logistica.index');
}

public function destroy(TareaLogistica $tareasLogistica)
{
    $tareasLogistica->delete();
    return redirect()->route('tareas-logistica.index');
}
}