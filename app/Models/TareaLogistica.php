<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sello;
use App\Models\Tarea as TareaModel;

class TareaLogistica extends Model
{
    protected $table = 'tareas_logistica';

    protected $fillable = [
        'numero_tarea',
        'tipo',
        'descripcion',
        'estado',
        'tarea_sellos',
        'provincia',
        'pedido_id', // 🔴 ESTO ES CLAVE
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

    public function tareas()
{
    return $this->hasMany(TareaModel::class, 'tarea_logistica_id');
}

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    
}