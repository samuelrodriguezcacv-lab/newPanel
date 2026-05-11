<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\Tarea;

class ImportarSellosPedido201 extends Command
{
    protected $signature = 'sellos:importar201';

    protected $description = 'Importar sellos antiguos del pedido 201';

    public function handle(): int
    {
        $pedido = Pedido::where('numero_pedido', 201)->first();

        if (!$pedido) {
            $pedido = new Pedido();
            $pedido->numero_pedido = 201;
            $pedido->fecha = '2026-05-11';
            $pedido->estado = 'abierto';
            $pedido->save();

            $this->info("✅ Pedido 201 creado con ID {$pedido->id}");
        } else {
            $this->info("ℹ️ Pedido 201 ya existe con ID {$pedido->id}");
        }

        $manuales = [
            11 => [
                ['Carolina', 'Romero', 'Luque', '0111601628'],
                ['Sofía', 'Lozano', 'Peral', '0111201635'],
            ],
            29 => [
                ['Isabel', 'Liñán', 'Grana', '0129901735'],
                ['Fátima', 'Quesada', 'Muñoz', '0129702268'],
                ['Susana', 'Conde', 'Ortega', '0129202269'],
                ['Alejandra', 'Palomo', 'López', '0129201358'],
            ],
            14 => [
                ['Alejandra', 'De Benito', 'Cobo', '0114802394'],
                ['Ángela', 'De León', 'Carrascosa', '0114302395'],
                ['Ángela', 'Lirola', 'Rueda', '0114902396'],
                ['Olga', 'Morales', 'Bravo', '0114402397'],
                ['María', 'Sánchez', 'Leal del Ojo', '0114102398'],
            ],
            4 => [
                ['Marta', 'Valero', 'Nacher', '0104300749'],
                ['Natalia', 'Belén', 'Amengual', '0104700750'],
                ['Enrique', 'De Mota', 'Sánchez', '0104200751'],
            ],
        ];

        $automaticos = [
            11 => [
                ['Andrés', 'Antón', 'Portillo', '0111300678'],
                ['Francisco', 'Prieto', 'García', '0111200560'],
            ],
            29 => [
                ['Susana', 'Conde', 'Ortega', '0129202269'],
                ['Mónica', 'Anglada', 'Ortega', '0129601292'],
            ],
        ];

        $this->crearTareasPedido($pedido, array_unique(array_merge(
            array_keys($manuales),
            array_keys($automaticos)
        )));

        $resManual = $this->importarGrupo($pedido, $manuales, 'manual');
        $resAuto = $this->importarGrupo($pedido, $automaticos, 'automatico');

        $this->newLine();
        $this->info('✅ Importación pedido 201 terminada');
        $this->line("Manuales insertados: {$resManual['insertados']}");
        $this->line("Manuales existentes: {$resManual['existentes']}");
        $this->line("Manuales asociados: {$resManual['asociados']}");
        $this->line("Automáticos insertados: {$resAuto['insertados']}");
        $this->line("Automáticos existentes: {$resAuto['existentes']}");
        $this->line("Automáticos asociados: {$resAuto['asociados']}");

        return self::SUCCESS;
    }

    private function crearTareasPedido(Pedido $pedido, array $provincias): void
    {
        foreach ($provincias as $provincia) {
            $provincia = (int) $provincia;

            $tarea = Tarea::where('pedido_id', $pedido->id)
                ->where('provincia', $provincia)
                ->first();

            if (!$tarea) {
                $tarea = new Tarea();
                $tarea->Tarea = intval('2010' . str_pad($provincia, 2, '0', STR_PAD_LEFT));
                $tarea->fecha = $pedido->fecha ?? '2026-05-11';
                $tarea->estado = 'completada';
                $tarea->provincia = $provincia;
                $tarea->pedido_id = $pedido->id;
                $tarea->save();

                $this->info("✅ Tarea creada: {$tarea->Tarea} provincia {$provincia}");
            }
        }
    }

    private function importarGrupo(Pedido $pedido, array $datos, string $tipo): array
    {
        $insertados = 0;
        $existentes = 0;
        $asociados = 0;

        foreach ($datos as $provincia => $sellos) {
            $tarea = Tarea::where('pedido_id', $pedido->id)
                ->where('provincia', (int) $provincia)
                ->first();

            if (!$tarea) {
                $this->error("❌ No existe tarea para provincia {$provincia}");
                continue;
            }

            foreach ($sellos as [$nombre, $apellido1, $apellido2, $codigo]) {
                $codigo = str_pad((string) $codigo, 10, '0', STR_PAD_LEFT);
                $numeroColegiado = substr($codigo, -4);

                $sello = DB::table('all_sellos')
                    ->where('codigo_sello', $codigo)
                    ->first();

                if ($sello) {
                    $existentes++;

                    DB::table('all_sellos')
                        ->where('id', $sello->id)
                        ->update([
                            'prefijo_postal' => (int) $provincia,
                            'updated_at' => now(),
                        ]);

                    $this->line("⏭ Ya existe: {$nombre} {$apellido1}");
                } else {
                    DB::table('all_sellos')->insert([
                        'codigo_sello' => $codigo,
                        'prefijo_postal' => (int) $provincia,
                        'numero_colegiado' => $numeroColegiado,
                        'nombre' => $nombre,
                        'apellido1' => $apellido1,
                        'apellido2' => $apellido2,
                        'tipo_sello' => $tipo,
                        'veces_generado' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $insertados++;

                    $this->info("✅ {$nombre} {$apellido1} — {$codigo}");
                }

                $sello = DB::table('all_sellos')
                    ->where('codigo_sello', $codigo)
                    ->first();

                DB::table('tarea_sello')->updateOrInsert(
                    [
                        'tarea_id' => $tarea->id,
                        'sello_id' => $sello->id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );

                $asociados++;
            }
        }

        return compact('insertados', 'existentes', 'asociados');
    }
}