<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\Tarea;

class ImportarSellosPedido200 extends Command
{
    protected $signature = 'sellos:importar200';

    protected $description = 'Importar sellos antiguos del pedido 200';

    public function handle(): int
    {
        $pedido = Pedido::where('numero_pedido', 200)->first();

        if (!$pedido) {
            $pedido = new Pedido();
            $pedido->numero_pedido = 200;
            $pedido->fecha = '2026-05-11';
            $pedido->estado = 'abierto';
            $pedido->save();

            $this->info("✅ Pedido 200 creado con ID {$pedido->id}");
        } else {
            $this->info("ℹ️ Pedido 200 ya existe con ID {$pedido->id}");
        }

        $manuales = [
            41 => [
                ['Juan Javier', 'García', 'López', '0141700938'],
                ['María', 'Molero', 'Cuadrado', '0141102572'],
                ['Álvaro', 'Pérez', 'Díaz', '0141502573'],
                ['Ana', 'Fraile', 'Capel', '0141002574'],
                ['Marta', 'Madueño', 'García', '0141602575'],
                ['Ana', 'Olías', 'Camero', '0141102576'],
                ['María', 'Muntane', 'Flores', '0141702577'],
                ['Moisés', 'Molina', 'López', '0141202578'],
                ['Clara', 'Pérez', 'Giráldez', '0141802579'],
                ['Clara', 'García', 'Caballos', '0141102580'],
                ['Irene', 'Burguillos', 'Parejo', '0141702581'],
                ['Carolina', 'De Medina', 'Rodríguez', '0141202582'],
                ['María', 'Martín', 'Cárdenas', '0141802583'],
                ['Andrea', 'Almazán', 'Gallardo', '0141302584'],
                ['Valeria', 'Martín', 'Bellido', '0141402586'],
                ['Laura', 'Salado', 'Toucedo', '0141102587'],
                ['Ángela', 'González', 'Sánchez', '0141502588'],
                ['Jerónimo', 'Alarcón de la Lastra', 'Diosdado', '0141002589'],
                ['Eleonora', 'Patrono', 'Saldaña', '0128110645'],
                ['Mª de la Coronada', 'Carmona', 'Domínguez', '0141402590'],
            ],
            11 => [
                ['Nieves', 'Cisneros', 'Rodríguez', '0111501630'],
                ['María Isabel', 'Valle', 'Romay', '0111100924'],
                ['Cecilia', 'Castillo', 'Gómez', '0111001631'],
                ['Izan', 'Pérez', 'Menaches', '0111001627'],
                ['Ainoa', 'Sánchez', 'Ruiz', '0111001579'],
                ['Marta', 'Vallejo', 'Osborne', '0111401624'],
                ['Álvaro', 'Reyes', 'Munell', '0111201620'],
                ['Álvaro', 'Reyes', 'Munell', '0111201620'],
                ['Miguel', 'Osorio', 'Navas', '0111701634'],
            ],
            4 => [
                ['Sofía', 'Rodríguez', 'Ángulo', '0104200406'],
                ['Natalia María', 'Resina', 'Rueda', '0104100745'],
                ['Ana', 'Álvarez', 'Huertas', '0104700746'],
                ['Jorge', 'Sobrino', 'Yacobi', '0104200747'],
                ['Rafaela María', 'Ortega', 'Barranco', '0104800363'],
                ['Carmen', 'García', 'Gil', '0104800748'],
            ],
            14 => [
                ['Noelia', 'Ardanuy', 'García', '0114702388'],
                ['Alejandra', 'Millán', 'Carrero', '0114202389'],
                ['Elena', 'Torre', 'Rubias', '0114602390'],
                ['Antonio Manuel', 'Cano', 'Ruiz', '0114102391'],
                ['Carla', 'Oliveras', 'Aladrén', '0114702392'],
                ['Miguel', 'Hernández', 'Moral', '0114202393'],
            ],
            29 => [
                ['Ana', 'Muñoz', 'Montes', '0129102263'],
                ['María Jesús', 'Alcaide', 'Rubio', '0129901062'],
                ['Cristina', 'Castillo', 'Blonski', '0129502264'],
                ['Pilar', 'Pérez', 'Marín', '0129002265'],
                ['Helena', 'Requena', 'Torres', '0129602266'],
                ['Celia', 'Vidal', 'Calvo', '0129102267'],
            ],
            23 => [
                ['Lucía María', 'Soria', 'Sánchez', '0123101252'],
                ['María Isabel', 'Rufián', 'Ramos', '0123701253'],
            ],
            21 => [
                ['Beatriz', 'Collins', 'Rosado', '0121200851'],
                ['Paloma', 'Cordón', 'Carrellán', '0121800852'],
            ],
            18 => [
                ['Belén Milagrosa', 'Rodríguez', 'de la Torre', '0118301164'],
                ['Ángela', 'Escamilla', 'Pérez', '0118501288'],
                ['Mª Teresa', 'Gallego', 'Ortega', '0118001289'],
                ['José Luis', 'López', 'Almazán', '0118901199'],
                ['Cristina', 'Cepas', 'Aguilera', '0118801207'],
                ['María', 'López', 'Munuera', '0118401290'],
            ],
        ];

        $automaticos = [
            11 => [
                ['Noelia', 'Gómez', 'Mora', '0111801449'],
                ['María Isabel', 'Valle', 'Romay', '0111100924'],
                ['Ariadna', 'Noriega', 'Mel', '0111101633'],
                ['Marina', 'Izquierdo', 'Andamoyo', '0111501626'],
                ['Marta', 'Vallejo', 'Osborne', '0111401624'],
            ],
            18 => [
                ['Javier', 'Maestra', 'Lozano', '0118801043'],
            ],
        ];

        $this->crearTareasPedido($pedido, array_unique(array_merge(
            array_keys($manuales),
            array_keys($automaticos)
        )));

        $resManual = $this->importarGrupo($pedido, $manuales, 'manual');
        $resAuto = $this->importarGrupo($pedido, $automaticos, 'automatico');

        $this->newLine();
        $this->info('✅ Importación pedido 200 terminada');
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
                $tarea->Tarea = intval('2000' . str_pad($provincia, 2, '0', STR_PAD_LEFT));
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