<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\Tarea;

class ImportarSellosPedido202 extends Command
{
    protected $signature = 'sellos:importar202';

    protected $description = 'Importar sellos antiguos del pedido 202';

    public function handle(): int
    {
        $pedido = Pedido::where('numero_pedido', 202)->first();

        if (!$pedido) {
            $pedido = new Pedido();
            $pedido->numero_pedido = 202;
            $pedido->fecha = '2026-05-11';
            $pedido->estado = 'abierto';
            $pedido->save();

            $this->info("✅ Pedido 202 creado con ID {$pedido->id}");
        } else {
            $this->info("ℹ️ Pedido 202 ya existe con ID {$pedido->id}");
        }

        $manuales = [
            41 => [
                ['Pedro Jesús', 'Márquez', 'Aguilar', '0110102130'],
                ['Francisco Luis', 'Jurado', 'Martos', '0141102591'],
                ['María Victoria', 'Soto', 'Ojeda', '0141502592'],
                ['Omaira', 'Benjumea', 'Aguilar', '0141002593'],
                ['Alejandro', 'Jiménez', 'Alonso', '0141602594'],
                ['Victoria', 'Velasco', 'Ponce', '0141202597'],
            ],
            11 => [
                ['Eunice', 'Luque', 'Aguilera', '0111901642'],
                ['Pilar', 'Mula', 'Sánchez-Cossío', '0111401639'],
                ['Mª Isabel', 'Martín de Oliva', 'Rodríguez', '0111101345'],
                ['Cristina Carlota', 'Araujo', 'Gómez', '0111001377'],
                ['Emma', 'Argüelles', 'Miranda', '0111901560'],
                ['Marina Encarnación', 'Bernal', 'Pérez', '0111400852'],
                ['Ignacio', 'Castro', 'Castillo', '0111401643'],
            ],
            4 => [
                ['María de la Paz', 'García', 'Romero', '0104800752'],
                ['Mónica', 'Bordallo', 'Ortiz', '0104300753'],
                ['Lucas', 'Arias', 'López', '0104900754'],
            ],
            14 => [
                ['Manuel', 'Bustos', 'Herrero', '0114502399'],
                ['Ángela', 'Serrano', 'Ayora', '0114602400'],
                ['Marina', 'García', 'Gracia', '0114102401'],
                ['Samuel', 'Barragán', 'Ruano', '0114702402'],
                ['Mar', 'Gómez', 'Marín', '0114202403'],
                ['Renato', 'Aste', 'Ruiz', '0114802404'],
                ['Rafael Jesús', 'Martínez', 'Camacho', '0114302405'],
                ['Adela', 'Castilla', 'Morales', '0114902406'],
                ['Juan', 'Conejero', 'Carrasco', '0114402407'],
                ['Sabrina', 'Galdi', null, '0114102408'],
            ],
            29 => [
                ['Bernardo Antonio', 'Amezquita', 'Suárez', '0129602270'],
                ['Pilar', 'Furest', 'Buendía', '0129102271'],
                ['Laura', 'Díaz', 'Centeno', '0129702272'],
            ],
            23 => [
                ['Almudena', 'Cifuentes', 'Barba', '0123801255'],
                ['Nerea', 'Alarcón', 'Peña', '0123301256'],
                ['Luis Carlos', 'Rodríguez', 'Gárate', '0123901257'],
                ['María', 'Cabeza', 'Sánchez Almero', '0123201254'],
                ['María Almudena', 'Torres', 'Morales', '0123401258'],
            ],
            18 => [
                ['Alison Carla', 'Castañeda', 'Rueda', '0118101291'],
                ['Marta María', 'Manzano', 'Pérez', '0118801264'],
                ['José Miguel', 'Rabaneda', 'Cárdenas', '0118200569'],
                ['Federico', 'Aranda', 'Tudela', '0118100691'],
                ['Mª Teresa', 'Sánchez', 'Tuvilla', '0118600734'],
                ['Violeta', 'López de las Huertas', 'Martínez', '0118801005'],
            ],
        ];

        $automaticos = [
            11 => [
                ['Carmen', 'Astola', 'Pacheco', '0111601632'],
                ['Marta', 'Vadillo', 'Corcos', '0111801640'],
                ['Carolina', 'Romero', 'Luque', '0111601628'],
                ['Emma', 'Argüelles', 'Miranda', '0111901560'],
                ['Ignacio', 'Castro', 'Castillo', '0111401643'],
            ],
            29 => [
                ['Alba', 'Balbuena', 'Evans', '0129702249'],
                ['José Carlos', 'González', 'Brescia', '0129402262'],
            ],
            14 => [
                ['Antonio David', 'Chacón', 'Martos', '0114201463'],
                ['Pablo', 'Rojo', 'Varón', '0114002313'],
                ['Tomás', 'Torralbo', 'Díaz', '0114301446'],
            ],
            41 => [
                ['Pedro Jesús', 'Márquez', 'Aguilar', '0110102130'],
                ['María Dolores', 'Muñoz', 'Peñas', '0141302411'],
                ['Mª Soledad', 'Hidalgo', 'Castro', '0141201158'],
                ['María Cristina', 'Félez', 'Esteban', '0141001730'],
            ],
        ];

        $this->crearTareasPedido($pedido);

        $resManual = $this->importarGrupo($pedido, $manuales, 'manual');
        $resAuto = $this->importarGrupo($pedido, $automaticos, 'automatico');

        $this->newLine();
        $this->info('✅ Importación terminada');
        $this->line("Manuales insertados: {$resManual['insertados']}");
        $this->line("Manuales existentes: {$resManual['existentes']}");
        $this->line("Manuales asociados: {$resManual['asociados']}");
        $this->line("Automáticos insertados: {$resAuto['insertados']}");
        $this->line("Automáticos existentes: {$resAuto['existentes']}");
        $this->line("Automáticos asociados: {$resAuto['asociados']}");

        return self::SUCCESS;
    }

    private function crearTareasPedido(Pedido $pedido): void
    {
        $provincias = [4, 11, 14, 18, 23, 29, 41];

        foreach ($provincias as $provincia) {
            $tarea = Tarea::where('pedido_id', $pedido->id)
                ->where('provincia', $provincia)
                ->first();

            if (!$tarea) {
                $tarea = new Tarea();
                $tarea->Tarea = intval('2020' . str_pad($provincia, 2, '0', STR_PAD_LEFT));
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