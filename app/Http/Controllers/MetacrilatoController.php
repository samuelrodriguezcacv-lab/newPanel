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
        $tempDir   = storage_path('app/temp');

        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $fdfPath = $tempDir . '/metacrilato-' . $metacrilato->id . '.fdf';
        $output  = $tempDir . '/metacrilato-' . $metacrilato->id . '.pdf';

        if (file_exists($output)) {
            unlink($output);
        }

$fdf = $this->generarFdf([
    'Tipología' => strtoupper($request->query('tipo_centro', '')),
    'Texto2'    => strtoupper($request->query('codigo_registro', '')),
]);
        file_put_contents($fdfPath, $fdf);

        $pdftk = 'C:\Program Files (x86)\PDFtk Server\bin\pdftk.exe';

        $cmd = '"' . $pdftk . '" "' . $plantilla . '" fill_form "' . $fdfPath . '" output "' . $output . '" flatten';

        exec($cmd . ' 2>&1', $salida, $codigo);

        if ($codigo !== 0 || !file_exists($output)) {
            dd([
                'error' => 'No se pudo generar el PDF',
                'cmd' => $cmd,
                'codigo' => $codigo,
                'salida' => $salida,
                'plantilla_existe' => file_exists($plantilla),
                'fdf_existe' => file_exists($fdfPath),
                'fdf' => $fdf,
            ]);
        }

        return response()
            ->download($output, 'metacrilato-' . $metacrilato->codigo_registro . '.pdf')
            ->deleteFileAfterSend(true);
    }

    public function previewFormulario(Request $request)
    {
        $plantilla = storage_path('app/Plantilla.pdf');
        $tempDir   = storage_path('app/temp');

        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $fdfPath = $tempDir . '/preview-temp.fdf';
        $output  = $tempDir . '/preview-temp.pdf';

        if (file_exists($output)) {
            unlink($output);
        }

            $fdf = $this->generarFdf([
                'Tipología' => strtoupper($request->query('tipo_centro', '')),
                'Texto2'    => strtoupper($request->query('codigo_registro', '')),
            ]);

        file_put_contents($fdfPath, $fdf);

        $pdftk = 'C:\Program Files (x86)\PDFtk Server\bin\pdftk.exe';

        $cmd = '"' . $pdftk . '" "' . $plantilla . '" fill_form "' . $fdfPath . '" output "' . $output . '" flatten';

        exec($cmd . ' 2>&1', $salida, $codigo);

        if ($codigo !== 0 || !file_exists($output)) {
            dd([
                'error' => 'No se pudo generar la vista previa',
                'cmd' => $cmd,
                'codigo' => $codigo,
                'salida' => $salida,
                'plantilla_existe' => file_exists($plantilla),
                'fdf_existe' => file_exists($fdfPath),
                'fdf' => $fdf,
                'request' => $request->all(),
            ]);
        }

        return response()->file($output, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="preview.pdf"',
        ]);
    }

    private function generarFdf(array $campos): string
    {
        $fdf = "%FDF-1.2\n";
        $fdf .= "1 0 obj\n";
        $fdf .= "<<\n";
        $fdf .= "/FDF << /Fields [\n";

        foreach ($campos as $nombre => $valor) {
            $valor = $valor ?? '';

            $valor = str_replace(
                ['\\', '(', ')'],
                ['\\\\', '\(', '\)'],
                $valor
            );

            $fdf .= "<< /T ($nombre) /V ($valor) >>\n";
        }

        $fdf .= "] >>\n";
        $fdf .= ">>\n";
        $fdf .= "endobj\n";
        $fdf .= "trailer\n";
        $fdf .= "<< /Root 1 0 R >>\n";
        $fdf .= "%%EOF\n";

        return $fdf;
    }
}