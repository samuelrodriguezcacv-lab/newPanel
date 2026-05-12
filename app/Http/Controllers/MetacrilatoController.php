<?php

namespace App\Http\Controllers;

use App\Models\Metacrilato;
use Illuminate\Http\Request;
use Inertia\Inertia;
use mikehaertl\pdftk\Pdf;

class MetacrilatoController extends Controller
{
    /**
     * Muestra la página principal con el formulario y la lista
     */
    public function index()
    {
        $metacrilatos = Metacrilato::latest()->paginate(20);

        return Inertia::render('Metacrilatos/Index', [
            'metacrilatos' => $metacrilatos,
            'tiposCentro'  => Metacrilato::TIPOS_CENTRO,
        ]);
    }

    /**
     * Guarda el registro en la base de datos
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo_centro'      => 'required|in:' . implode(',', Metacrilato::TIPOS_CENTRO),
            'codigo_registro'  => 'required|string|max:20',
        ]);

        $metacrilato = Metacrilato::create($request->all());

        // Redirigimos de vuelta enviando la URL del PDF como flash data
        return back()->with('pdf_url', route('metacrilatos.pdf', $metacrilato->id));
    }

    /**
     * Genera el PDF usando PDFtk y la plantilla de Sejda
     */
    public function generarPdf($id)
    {
        $metacrilato = Metacrilato::findOrFail($id);
        $templatePath = public_path('templates/Plantilla.pdf');

        $pdf = new Pdf($templatePath);
        
        $result = $pdf->fillForm([
            'tipo_centro'  => $metacrilato->tipo_centro,
            'registro_num' => $metacrilato->codigo_registro,
        ])
        ->flatten() 
        ->saveAs(storage_path('app/public/placa_' . $id . '.pdf'));

        if (!$result) {
            return response()->json(['error' => 'Error de PDFtk: ' . $pdf->getError()], 500);
        }

        return response()->download(storage_path('app/public/placa_' . $id . '.pdf'))
                         ->deleteFileAfterSend();
    }

    /**
     * Elimina un registro
     */
    public function destroy($id)
    {
        Metacrilato::findOrFail($id)->delete();
        return back();
    }
}