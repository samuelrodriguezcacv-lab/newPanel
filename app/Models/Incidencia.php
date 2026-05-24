<?php

namespace App\Models;

use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use Illuminate\Database\Eloquent\Model;

class Incidencia extends Model
{
    protected $fillable = [
        'numero_incidencia',
        'fecha',
        'descripcion',
        'alcance',
        'colegio_veterinario_id',
        'estado',
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
    ];

    public function colegio()
    {
        return $this->belongsTo(ColegioVeterinarioModel::class, 'colegio_veterinario_id');
    }
}
