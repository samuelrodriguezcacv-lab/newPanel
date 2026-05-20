<?php

namespace App\Services;

use App\Models\Sello;
use App\Models\TareaLogistica;

class SellosService
{
  public function resolverSello(array $datos, bool $forzarNuevo = false): Sello
{
    $datos['sello_generado'] = Sello::generarCodigoAutomatico(
        $datos['prefijo_postal'],
        $datos['codigo_postal']
    );

    $query = Sello::where('sello_generado', $datos['sello_generado']);

   $esAutomatico = $datos['tipo_sello'] === 'automatico';

if ($esAutomatico) {
    $forzarNuevo = false;
}
    if (!$forzarNuevo && $query->exists()) {
        return $query->orderByDesc('orden')->first();
    }

    $ultimoOrden = $query->max('orden') ?? 0;

    return Sello::create([
        ...$datos,
        'orden' => $ultimoOrden + 1,
    ]);
}
    public function adjuntarATask(TareaLogistica $tarea, array $datos, bool $forzarNuevo = false): Sello
    {
        $sello = $this->resolverSello($datos, $forzarNuevo);

        if (!$tarea->sellos()->where('sello_id', $sello->id)->exists()) {
            $tarea->sellos()->attach($sello->id, [
                'tipo_uso'  => $datos['tipo_sello'],
                'fecha_uso' => now(),
            ]);
        }

        return $sello;
    }
}
