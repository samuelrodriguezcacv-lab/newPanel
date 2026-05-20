<?php

namespace App\Models;

class Tarea extends TareaLogistica
{
    public function getTareaAttribute(): ?string
    {
        return $this->numero_tarea;
    }

    public function setTareaAttribute($value): void
    {
        $this->attributes['numero_tarea'] = (string) $value;
        $this->attributes['tipo'] = $this->attributes['tipo'] ?? 'sellos';
    }
}
