<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TareaLogistica extends Model
{
    protected $table = 'tareas_logistica';

    protected $fillable = [
        'numero_tarea',
        'tipo',
        'descripcion',
        'estado',
        'tarea_sellos',
    ];

    // Tipos disponibles
    const TIPOS = [
        'sellos'      => 'Sellos',
        'metacrilato' => 'Metacrilato',
        'anulacion'   => 'Anulación',
        'devolucion'  => 'Devolución',
        'carnets'     => 'Carnets',
        'otro'        => 'Otro',
    ];

    // Estados disponibles
    const ESTADOS = [
        'pendiente'   => 'Pendiente',
        'en_proceso'  => 'En proceso',
        'completada'  => 'Completada',
    ];

    // Si es de tipo sellos, podemos acceder a sus sellos
    public function sellos()
    {
        return $this->hasMany(Sello::class, 'tarea', 'tarea_sellos');
    }
}