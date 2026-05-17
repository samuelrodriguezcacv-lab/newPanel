<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/Tarea.php
class Tarea extends Model
{
    protected $fillable = ['pedido_id', 'numero_tarea', 'origen'];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

public function sellos()
{
    return $this->belongsToMany(
        Sello::class,
        'sello_tarea',   // o pivot real si existe
        'tarea_id',
        'sello_id'
    );
}

public function tareaLogistica()
{
    return $this->belongsTo(\App\Models\TareaLogistica::class, 'tarea_logistica_id');
}
        

}