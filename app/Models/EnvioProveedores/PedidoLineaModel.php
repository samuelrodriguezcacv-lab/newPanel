<?php

namespace App\Models\EnvioProveedores;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoLineaModel extends Model
{
    protected $table = 'pedido_lineas';

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'descripcion',
        'unidades',
        'precio_unitario',
        'importe'
    ];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(\App\Models\EnvioProveedores\PedidoColegioModel::class, 'pedido_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(\App\Models\EnvioProveedores\ProductoModel::class);
    }

    // 🧠 cálculo automático del importe
    protected static function booted()
    {
        static::saving(function ($linea) {
            $linea->importe = $linea->unidades * $linea->precio_unitario;
        });
    }
}