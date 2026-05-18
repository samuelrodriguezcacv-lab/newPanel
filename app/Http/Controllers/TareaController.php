<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sellos\TareaSellosModel;
use App\Models\Sellos\AllSellosModel;

class TareaController extends Controller
{
    public function index()
    {
        $tareas = TareaSellosModel::with(['sellos', 'tareaLogistica', 'pedido'])->get();
        return response()->json($tareas, 200);
    }

public function store(Request $request)
{
    try {
        $request->validate([
            'Tarea'               => 'required|integer',
            'fecha'               => 'required|date',
            'estado'              => 'required|in:pendiente,en_proceso,completada',
            'provincia'           => 'required|integer|in:4,11,14,18,21,23,29,41',
            'pedido_id'           => 'nullable|exists:pedidos,id',
            'tareas_logistica_id' => 'nullable|exists:tareas_logistica,id',
            'tarea_id'            => 'nullable|integer',
            'sellos'              => 'nullable|array|max:18',
            'sellos.*'            => 'exists:All_sellos,id',
        ]);

        $tarea = TareaSellosModel::create([
            'numero_tarea'        => $request->Tarea,
            'fecha'               => $request->fecha,
            'estado'              => $request->estado,
            'provincia'           => $request->provincia,
            'pedido_id'           => $request->pedido_id,
            'tarea_id'            => $request->tarea_id,
            'tareas_logistica_id' => $request->tareas_logistica_id,
        ]);

        if ($request->has('sellos')) {
            $tarea->sellos()->attach($request->sellos);
        }

        return response()->json($tarea->load('sellos'), 201);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function asignarSellos(Request $request)
{
    try {
        $request->validate([
            'pedido_id'           => 'required|exists:pedidos,id',
            'tareas_logistica_id' => 'required|exists:tareas_logistica,id',
            'sellos'              => 'required|array|max:18',
            'sellos.*'            => 'exists:All_sellos,id',
        ]);

        foreach ($request->sellos as $selloId) {
            TareaSellosModel::create([
                'pedido_id'           => $request->pedido_id,
                'tareas_logistica_id' => $request->tareas_logistica_id,
                'sello_id'            => $selloId,
                'tipo_uso'            => 'asignado',
                'fecha_uso'           => now(),
            ]);
        }

        return response()->json([
            'message' => 'Sellos asignados correctamente',
        ], 201);

    } catch (\Throwable $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'line'  => $e->getLine(),
            'file'  => $e->getFile(),
        ], 500);
    }
}
    public function eliminarSello(Request $request, $tareaId, $selloId)
    {
        $tarea = TareaSellosModel::findOrFail($tareaId);
        $tarea->sellos()->detach($selloId);
        return response()->json(['message' => 'Sello eliminado'], 200);
    }

    public function destroy($id)
    {
        $tarea = TareaSellosModel::findOrFail($id);
        $tarea->sellos()->detach();
        $tarea->delete();
        return response()->json(['message' => 'Tarea eliminada'], 200);
    }

    public function update(Request $request, $id)
    {
        $tarea = TareaSellosModel::findOrFail($id);

        $request->validate([
            'numero_tarea' => 'sometimes|integer',
            'fecha'        => 'sometimes|date',
            'estado'       => 'sometimes|in:pendiente,en_proceso,completada',
            'provincia'    => 'sometimes|integer|in:4,11,14,18,21,23,29,41',
        ]);

        $tarea->update($request->only([
            'numero_tarea', 'fecha', 'estado', 'provincia'
        ]));

        return response()->json($tarea->load('sellos'), 200);
    }
}