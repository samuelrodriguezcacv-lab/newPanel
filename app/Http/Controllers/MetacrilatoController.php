<?php

namespace App\Http\Controllers;

use App\Models\Metacrilato;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetacrilatoController extends Controller
{
    public function index()
    {
        $metacrilatos = Metacrilato::latest()->get();

        return Inertia::render('Metacrilatos/Index', [
            'metacrilatos' => $metacrilatos,
            'tiposCentro'  => Metacrilato::TIPOS_CENTRO,
        ]);
    }

public function store(Request $request)
{
    $request->validate([
        'tipo_centro'        => 'required|in:Consultorio Veterinario,Clínica Veterinaria,Hospital Veterinario,Centro Veterinario',
        'codigo_registro'    => 'required|string|max:20',
        'tarea_logistica_id' => 'nullable|exists:tareas_logistica,id',
    ]);

    Metacrilato::create($request->all());

    // Si viene de una tarea logística → la marca como completada
    if ($request->tarea_logistica_id) {
        \App\Models\TareaLogistica::findOrFail($request->tarea_logistica_id)
            ->update(['estado' => 'completada']);
    }

    return redirect()->route('metacrilatos.index');
}
  public function destroy($id)
{
    Metacrilato::findOrFail($id)->delete();
    return redirect()->route('metacrilatos.index');
}

public function generarPdf($id)
{
    $metacrilato = Metacrilato::findOrFail($id);

    $plantilla = storage_path('app/Plantilla.pdf');
    $output    = storage_path('app/temp/metacrilato-' . $metacrilato->id . '.pdf');

    // Crear carpeta temp si no existe
    if (!file_exists(storage_path('app/temp'))) {
        mkdir(storage_path('app/temp'), 0755, true);
    }

    // Rellenar campos del PDF
    $pdftk = '"C:\Program Files (x86)\PDFtk Server\bin\pdftk.exe"';
    $cmd = $pdftk . ' "' . $plantilla . '" fill_form - output "' . $output . '" flatten';

        $fdf = $this->generarFdf([
            'tipo_centro'     => strtoupper($metacrilato->tipo_centro),
            'numero_registro' => strtoupper($metacrilato->codigo_registro),
        ]);

    $process = proc_open($cmd, [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ], $pipes);

    fwrite($pipes[0], $fdf);
    fclose($pipes[0]);
    proc_close($process);

    return response()->download($output, 'metacrilato-' . $metacrilato->codigo_registro . '.pdf')
        ->deleteFileAfterSend(true);
}

public function previewFormulario(Request $request)
{
    $plantilla = storage_path('app/Plantilla.pdf');
    $output    = storage_path('app/temp/preview-temp.pdf');

    if (!file_exists(storage_path('app/temp'))) {
        mkdir(storage_path('app/temp'), 0755, true);
    }

    $pdftk = '"C:\Program Files (x86)\PDFtk Server\bin\pdftk.exe"';
    $cmd = $pdftk . ' "' . $plantilla . '" fill_form - output "' . $output . '" flatten';

    $fdf = $this->generarFdf([
        'tipo_centro'     => strtoupper($request->tipo_centro),
        'numero_registro' => strtoupper($request->codigo_registro),
    ]);

    $process = proc_open($cmd, [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ], $pipes);

    fwrite($pipes[0], $fdf);
    fclose($pipes[0]);
    proc_close($process);

    return response()->file($output, [
        'Content-Type'        => 'application/pdf',
        'Content-Disposition' => 'inline; filename="preview.pdf"',
    ]);
}

private function generarFdf(array $campos): string
{
    $fdf = "%FDF-1.2\n%âãÏÓ\n1 0 obj\n<</FDF<</Fields[\n";
    foreach ($campos as $nombre => $valor) {
        $fdf .= "<</T(" . $nombre . ")/V(" . $valor . ")>>\n";
    }
    $fdf .= "]>>>>\nendobj\ntrailer\n<</Root 1 0 R>>\n%%EOF\n";
    return $fdf;
}


}