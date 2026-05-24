<?php

namespace App\Http\Controllers;

use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use App\Models\Incidencia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class IncidenciaController extends Controller
{
    private const ESTADOS = ['abierta', 'en_proceso', 'solucionada', 'cerrada'];

    public function index()
    {
        return Inertia::render('Incidencias/Index', [
            'incidencias' => Incidencia::with('colegio')
                ->latest('fecha')
                ->latest('id')
                ->get(),
            'colegios' => ColegioVeterinarioModel::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => self::ESTADOS,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'descripcion' => 'required|string|min:3',
            'alcance' => ['required', Rule::in(['todos', 'colegio'])],
            'colegio_veterinario_id' => [
                'nullable',
                'required_if:alcance,colegio',
                'exists:colegios_veterinarios,id',
            ],
        ]);

        Incidencia::create([
            'numero_incidencia' => $this->generarNumeroIncidencia(),
            'fecha' => $validated['fecha'],
            'descripcion' => $validated['descripcion'],
            'alcance' => $validated['alcance'],
            'colegio_veterinario_id' => $validated['alcance'] === 'colegio'
                ? $validated['colegio_veterinario_id']
                : null,
            'estado' => 'abierta',
        ]);

        return redirect()->route('incidencias.index')->with('success', 'Incidencia registrada correctamente.');
    }

    public function updateEstado(Request $request, Incidencia $incidencia)
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(self::ESTADOS)],
        ]);

        $incidencia->update([
            'estado' => $validated['estado'],
        ]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }

    private function generarNumeroIncidencia(): string
    {
        $prefijo = 'INC-' . now()->format('Ymd') . '-';
        $siguiente = Incidencia::where('numero_incidencia', 'like', "{$prefijo}%")->count() + 1;

        do {
            $numero = $prefijo . str_pad((string) $siguiente, 4, '0', STR_PAD_LEFT);
            $siguiente++;
        } while (Incidencia::where('numero_incidencia', $numero)->exists());

        return $numero;
    }
}
