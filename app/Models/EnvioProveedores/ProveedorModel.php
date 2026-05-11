<?php

namespace App\Models\EnvioProveedores;

use Illuminate\Database\Eloquent\Model;
use App\Models\EnvioProveedores\PedidoColegioModel;

class ProveedorModel extends Model
{
    protected $table = 'proveedores';

    protected $fillable = [
        'nombre',
        'direccion',
        'ciudad',
        'codigo_postal',
        'pais',
        'cif',
        'telefono',
        'email'
    ];

    // Relación: un proveedor puede tener muchos pedidos
    public function pedidos()
    {
        return $this->hasMany(\App\Models\EnvioProveedores\PedidoColegioModel::class, 'proveedor_id');
    }

            public function productos()
        {
            return $this->hasMany(ProductoModel::class, 'proveedor_id');
        }
}