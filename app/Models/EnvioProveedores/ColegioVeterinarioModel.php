<?php

namespace App\Models\EnvioProveedores;

use Illuminate\Database\Eloquent\Model;
use App\Models\EnvioProveedores\PedidoColegioModel; // 👈 ESTO FALTABA

class ColegioVeterinarioModel extends Model
{
    protected $table = 'colegios_veterinarios';

    protected $fillable = [
        'nombre',
        'direccion',
        'ciudad',
        'codigo_postal',
        'provincia',
        'cif',
        'telefono',
        'email'
    ];

    public function pedidos()
    {
        return $this->hasMany(\App\Models\EnvioProveedores\PedidoColegioModel::class, 'colegio_veterinario_id');
    }
}
