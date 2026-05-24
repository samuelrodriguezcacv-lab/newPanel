<?php

namespace App\Http\Controllers;

use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PlantillaEnvioController extends Controller
{
    private const HEADERS = [
        'Nº registro',
        'Nombre',
        'Apellido1',
        'Apellido2',
        'Direccion1',
        'Direccion2',
        'Codigo postal',
        'Poblacion',
        'Provincia',
        'Express',
        'Caja 3kg',
        'Caja 5kg',
        'Caja 10kg',
        'Caja 15kg',
        'Kg Adicional',
        'Telefono',
    ];

    public function index()
    {
        $colegios = ColegioVeterinarioModel::orderBy('provincia')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'direccion', 'ciudad', 'codigo_postal', 'provincia', 'telefono']);

        return Inertia::render('PlantillaEnvio/Index', [
            'colegios' => $colegios,
            'provincias' => $colegios
                ->map(fn ($colegio) => $colegio->provincia ?: $colegio->ciudad)
                ->filter()
                ->unique()
                ->sort()
                ->values(),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'lineas' => 'required|array|min:1',
            'lineas.*.colegio_id' => 'required|exists:colegios_veterinarios,id',
            'lineas.*.express' => 'required|integer|min:0|max:99',
            'lineas.*.caja_3kg' => 'required|integer|min:0|max:999',
            'lineas.*.caja_5kg' => 'required|integer|min:0|max:999',
            'lineas.*.caja_10kg' => 'required|integer|min:0|max:999',
            'lineas.*.caja_15kg' => 'required|integer|min:0|max:999',
            'lineas.*.kg_adicional' => 'required|numeric|min:0|max:999',
        ]);

        $colegios = ColegioVeterinarioModel::whereIn(
            'id',
            collect($validated['lineas'])->pluck('colegio_id')->unique()
        )->get()->keyBy('id');

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Plantilla envio');
        $sheet->fromArray(self::HEADERS, null, 'A1');

        $sheet->getStyle('A1:P1')->getFont()->setBold(true);
        $sheet->getStyle('A1:P1')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FFE2E8F0');

        foreach ($validated['lineas'] as $index => $linea) {
            $colegio = $colegios->get($linea['colegio_id']);
            $row = $index + 2;

            $sheet->setCellValue("A{$row}", 'PEDIDO');
            $sheet->setCellValue("B{$row}", $colegio->nombre);
            $sheet->setCellValue("C{$row}", '');
            $sheet->setCellValue("D{$row}", '');
            $sheet->setCellValue("E{$row}", $colegio->direccion ?? '');
            $sheet->setCellValue("F{$row}", '');
            $sheet->setCellValueExplicit("G{$row}", (string) ($colegio->codigo_postal ?? ''), DataType::TYPE_STRING);
            $sheet->setCellValue("H{$row}", $colegio->ciudad ?? '');
            $sheet->setCellValue("I{$row}", $colegio->provincia ?: ($colegio->ciudad ?? ''));
            $sheet->setCellValue("J{$row}", (int) $linea['express']);
            $sheet->setCellValue("K{$row}", (int) $linea['caja_3kg']);
            $sheet->setCellValue("L{$row}", (int) $linea['caja_5kg']);
            $sheet->setCellValue("M{$row}", (int) $linea['caja_10kg']);
            $sheet->setCellValue("N{$row}", (int) $linea['caja_15kg']);
            $sheet->setCellValue("O{$row}", (float) $linea['kg_adicional']);
            $sheet->setCellValueExplicit("P{$row}", (string) ($colegio->telefono ?? ''), DataType::TYPE_STRING);
        }

        foreach (range('A', 'P') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $filename = 'plantilla-envio-' . now()->format('Ymd-His') . '.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            (new Xlsx($spreadsheet))->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
