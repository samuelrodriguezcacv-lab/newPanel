<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sello extends Model
{
    protected $fillable = [
        'prefijo_postal',
        'codigo_postal',
        'nombre',
        'apellido1',
        'apellido2',
        'tipo_sello',
        'orden',
        'sello_generado',
    ];

    // 🔹 AQUÍ VA
 protected static function booted()
{
    static::creating(function ($sello) {

        // Normalización
        $sello->nombre_normalizado     = self::normalizarTexto($sello->nombre);
        $sello->apellido1_normalizado  = self::normalizarTexto($sello->apellido1);
        $sello->apellido2_normalizado  = self::normalizarTexto($sello->apellido2);

        // Código automático
        if (!$sello->sello_generado) {
            $sello->sello_generado = self::generarCodigoAutomatico(
                $sello->prefijo_postal,
                $sello->codigo_postal
            );
        }
    });
}

    // 🔹 Tu algoritmo
    public static function generarCodigoAutomatico(string $prefijo, string $numero): string
    {
        $prov = str_pad($prefijo, 2, '0', STR_PAD_LEFT);
        $num  = str_pad($numero, 4, '0', STR_PAD_LEFT);

        $a = 0;
        $b = 1;
        $c = (int) $prov[0];
        $d = (int) $prov[1];
        $f = 0;
        $g = (int) $num[0];
        $h = (int) $num[1];
        $i = (int) $num[2];
        $j = (int) $num[3];

        $k = $a*1 + $b*2 + $c*4 + $d*8 + $f*9 + $g*7 + $h*5 + $i*3 + $j*6;
        $l = $k % 11;
        $control = ($l === 10) ? 1 : $l;

        return '0' . '1' . $prov[0] . $prov[1] . $control . '0' . $num;
    }

    public static function normalizarTexto(?string $texto): ?string
{
    if (!$texto) return null;

    $texto = iconv('UTF-8', 'ASCII//TRANSLIT', $texto);
    $texto = strtolower($texto);
    $texto = trim($texto);

    return $texto;
}
}