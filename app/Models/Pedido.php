<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TareaLogistica;

class Pedido extends Model
{
    protected $fillable = ['numero_pedido'];

    public function tareas()
    {
         return $this->hasMany(TareaLogistica::class);
    }
}