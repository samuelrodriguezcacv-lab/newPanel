<?php

namespace App\Models\Sellos;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sellos\PedidoModel;


class AllSellosModel extends Model
{

     protected $table = 'All_sellos';

    protected $fillable = [
        'codigo_sello',
        'prefijo_postal',
        'numero_colegiado',
        'nombre',
        'apellido1',
        'apellido2',
        'tipo_sello',
        'veces_generado',
    ];

public static function generarCodigoSello(string $prefijo, string $numero): string
{
    $prov = str_pad((int)$prefijo, 2, '0', STR_PAD_LEFT);
    $numPadded = str_pad((int)$numero, 4, '0', STR_PAD_LEFT);

    $a = 0;
    $b = 1;
    $c = (int) $prov[0];
    $d = (int) $prov[1];
    $f = 0;
    $g = (int) $numPadded[0];
    $h = (int) $numPadded[1];
    $i = (int) $numPadded[2];
    $j = (int) $numPadded[3];

    $k = $a*1 + $b*2 + $c*4 + $d*8 + $f*9 + $g*7 + $h*5 + $i*3 + $j*6;
    $l = $k % 11;
    $control = ($l === 10) ? 1 : $l;

    return '0' . '1' . $prov[0] . $prov[1] . $control . '0' . $numPadded;
}

public function tareas()
{
    return $this->belongsToMany(
        TareaModel::class,
        'tarea_sello',
        'sello_id',
        'tarea_id'
    );
}
}