<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sellos\TareaModel;  // ← corregido, usaba "Tarea" que no existe

class TareaController extends Controller
{
    public function index()
    {
     $tareas = TareaModel::with(['sellos', 'tareaLogistica'])->get();
    }

public function store(Request $request)
{
    try {
        $request->validate([
            'Tarea'      => 'required|integer|unique:tareas,Tarea',
            'fecha'      => 'required|date',
            'estado'     => 'required|in:pendiente,en_proceso,completada',
            'provincia'  => 'required|integer|in:4,11,14,18,21,23,29,41',
            'pedido_id'  => 'nullable|exists:pedidos,id',
            'sellos'     => 'nullable|array|max:18',
            'sellos.*'   => 'exists:All_sellos,id',
            'tarea_logistica_id' => 'nullable|exists:tareas_logistica,id', // 
        ]);

        $tarea = TareaModel::create([
            'Tarea'      => $request->Tarea,
            'fecha'      => $request->fecha,
            'estado'     => $request->estado,
            'provincia'  => $request->provincia,
            'pedido_id'  => $request->pedido_id,
            'tarea_logistica_id' => 'nullable|exists:tareas_logistica,id', // 
        ]);

        if ($request->has('sellos')) {
            $tarea->sellos()->attach($request->sellos);
        }

        return response()->json($tarea->load('sellos'), 201);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function asignarSellos(Request $request, $id)
{
    try {
        $tarea = TareaModel::findOrFail($id);

        $request->validate([
            'sellos'   => 'required|array|max:18',
            'sellos.*' => 'exists:All_sellos,id',
        ]);

        foreach ($request->sellos as $selloId) {
            // Verifica si este sello ya está en otra tarea
            $yaAsignado = \App\Models\Sellos\AllSellosModel::find($selloId)
                ->tareas()
                ->where('tareas.id', '!=', $id)
                ->exists();

            if ($yaAsignado) {
                // Incrementa veces_generado
                \App\Models\Sellos\AllSellosModel::find($selloId)->increment('veces_generado');
            }
        }

        $tarea->sellos()->attach($request->sellos);

        return response()->json($tarea->load('sellos'), 200);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function eliminarSello(Request $request, $tareaId, $selloId)
{
    $tarea = TareaModel::findOrFail($tareaId);
    $tarea->sellos()->detach($selloId);
    return response()->json(['message' => 'Sello eliminado'], 200);
}
public function destroy($id)
{
    $tarea = TareaModel::findOrFail($id);
    $tarea->sellos()->detach(); // elimina la pivote primero
    $tarea->delete();
    return response()->json(['message' => 'Tarea eliminada'], 200);
}

public function update(Request $request, $id)
{
    $tarea = TareaModel::findOrFail($id);

    $request->validate([
        'Tarea'     => 'sometimes|integer|unique:tareas,Tarea,' . $id,
        'fecha'     => 'sometimes|date',
        'estado'    => 'sometimes|in:pendiente,en_proceso,completada',
        'provincia' => 'sometimes|integer|in:4,11,14,18,21,23,29,41',
    ]);

    $tarea->update($request->only(['Tarea', 'fecha', 'estado', 'provincia']));

    return response()->json($tarea->load('sellos'), 200);
}




}