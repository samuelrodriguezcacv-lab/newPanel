<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = ['numero_pedido'];

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }
}