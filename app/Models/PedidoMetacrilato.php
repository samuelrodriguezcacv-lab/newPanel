<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoMetacrilato extends Model
{
    protected $table = 'pedidos_metacrilatos';

    protected $fillable = [
        'numero_pedido',
        'fecha',
        'estado',
    ];

    public static function generarNumeroPedido(): int
    {
        $ultimo = self::max('numero_pedido');

        return $ultimo ? $ultimo + 1 : 1;
    }

    public function metacrilatos()
    {
        return $this->hasMany(Metacrilato::class, 'pedido_metacrilato_id');
    }
}
