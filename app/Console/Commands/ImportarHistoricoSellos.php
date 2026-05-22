<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sellos\AllSellosModel;
use App\Models\Sellos\PedidoModel;
use App\Models\Sellos\TareaSellosModel;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportarHistoricoSellos extends Command
{
    protected $signature   = 'sellos:importar-historico';
    protected $description = 'Importa el historial de sellos desde el Excel unificado';

    public function handle()
    {
        $archivo = storage_path('app/historial_sellos_unificado.xlsx');

        if (!file_exists($archivo)) {
            $this->error('No se encuentra el archivo en storage/app/historial_sellos_unificado.xlsx');
            return;
        }

        $this->info('Leyendo Excel...');
        $spreadsheet = IOFactory::load($archivo);
        $hoja        = $spreadsheet->getSheetByName('Formato sistema');
        $filas       = $hoja->toArray(null, true, true, true);

        // Quitar cabecera
        array_shift($filas);

        $creados    = 0;
        $duplicados = 0;
        $errores    = 0;

        $bar = $this->output->createProgressBar(count($filas));
        $bar->start();

        foreach ($filas as $fila) {
            try {
                $prefijo         = str_pad((int) $fila['D'], 2, '0', STR_PAD_LEFT);
                $numeroColegiado = str_pad((int) $fila['E'], 4, '0', STR_PAD_LEFT);
                $codigoGenerado  = $fila['I'];
                $numPedido       = (int) $fila['K'];
                $tipo            = $fila['B'] ?? 'manual';
                $esDuplicado     = (int) ($fila['J'] ?? 0);

                if (!$codigoGenerado || !$numPedido) {
                    $bar->advance();
                    continue;
                }

                // 1. Crear o encontrar el pedido histórico
                $pedido = PedidoModel::firstOrCreate(
                    ['numero_pedido' => $numPedido],
                    [
                        'fecha'  => now()->toDateString(),
                        'estado' => 'cerrado',
                    ]
                );

                // 2. Verificar si el sello ya existe
                $selloExistente = AllSellosModel::where('codigo_sello', $codigoGenerado)->first();

              if ($selloExistente) {
    // Solo contar como duplicado si es manual
                        if ($tipo === 'manual') {
                            $selloExistente->increment('veces_generado');
                            $duplicados++;
                        }
                        $sello = $selloExistente;
                } else {
                    // Crear sello nuevo
                    $sello = AllSellosModel::create([
                        'codigo_sello'     => $codigoGenerado,
                        'prefijo_postal'   => $prefijo,
                        'numero_colegiado' => $numeroColegiado,
                        'nombre'           => $fila['F'] ?? '',
                        'apellido1'        => $fila['G'] ?? '',
                        'apellido2'        => $fila['H'] ?? null,
                        'tipo_sello'       => $tipo,
                        'veces_generado'   => $esDuplicado,
                    ]);
                    $creados++;
                }

                // 3. Crear entrada en tarea_sello si no existe
           $yaAsignado = TareaSellosModel::where('pedido_id', $pedido->id)
    ->where('sello_id', $sello->id)
    ->exists();

if (!$yaAsignado) {
    TareaSellosModel::create([
        'pedido_id'  => $pedido->id,
        'sello_id'   => $sello->id,
        'provincia'  => (int) $fila['D'],
        'fecha'      => now()->toDateString(),
        'estado'     => 'completada',
    ]);
}

            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error en fila: " . $e->getMessage());
                $errores++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Importación completada:");
        $this->line("  Sellos creados:    $creados");
        $this->line("  Duplicados:        $duplicados");
        $this->line("  Errores:           $errores");
    }
}