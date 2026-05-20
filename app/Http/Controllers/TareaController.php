<?php

namespace App\Http\Controllers;

use App\Models\Sellos\TareaSellosModel;
use App\Models\TareaLogistica;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    public function index()
    {
        $tareas = TareaLogistica::with(['sellos', 'selloAsignaciones.pedido'])
            ->whereHas('selloAsignaciones')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (TareaLogistica $tarea) => [
                'id' => $tarea->id,
                'Tarea' => $tarea->numero_tarea,
                'numero_tarea' => $tarea->numero_tarea,
                'pedido_id' => $tarea->selloAsignaciones->first()?->pedido_id,
                'provincia' => $tarea->provincia,
                'fecha' => optional($tarea->created_at)->toDateString(),
                'estado' => $tarea->estado,
                'sellos' => $tarea->sellos,
            ]);

        return response()->json($tareas, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Tarea' => 'required|string',
            'fecha' => 'required|date',
            'estado' => 'required|in:pendiente,en_proceso,completada',
            'provincia' => 'required|integer|in:4,11,14,18,21,23,29,41',
            'pedido_id' => 'nullable|exists:pedidos,id',
            'tareas_logistica_id' => 'nullable|exists:tareas_logistica,id',
            'sellos' => 'nullable|array|max:18',
            'sellos.*' => 'exists:All_sellos,id',
        ]);

        $tarea = $request->tareas_logistica_id
            ? TareaLogistica::findOrFail($request->tareas_logistica_id)
            : new TareaLogistica();

        $tarea->fill([
            'numero_tarea' => $request->Tarea,
            'tipo' => 'sellos',
            'estado' => $request->estado,
            'provincia' => $request->provincia,
        ])->save();

        if ($request->filled('sellos')) {
            $this->crearAsignaciones($tarea->id, $request->sellos, $request->pedido_id);
        }

        return response()->json($this->formatearTarea($tarea->load('sellos', 'selloAsignaciones')), 201);
    }

    public function asignarSellos(Request $request, $id = null)
    {
        $rules = [
            'sellos' => 'required|array|max:18',
            'sellos.*' => 'exists:All_sellos,id',
        ];

        if ($id) {
            $rules['pedido_id'] = 'nullable|exists:pedidos,id';
        } else {
            $rules['pedido_id'] = 'required|exists:pedidos,id';
            $rules['tareas_logistica_id'] = 'required|exists:tareas_logistica,id';
        }

        $request->validate($rules);

        $tareaLogisticaId = $id ?: $request->tareas_logistica_id;

        $this->crearAsignaciones($tareaLogisticaId, $request->sellos, $request->pedido_id);

        TareaLogistica::findOrFail($tareaLogisticaId)
            ->update(['estado' => 'completada']);

        return response()->json([
            'message' => 'Sellos asignados correctamente',
        ], 201);
    }

    public function eliminarSello(Request $request, $tareaId, $selloId)
    {
        TareaSellosModel::where('tareas_logistica_id', $tareaId)
            ->where('sello_id', $selloId)
            ->delete();

        return response()->json(['message' => 'Sello eliminado'], 200);
    }

    public function destroy($id)
    {
        TareaSellosModel::where('tareas_logistica_id', $id)->delete();
        TareaLogistica::findOrFail($id)->delete();

        return response()->json(['message' => 'Tarea eliminada'], 200);
    }

    public function update(Request $request, $id)
    {
        $tarea = TareaLogistica::findOrFail($id);

        $request->validate([
            'Tarea' => 'sometimes|string',
            'numero_tarea' => 'sometimes|string',
            'estado' => 'sometimes|in:pendiente,en_proceso,completada',
            'provincia' => 'sometimes|integer|in:4,11,14,18,21,23,29,41',
        ]);

        $data = $request->only(['numero_tarea', 'estado', 'provincia']);

        if ($request->filled('Tarea')) {
            $data['numero_tarea'] = $request->Tarea;
        }

        $tarea->update($data);

        return response()->json($this->formatearTarea($tarea->load('sellos', 'selloAsignaciones')), 200);
    }

    private function crearAsignaciones(int $tareaLogisticaId, array $sellos, ?int $pedidoId): void
    {
        foreach ($sellos as $selloId) {
            TareaSellosModel::firstOrCreate(
                [
                    'pedido_id' => $pedidoId,
                    'tareas_logistica_id' => $tareaLogisticaId,
                    'sello_id' => $selloId,
                ],
                [
                    'tipo_uso' => 'asignado',
                    'fecha_uso' => now(),
                ]
            );
        }
    }

    private function formatearTarea(TareaLogistica $tarea): array
    {
        return [
            'id' => $tarea->id,
            'Tarea' => $tarea->numero_tarea,
            'numero_tarea' => $tarea->numero_tarea,
            'pedido_id' => $tarea->selloAsignaciones->first()?->pedido_id,
            'provincia' => $tarea->provincia,
            'fecha' => optional($tarea->created_at)->toDateString(),
            'estado' => $tarea->estado,
            'sellos' => $tarea->sellos,
        ];
    }
}
