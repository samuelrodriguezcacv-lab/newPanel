<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Metacrilato extends Model
{
    protected $table = 'metacrilatos';

    protected $fillable = [
        'tipo_centro',
        'codigo_registro',
    ];

    const TIPOS_CENTRO = [
        'Consultorio Veterinario',
        'Clínica Veterinaria',
        'Hospital Veterinario',
        'Centro Veterinario',
    ];
}