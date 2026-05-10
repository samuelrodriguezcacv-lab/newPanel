<?php

namespace App\Models\EnvioProveedores;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\EnvioProveedores\PedidoLineaModel;
use App\Models\EnvioProveedores\ProveedorModel; // 🔥 FALTABA ESTO

class ProductoModel extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'iva',
        'activo',
        'proveedor_id' // 🔥 TAMBIÉN FALTABA ESTO
    ];

    public function lineas(): HasMany
    {
        return $this->hasMany(PedidoLineaModel::class, 'producto_id');
    }

    public function proveedor()
    {
        return $this->belongsTo(ProveedorModel::class, 'proveedor_id');
    }
}