<?php

namespace App\Models\Sellos;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sellos\AllSellosModel;

class TareaModel extends Model
{
    protected $table = 'tareas';

        protected $fillable = [
            'Tarea',
            'fecha',
            'estado',
            'provincia',
            'pedido_id',
        ];

    const PROVINCIAS_ANDALUCIA = [
        '04' => 'Almería',
        '11' => 'Cádiz',
        '14' => 'Córdoba',
        '18' => 'Granada',
        '21' => 'Huelva',
        '23' => 'Jaén',
        '29' => 'Málaga',
        '41' => 'Sevilla',
    ];

    // Relación con sellos
    public function sellos()
    {
        return $this->belongsToMany(
            AllSellosModel::class,
            'tarea_sello',
            'tarea_id',
            'sello_id'
        );
    }

    public function pedido()
{
    return $this->belongsTo(PedidoModel::class, 'pedido_id');
}
}
