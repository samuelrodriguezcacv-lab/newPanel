<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\Tarea;

class ImportarSellosPedido198 extends Command
{
    protected $signature = 'sellos:importar198';

    protected $description = 'Importar sellos antiguos del pedido 198';

    public function handle(): int
    {
        $pedido = Pedido::where('numero_pedido', 198)->first();

        if (!$pedido) {
            $pedido = new Pedido();
            $pedido->numero_pedido = 198;
            $pedido->fecha = '2026-05-11';
            $pedido->estado = 'abierto';
            $pedido->save();

            $this->info("✅ Pedido 198 creado con ID {$pedido->id}");
        } else {
            $this->info("ℹ️ Pedido 198 ya existe con ID {$pedido->id}");
        }

        $manuales = [
            14 => [
                ['Ana', 'López', 'Del Valle', '0114802375'],
                ['Eva', 'Casado', 'Egea', '0114302376'],
                ['Elena', 'López', 'Baranda', '0114902377'],
                ['Francisco', 'Pozo', 'Vizuete', '0114402378'],
                ['Ángela', 'Almohano', 'Carrasco', '0114102379'],
                ['Pilar María', 'Águila', 'Martín', '0114302380'],
                ['Lucía', 'Rodríguez', 'Rodríguez', '0114902381'],
                ['Luis', 'Muñoz', 'Moral', '0114402382'],
                ['Beatriz', 'López de la Manzanara', 'Márquez', '0114102383'],
            ],
            18 => [
                ['Alfredo', 'Pérez', 'Planelles', '0118001274'],
                ['Ana', 'Espigares', 'Vallecillos', '0118601275'],
                ['Esther', 'Reyes', 'Molina', '0118101276'],
                ['Nieves', 'Gómez', 'Entrena', '0118701277'],
                ['Marina', 'Guardiola', 'Ivars', '0118701180'],
                ['Patricia', 'Toro', 'Cano', '0118401267'],
                ['Eva', 'Olvera', 'Quero', '0118101268'],
            ],
            4 => [
                ['Andrea', 'Oliva', 'Marín', '0104100741'],
                ['Yolanda', 'Ruiz', 'Martínez', '0104500742'],
                ['María Del Mar', 'Hernandez-Carrillo', 'Cuadrado', '0104000743'],
                ['Carmen', 'Martín', 'Ros', '0104600744'],
                ['Alberto Jesús', 'Consuegra', 'Rubio', '0104100135'],
                ['María Del Pilar', 'Acero', 'Ojeda', '0104300196'],
            ],
            11 => [
                ['Luis', 'Flores', 'Girón', '0111600789'],
                ['Patricia', 'Cortina', 'Alcedo', '0111001612'],
                ['Francisco José', 'Pérez', 'Escribano', '0111800437'],
                ['María', 'Solano', 'Márquez', '0111301622'],
            ],
            29 => [
                ['Álvaro', 'Sánchez Del Corral', 'Gómez De Aranda', '0129602232'],
                ['Luis', 'Roque', 'Rodríguez', '0129102233'],
                ['Patricia', 'Bañuls', 'Naranjo', '0129702234'],
                ['María', 'Rivero', 'Bernáldez', '0129202235'],
                ['Lucía', 'Escudero', 'Martín', '0129802236'],
                ['Ana Isabel', 'Gómez', 'Herranz', '0129302237'],
                ['Julio Benjamín', 'De Gabriel', 'Sánchez', '0129902238'],
                ['Adriana', 'López', 'Márquez', '0129402239'],
                ['María Del Carmen', 'Toledo', 'Pacheco', '0129802240'],
                ['John', 'Flothmann', null, '0129302241'],
                ['Ana', 'Morillas', 'Caparrós', '0129902242'],
                ['María Auxiliadora', 'Díez', 'González', '0129402243'],
                ['Maximiliano', 'Altamirano', 'Sattino', '0129102244'],
                ['Selene', 'Schapovaloff', 'González', '0129502245'],
                ['Julieta Cecilia', 'Fasciani', null, '0129002246'],
                ['Patricia', 'Tirado', 'Calzas', '0129602247'],
                ['María', 'Fernández', 'Pérez', '0129102248'],
                ['Alba', 'Balbuena', 'Evans', '0129702249'],
                ['Aroa', 'García', 'León', '0129002250'],
            ],
        ];

        $automaticos = [
            11 => [
                ['Patricia', 'Galiana', 'Arias', '0111701571'],
                ['Luis', 'Flores', 'Girón', '0111600789'],
                ['Patricia', 'Cortina', 'Alcedo', '0111001612'],
            ],
            29 => [
                ['Sara', 'Merino', 'León', '0129502230'],
            ],
            41 => [
                ['Cristina', 'Peinado', 'Guitart', '0141901449'],
                ['Paola', 'Montalvo', 'González', '0141601952'],
            ],
        ];

        $this->crearTareasPedido($pedido, array_unique(array_merge(
            array_keys($manuales),
            array_keys($automaticos)
        )));

        $resManual = $this->importarGrupo($pedido, $manuales, 'manual');
        $resAuto = $this->importarGrupo($pedido, $automaticos, 'automatico');

        $this->newLine();
        $this->info('✅ Importación pedido 198 terminada');
        $this->line("Manuales insertados: {$resManual['insertados']}");
        $this->line("Manuales repetidos: {$resManual['existentes']}");
        $this->line("Manuales asociados: {$resManual['asociados']}");
        $this->line("Automáticos insertados: {$resAuto['insertados']}");
        $this->line("Automáticos repetidos: {$resAuto['existentes']}");
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
                $tarea->Tarea = intval('1980' . str_pad($provincia, 2, '0', STR_PAD_LEFT));
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
    $repetidos = 0;
    $yaAsociados = 0;
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

            if (!$sello) {
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

                $sello = DB::table('all_sellos')
                    ->where('codigo_sello', $codigo)
                    ->first();

                $insertados++;

                $this->info("✅ Nuevo: {$nombre} {$apellido1} — {$codigo}");
            } else {
                $yaExisteEnEstaTarea = DB::table('tarea_sello')
                    ->where('tarea_id', $tarea->id)
                    ->where('sello_id', $sello->id)
                    ->exists();

                if ($yaExisteEnEstaTarea) {
                    $yaAsociados++;

                    $this->line("⏭ Ya estaba asociado: {$nombre} {$apellido1} — {$codigo}");

                    continue;
                }

                $repeticiones = DB::table('tarea_sello')
                    ->join('tareas', 'tarea_sello.tarea_id', '=', 'tareas.id')
                    ->join('pedidos', 'tareas.pedido_id', '=', 'pedidos.id')
                    ->where('tarea_sello.sello_id', $sello->id)
                    ->select(
                        'pedidos.numero_pedido',
                        'tareas.Tarea',
                        'tareas.provincia'
                    )
                    ->get();

                if ($repeticiones->isNotEmpty()) {
                    $repetidos++;

                    $this->warn("🔁 Repetido real: {$nombre} {$apellido1} — {$codigo}");

                    foreach ($repeticiones as $rep) {
                        $this->line("   ↳ Pedido {$rep->numero_pedido}, tarea {$rep->Tarea}, provincia {$rep->provincia}");
                    }
                } else {
                    $this->line("ℹ️ Existe en catálogo sin pedido previo: {$nombre} {$apellido1} — {$codigo}");
                }

                DB::table('all_sellos')
                    ->where('id', $sello->id)
                    ->update([
                        'prefijo_postal' => (int) $provincia,
                        'updated_at' => now(),
                    ]);
            }

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

            $totalUsos = DB::table('tarea_sello')
                ->where('sello_id', $sello->id)
                ->count();

            DB::table('all_sellos')
                ->where('id', $sello->id)
                ->update([
                    'veces_generado' => $totalUsos,
                    'updated_at' => now(),
                ]);
        }
    }

    return [
        'insertados' => $insertados,
        'existentes' => $repetidos,
        'ya_asociados' => $yaAsociados,
        'asociados' => $asociados,
    ];
}
}