<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sellos\AllSellosModel;
use App\Models\Sellos\TareaModel;
use Illuminate\Support\Facades\DB;

class ImportarFaltantes203 extends Command
{
    protected $signature   = 'sellos:importar203';
    protected $description = 'Importa los sellos faltantes del pedido 203';

    public function handle()
    {
        // Crear tarea para el pedido 203
        $tarea = TareaModel::firstOrCreate(
            ['Tarea' => 9999, 'pedido_id' => 1],
            [
                'fecha'     => now(),
                'estado'    => 'completada',
                'provincia' => 41,
                'pedido_id' => 1,
            ]
        );

        $this->info("Tarea: {$tarea->id}");

        $sellos = [
            // MANUALES
            ['prefijo' => '41', 'numero' => '2306', 'nombre' => 'Elena Isabel',      'ap1' => 'Bravo',      'ap2' => 'Sánchez',    'tipo' => 'manual',     'codigo' => '0141302306'],
            ['prefijo' => '11', 'numero' => '1176', 'nombre' => 'Cristina',          'ap1' => 'Sánchez',    'ap2' => 'Montaño',    'tipo' => 'manual',     'codigo' => '0111601176'],
            ['prefijo' => '11', 'numero' => '1645', 'nombre' => 'Sheila',            'ap1' => 'Málaga',     'ap2' => 'Orgaz',      'tipo' => 'manual',     'codigo' => '0111501645'],
            ['prefijo' => '11', 'numero' => '1638', 'nombre' => 'Rosa María',        'ap1' => 'Corral',     'ap2' => 'Mayo',       'tipo' => 'manual',     'codigo' => '0111901638'],
            ['prefijo' => '14', 'numero' => '2409', 'nombre' => 'Belén',             'ap1' => 'Marín',      'ap2' => 'Calderón',   'tipo' => 'manual',     'codigo' => '0114502409'],
            ['prefijo' => '14', 'numero' => '2410', 'nombre' => 'Ayrton Armando',    'ap1' => 'Talamona',   'ap2' => null,         'tipo' => 'manual',     'codigo' => '0114902410'],
            ['prefijo' => '14', 'numero' => '2411', 'nombre' => 'Juan Alfonso',      'ap1' => 'Carmona',    'ap2' => 'Femenía',    'tipo' => 'manual',     'codigo' => '0114402411'],
            ['prefijo' => '14', 'numero' => '1708', 'nombre' => 'Ana Belén',         'ap1' => 'Jiménez',    'ap2' => 'García',     'tipo' => 'manual',     'codigo' => '0114701708'],
            ['prefijo' => '29', 'numero' => '1998', 'nombre' => 'María',             'ap1' => 'Pulido',     'ap2' => 'Pedraza',    'tipo' => 'manual',     'codigo' => '0129001998'],
            ['prefijo' => '29', 'numero' => '2273', 'nombre' => 'Andrea',            'ap1' => 'Malgeri',    'ap2' => null,         'tipo' => 'manual',     'codigo' => '0129202273'],
            ['prefijo' => '29', 'numero' => '2274', 'nombre' => 'Camila',            'ap1' => 'Abad',       'ap2' => 'González',   'tipo' => 'manual',     'codigo' => '0129802274'],
            ['prefijo' => '29', 'numero' => '2275', 'nombre' => 'Elena',             'ap1' => 'Portero',    'ap2' => 'García',     'tipo' => 'manual',     'codigo' => '0129302275'],
            ['prefijo' => '29', 'numero' => '2276', 'nombre' => 'Carmen',            'ap1' => 'Peñas',      'ap2' => 'Rodríguez',  'tipo' => 'manual',     'codigo' => '0129902276'],
            ['prefijo' => '29', 'numero' => '2277', 'nombre' => 'Armando José',      'ap1' => 'Simancas',   'ap2' => 'Torrellas',  'tipo' => 'manual',     'codigo' => '0129402277'],
            ['prefijo' => '29', 'numero' => '2278', 'nombre' => 'Martín',            'ap1' => 'Vázquez',    'ap2' => 'Cabeza',     'tipo' => 'manual',     'codigo' => '0129102278'],
            ['prefijo' => '29', 'numero' => '2279', 'nombre' => 'Cristina Alejandra','ap1' => 'Rizkallal',  'ap2' => 'Santana',    'tipo' => 'manual',     'codigo' => '0129502279'],
            ['prefijo' => '29', 'numero' => '2280', 'nombre' => 'Ángel',             'ap1' => 'Romero',     'ap2' => 'Guillén',    'tipo' => 'manual',     'codigo' => '0129902280'],
            ['prefijo' => '29', 'numero' => '2281', 'nombre' => 'Rocío',             'ap1' => 'Cromstedt',  'ap2' => 'Lavigne',    'tipo' => 'manual',     'codigo' => '0129402281'],
            ['prefijo' => '29', 'numero' => '2282', 'nombre' => 'Alberto',           'ap1' => 'Fernández',  'ap2' => 'Jiménez',    'tipo' => 'manual',     'codigo' => '0129102282'],
            ['prefijo' => '29', 'numero' => '2283', 'nombre' => 'Maricel',           'ap1' => 'Angulo',     'ap2' => 'Lewylle',    'tipo' => 'manual',     'codigo' => '0129502283'],
            ['prefijo' => '29', 'numero' => '2284', 'nombre' => 'Sara',              'ap1' => 'López',      'ap2' => 'Fernández',  'tipo' => 'manual',     'codigo' => '0129002284'],
            ['prefijo' => '18', 'numero' => '1210', 'nombre' => 'Mª de los Ángeles', 'ap1' => 'Cabrera',    'ap2' => 'Fernández',  'tipo' => 'manual',     'codigo' => '0118201210'],
            ['prefijo' => '18', 'numero' => '1292', 'nombre' => 'Cinzia',            'ap1' => 'Puopolo',    'ap2' => null,         'tipo' => 'manual',     'codigo' => '0118501292'],
            ['prefijo' => '18', 'numero' => '1293', 'nombre' => 'Amanda',            'ap1' => 'Maya',       'ap2' => 'Olivós',     'tipo' => 'manual',     'codigo' => '0118001293'],
            // AUTOMÁTICOS
            ['prefijo' => '14', 'numero' => '1878', 'nombre' => 'Gloria María',      'ap1' => 'Ortiz',      'ap2' => 'Primo',      'tipo' => 'automatico', 'codigo' => '0114001878'],
            ['prefijo' => '14', 'numero' => '1523', 'nombre' => 'Francisca',         'ap1' => 'Cobacho',    'ap2' => 'Vargas',     'tipo' => 'automatico', 'codigo' => '0114601523'],
        ];

        $importados = 0;
        $omitidos   = 0;

        foreach ($sellos as $s) {
            try {
                // Buscar o crear en All_sellos
                $sello = AllSellosModel::firstOrCreate(
                    ['codigo_sello' => $s['codigo']],
                    [
                        'prefijo_postal'   => $s['prefijo'],
                        'numero_colegiado' => $s['numero'],
                        'nombre'           => $s['nombre'],
                        'apellido1'        => $s['ap1'],
                        'apellido2'        => $s['ap2'],
                        'tipo_sello'       => $s['tipo'],
                        'veces_generado'   => 0,
                    ]
                );

                // Asignar a la tarea si no está ya
                if (!$tarea->sellos()->where('sello_id', $sello->id)->exists()) {
                    $tarea->sellos()->attach($sello->id);
                    $importados++;
                    $this->info("✅ {$s['nombre']} {$s['ap1']} — {$s['codigo']}");
                } else {
                    $this->warn("⏭ Ya existe: {$s['nombre']} {$s['ap1']}");
                    $omitidos++;
                }

            } catch (\Exception $e) {
                $this->error("❌ Error: {$s['nombre']} — " . $e->getMessage());
                $omitidos++;
            }
        }

        $this->newLine();
        $this->info("✅ Importados: $importados");
        $this->warn("⏭ Omitidos:   $omitidos");

        return 0;
    }
}