<?php

namespace App\Models;

use App\Models\Sellos\AllSellosModel;
use App\Models\Sellos\TareaSellosModel;
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
        'provincia',
        'pedido_id',
    ];

    const TIPOS = [
        'sellos' => 'Sellos',
        'metacrilato' => 'Metacrilato',
        'anulacion' => 'Anulacion',
        'devolucion' => 'Devolucion',
        'carnets' => 'Carnets',
        'otro' => 'Otro',
    ];

    const ESTADOS = [
        'pendiente' => 'Pendiente',
        'en_proceso' => 'En proceso',
        'completada' => 'Completada',
    ];

    public function sellos()
    {
        return $this->belongsToMany(
            AllSellosModel::class,
            'tarea_sello',
            'tareas_logistica_id',
            'sello_id'
        )->withPivot(['id', 'pedido_id', 'tipo_uso', 'fecha_uso'])
            ->withTimestamps();
    }

    public function selloAsignaciones()
    {
        return $this->hasMany(TareaSellosModel::class, 'tareas_logistica_id');
    }

    public function metacrilatos()
    {
        return $this->hasMany(Metacrilato::class, 'tarea_logistica_id');
    }

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
}
