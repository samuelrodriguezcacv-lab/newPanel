<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\Tarea;

class ImportarSellosPedido199 extends Command
{
    protected $signature = 'sellos:importar199';

    protected $description = 'Importar sellos antiguos del pedido 199';

    public function handle(): int
    {
        $pedido = Pedido::where('numero_pedido', 199)->first();

        if (!$pedido) {
            $pedido = new Pedido();
            $pedido->numero_pedido = 199;
            $pedido->fecha = '2026-05-11';
            $pedido->estado = 'abierto';
            $pedido->save();

            $this->info("✅ Pedido 199 creado con ID {$pedido->id}");
        } else {
            $this->info("ℹ️ Pedido 199 ya existe con ID {$pedido->id}");
        }

        $manuales = [
            41 => [
                ['Sara', 'Pérez', 'Becerra', '0141302296'],
                ['Julia', 'Galvarro', 'Cano', '0141702562'],
                ['Adriana', 'Gómez', 'González', '0141802564'],
                ['Ana Belén', 'Ojeda', 'Porcar', '0141302565'],
                ['Elena', 'Ríos', 'Rojas', '0141902566'],
                ['María del Mar', 'Sánchez-Mellado', 'Engo', '0141402567'],
                ['Rocío', 'Rodríguez', 'Esquiliche', '0141102568'],
                ['Patricia', 'Paño', 'Millán', '0141502569'],
                ['Sergio', 'Fernández', 'Bote', '0141902570'],
                ['Federico', 'De Santa Ana', 'Soriano', '0141402571'],
            ],
            18 => [
                ['Anna', 'Tessarolo', null, '0118201278'],
                ['Julio Manuel', 'Escudero Ripoll', null, '0118801279'],
                ['Laura', 'Guerrero', 'Sánchez', '0118101280'],
                ['Mª Luisa', 'López', 'Leyva', '0118700856'],
                ['Yolanda', 'Ruiz', 'Martínez', '0118101036'],
                ['Gonzalo', 'Glagovsky', 'Pustilnik', '0118701281'],
                ['Rocío', 'Martínez García', 'de la Serrana', '0118201282'],
                ['Alicia', 'Latorre', 'Carrillo', '0118801283'],
                ['Francesca', 'di Vico', null, '0118301284'],
                ['Blanca', 'Pulgar', 'Muñoz', '0118901285'],
                ['María del Pilar', 'Prados', 'Linares', '0118100708'],
            ],
            4 => [
                ['María del Mar', 'Bolea', 'Martínez', '0104500704'],
            ],
            14 => [
                ['Lourdes', 'Molina', 'Cordero', '0114502384'],
                ['Lidia', 'Barca', 'Piedras', '0114002385'],
                ['Paula', 'Barraza', 'Manzano', '0114602386'],
                ['Laura', 'Cabrera', 'Sanz', '0114102387'],
            ],
            29 => [
                ['María', 'Font', 'Aparicio', '0129601418'],
                ['Candela', 'Cabrera', 'Vílchez', '0129101438'],
                ['Beatriz', 'Gutiérrez', 'Olmo', '0110902120'],
                ['Antonio Jesús', 'Luque', 'Sillero', '0129602251'],
                ['Ana', 'Moreno', 'Rueda', '0129102252'],
                ['Antonio', 'Vico', 'Miranda', '0129702253'],
                ['Alejandra', 'Saravia', 'Testolin', '0129202254'],
                ['Ana', 'Escalante', 'Díaz', '0129802255'],
                ['María del Alba', 'Gutiérrez', 'Díaz', '0129302256'],
                ['María Nazareth', 'O’neale', 'García', '0129902257'],
                ['Julián Emiliano', 'Vargas', 'Manzino', '0129402258'],
                ['Alba', 'Vidal', 'Valverde', '0129102259'],
                ['María', 'López', 'Mesa', '0129302260'],
                ['Sara', 'García', 'Bispe', '0129902261'],
                ['José Carlos', 'González', 'Brescia', '0129402262'],
            ],
            23 => [
                ['Víctor', 'Lara', 'Herrera', '0123101248'],
                ['Cristina', 'Adán', 'Expósito', '0123701249'],
                ['Isabelle', 'Thérèse', 'Scott', '0123001250'],
                ['Daría', 'Cervera', 'Gómez', '0123601251'],
            ],
            21 => [
                ['Rodrigo', 'Rubiales', 'González', '0121200847'],
                ['María de la Estrella', 'Garrain', 'Guerrero', '0121800848'],
                ['Manuel', 'Salas', 'Villadeamigo', '0121300849'],
                ['Mónica', 'Pascual', 'Romero', '0121700850'],
                ['Isabel', 'Ramos', 'Durán', '0121800713'],
            ],
        ];

        $automaticos = [
            14 => [
                ['Alberto', 'Merino', 'Muñoz', '0114601864'],
            ],
            11 => [
                ['Esther', 'Collado', 'Ramírez', '0111101566'],
            ],
        ];

        $this->crearTareasPedido($pedido, array_unique(array_merge(
            array_keys($manuales),
            array_keys($automaticos)
        )));

        $resManual = $this->importarGrupo($pedido, $manuales, 'manual');
        $resAuto = $this->importarGrupo($pedido, $automaticos, 'automatico');

        $this->newLine();
        $this->info('✅ Importación pedido 199 terminada');
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
                $tarea->Tarea = intval('1990' . str_pad($provincia, 2, '0', STR_PAD_LEFT));
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