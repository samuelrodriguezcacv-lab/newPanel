<?php

namespace App\Models\EnvioProveedores;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use App\Models\EnvioProveedores\ProveedorModel;

class PedidoColegioModel extends Model
{
    protected $table = 'pedidos_colegios';

    protected $fillable = [
        'numero_pedido',
        'fecha',
        'colegio_veterinario_id',
        'proveedor_id',
        'subtotal',
        'iva_total',
        'total',
        'estado'
    ];

    public function colegio()
    {
        return $this->belongsTo(ColegioVeterinarioModel::class, 'colegio_veterinario_id');
    }

    public function proveedor()
    {
        return $this->belongsTo(ProveedorModel::class, 'proveedor_id');
    }

    public function lineas()
    {
        return $this->hasMany(PedidoLineaModel::class, 'pedido_id');
    }

    public function recalcularTotales(): void
    {
        $subtotal = $this->lineas->sum('importe');

        $iva = $this->lineas->sum(fn($l) => $l->importe * 0.21);

        $this->subtotal = $subtotal;
        $this->iva_total = $iva;
        $this->total = $subtotal + $iva;

        $this->save();
    }
}