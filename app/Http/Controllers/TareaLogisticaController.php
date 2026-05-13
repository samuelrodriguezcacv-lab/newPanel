<?php

namespace App\Http\Controllers;

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
            'numero_tarea' => 'required|string|unique:tareas_logistica,numero_tarea',
            'tipo'         => 'required|in:sellos,metacrilato,anulacion,devolucion,carnets,otro',
            'descripcion'  => 'nullable|string|max:255',
            'tarea_sellos' => 'nullable|string',
        ]);

        TareaLogistica::create($request->all());

        return redirect()->route('tareas-logistica.index')
            ->with('success', 'Tarea ' . $request->numero_tarea . ' creada correctamente');
    }

    public function update(Request $request, TareaLogistica $tareasLogistica)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,completada',
        ]);

        $tareasLogistica->update(['estado' => $request->estado]);

        return redirect()->route('tareas-logistica.index')
            ->with('success', 'Estado actualizado correctamente');
    }

    public function destroy(TareaLogistica $tareasLogistica)
    {
        $tareasLogistica->delete();

        return redirect()->route('tareas-logistica.index')
            ->with('success', 'Tarea eliminada correctamente');
    }
    public function apiIndex()
{
    $tareas = TareaLogistica::orderByRaw("FIELD(estado, 'pendiente', 'en_proceso', 'completada')")
        ->orderByDesc('created_at')
        ->get()
        ->groupBy('tipo');

    return response()->json($tareas);
}
}