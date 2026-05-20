<?php

namespace App\Http\Controllers;

use App\Models\Metacrilato;
use App\Models\PedidoMetacrilato;
use App\Models\TareaLogistica;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MetacrilatoController extends Controller
{
    public function index()
    {
        $metacrilatos = Metacrilato::with(['tareaLogistica', 'pedidoMetacrilato'])
            ->latest()
            ->get();

        $pedidos = PedidoMetacrilato::withCount('metacrilatos')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Metacrilatos/Index', [
            'metacrilatos' => $metacrilatos,
            'pedidos' => $pedidos,
            'pedidoAbierto' => PedidoMetacrilato::abiertoActual(),
            'tiposCentro' => Metacrilato::TIPOS_CENTRO,
        ]);
    }

    public function pedidos()
    {
        $pedidos = PedidoMetacrilato::with(['metacrilatos.tareaLogistica'])
            ->withCount('metacrilatos')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Metacrilatos/Pedidos', [
            'pedidos' => $pedidos,
        ]);
    }

    public function tareas()
    {
        $tareas = TareaLogistica::with(['metacrilatos.pedidoMetacrilato'])
            ->where('tipo', 'metacrilato')
            ->orderByRaw("FIELD(estado, 'pendiente', 'en_proceso', 'completada')")
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Metacrilatos/Tareas', [
            'tareas' => $tareas,
        ]);
    }

    public function todos()
    {
        $metacrilatos = Metacrilato::with(['tareaLogistica', 'pedidoMetacrilato'])
            ->latest()
            ->get();

        return Inertia::render('Metacrilatos/Todos', [
            'metacrilatos' => $metacrilatos,
            'tiposCentro' => Metacrilato::TIPOS_CENTRO,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo_centro' => ['required', Rule::in(Metacrilato::TIPOS_CENTRO)],
            'codigo_registro' => 'required|string|max:20',
            'tarea_logistica_id' => 'nullable|exists:tareas_logistica,id',
            'pedido_metacrilato_id' => 'nullable|exists:pedidos_metacrilatos,id',
        ]);

        $pedidoMetacrilatoId = $request->pedido_metacrilato_id
            ?: PedidoMetacrilato::abiertoActual()->id;

        Metacrilato::create([
            'tipo_centro' => $request->tipo_centro,
            'codigo_registro' => $request->codigo_registro,
            'tarea_logistica_id' => $request->tarea_logistica_id,
            'pedido_metacrilato_id' => $pedidoMetacrilatoId,
        ]);

        if ($request->tarea_logistica_id) {
            TareaLogistica::findOrFail($request->tarea_logistica_id)
                ->update(['estado' => 'completada']);
        }

        return redirect()->route('metacrilatos.index', [
            'tarea_logistica_id' => $request->tarea_logistica_id,
            'pedido_metacrilato_id' => $pedidoMetacrilatoId,
        ]);
    }

    public function destroy($id)
    {
        Metacrilato::findOrFail($id)->delete();

        return redirect()->route('metacrilatos.index');
    }

    public function actualizarEstadoPedido(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:abierto,cerrado,enviado',
        ]);

        PedidoMetacrilato::findOrFail($id)->update([
            'estado' => $request->estado,
        ]);

        return redirect()->route('metacrilatos.pedidos');
    }

    public function cerrarPedido($id)
    {
        PedidoMetacrilato::findOrFail($id)->update([
            'estado' => 'cerrado',
        ]);

        return redirect()->route('metacrilatos.pedidos');
    }

    public function generarPdf($id)
    {
        $metacrilato = Metacrilato::findOrFail($id);

        $output = $this->rellenarPdfMetacrilato([
            'tipo_veterinario' => mb_strtoupper($metacrilato->tipo_centro, 'UTF-8'),
            'tipo_centro' => mb_strtoupper($metacrilato->tipo_centro, 'UTF-8'),
            'Texto2' => mb_strtoupper($metacrilato->codigo_registro, 'UTF-8'),
            'registro_num' => mb_strtoupper($metacrilato->codigo_registro, 'UTF-8'),
        ]);

        return response()
            ->download($output, 'metacrilato-' . $metacrilato->codigo_registro . '.pdf')
            ->deleteFileAfterSend(true);
    }

    public function previewFormulario(Request $request)
    {
        $request->validate([
            'tipo_centro' => ['nullable', Rule::in(Metacrilato::TIPOS_CENTRO)],
            'codigo_registro' => 'nullable|string|max:20',
        ]);

        $output = $this->rellenarPdfMetacrilato([
            'tipo_veterinario' => mb_strtoupper($request->query('tipo_centro', ''), 'UTF-8'),
            'tipo_centro' => mb_strtoupper($request->query('tipo_centro', ''), 'UTF-8'),
            'Texto2' => mb_strtoupper($request->query('codigo_registro', ''), 'UTF-8'),
            'registro_num' => mb_strtoupper($request->query('codigo_registro', ''), 'UTF-8'),
        ]);

        return response()
            ->file($output, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="preview.pdf"',
            ])
            ->deleteFileAfterSend(true);
    }

    private function generarFdf(array $campos): string
    {
        $fdf = "%FDF-1.2\n";
        $fdf .= "1 0 obj\n";
        $fdf .= "<<\n";
        $fdf .= "/FDF << /Fields [\n";

        foreach ($campos as $nombre => $valor) {
            $nombre = str_replace(['\\', '(', ')'], ['\\\\', '\(', '\)'], $nombre);
            $valorUtf16 = mb_convert_encoding($valor ?? '', 'UTF-16BE', 'UTF-8');
            $valorHex = mb_strtoupper(bin2hex("\xFE\xFF" . $valorUtf16));

            $fdf .= "<< /T ($nombre) /V <$valorHex> >>\n";
        }

        $fdf .= "] >>\n";
        $fdf .= ">>\n";
        $fdf .= "endobj\n";
        $fdf .= "trailer\n";
        $fdf .= "<< /Root 1 0 R >>\n";
        $fdf .= "%%EOF\n";

        return $fdf;
    }

    private function rellenarPdfMetacrilato(array $campos): string
    {
        $plantilla = $this->resolverPlantillaPdf();
        $tempDir = storage_path('app/temp');

        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $baseName = 'metacrilato-' . uniqid('', true);
        $fdfPath = $tempDir . DIRECTORY_SEPARATOR . $baseName . '.fdf';
        $output = $tempDir . DIRECTORY_SEPARATOR . $baseName . '.pdf';

        file_put_contents($fdfPath, $this->generarFdf($campos));

        $pdftk = config('services.pdftk.binary');

        if (!file_exists($pdftk)) {
            @unlink($fdfPath);
            abort(500, 'No se encontro el ejecutable de PDFtk.');
        }

        $cmd = implode(' ', [
            escapeshellarg($pdftk),
            escapeshellarg($plantilla),
            'fill_form',
            escapeshellarg($fdfPath),
            'output',
            escapeshellarg($output),
            'flatten',
        ]);

        exec($cmd . ' 2>&1', $salida, $codigo);
        @unlink($fdfPath);

        if ($codigo !== 0 || !file_exists($output)) {
            abort(500, 'No se pudo generar el PDF del metacrilato.');
        }

        return $output;
    }

    private function resolverPlantillaPdf(): string
    {
        $candidatas = [
            storage_path('app/Plantilla.pdf'),
            public_path('templates/Plantilla.pdf'),
        ];

        foreach ($candidatas as $plantilla) {
            if (file_exists($plantilla)) {
                return $plantilla;
            }
        }

        abort(500, 'No se encontro la plantilla PDF de metacrilatos.');
    }
}
