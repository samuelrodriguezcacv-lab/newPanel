<?php

namespace App\Models\Sellos;

use Illuminate\Database\Eloquent\Model;

class PedidoModel extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'numero_pedido',
        'fecha',
        'estado',
    ];

    // Generar número automático desde 203
    public static function generarNumeroPedido(): int
    {
        $ultimo = self::max('numero_pedido');
        return $ultimo ? $ultimo + 1 : 203;
    }

    // Relación con tareas
    public function tareas()
    {
        return $this->hasMany(TareaSellosModel::class, 'pedido_id');
    }

}
