<?php

namespace App\Models\Sellos;

use Illuminate\Database\Eloquent\Model;
use App\Models\TareaLogistica;

class TareaSellosModel extends Model
{
    protected $table = 'tarea_sello';

        protected $fillable = [
            'pedido_id',
            'tareas_logistica_id',
            'tarea_id',
            'sello_id',
            'numero_tarea',
            'provincia',
            'fecha',
            'estado',
            'tipo_uso',
            'fecha_uso',
        ];

    const PROVINCIAS = [
        '04' => 'Almería', '11' => 'Cádiz',
        '14' => 'Córdoba', '18' => 'Granada',
        '21' => 'Huelva',  '23' => 'Jaén',
        '29' => 'Málaga',  '41' => 'Sevilla',
    ];

        public function sello()
        {
            return $this->belongsTo(AllSellosModel::class, 'sello_id');
        }

    public function pedido()
    {
        return $this->belongsTo(PedidoModel::class, 'pedido_id');
    }

    public function tareaLogistica()
    {
        return $this->belongsTo(TareaLogistica::class, 'tareas_logistica_id');
    }

}