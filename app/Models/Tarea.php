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
        return $this->belongsToMany(Sello::class, 'tarea_sello')
                    ->withPivot('tipo_uso', 'fecha_uso');
    }
}