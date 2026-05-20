<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Metacrilato extends Model
{
    protected $table = 'metacrilatos';

    protected $fillable = [
        'tipo_centro',
        'codigo_registro',
        'tarea_logistica_id',
        'pedido_id',
        'pedido_metacrilato_id',
    ];

    const TIPOS_CENTRO = [
        'Consultorio Veterinario',
        'Clínica Veterinaria',
        'Hospital Veterinario',
        'Centro Veterinario',
    ];

    public function tareaLogistica()
    {
        return $this->belongsTo(TareaLogistica::class, 'tarea_logistica_id');
    }

    public function pedidoMetacrilato()
    {
        return $this->belongsTo(PedidoMetacrilato::class, 'pedido_metacrilato_id');
    }
}
