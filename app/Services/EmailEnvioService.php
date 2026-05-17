<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailEnvioService
{
    /**
     * Envía un correo genérico con múltiples archivos adjuntos en memoria o físicos.
     *
     * @param string $para Email del destinatario
     * @param string $asunto Asunto del correo
     * @param string $vista Ruta de la vista Blade para el cuerpo
     * @param array $datosDatos que necesita la vista Blade
     * @param array $adjuntos Array de archivos adjuntos estructurados
     * @return bool
     */
    public static function enviarConAdjuntos(string $para, string $asunto, string $vista, array $datos = [], array $adjuntos = [])
    {
        if (empty($para)) {
            Log::warning("Intento de envío de correo sin destinatario para el asunto: {$asunto}");
            return false;
        }

        try {
            Mail::send($vista, $datos, function ($message) use ($para, $asunto, $adjuntos) {
                $message->to($para)
                        ->subject($asunto);

                // Recorremos los adjuntos dinámicamente
                foreach ($adjuntos as $adjunto) {
                    // Si viene como contenido binario (PDF generado en memoria con output())
                    if (isset($adjunto['raw_data'])) {
                        $message->attachData(
                            $adjunto['raw_data'], 
                            $adjunto['nombre'], 
                            ['mime' => $adjunto['mime'] ?? 'application/pdf']
                        );
                    } 
                    // Si viene como una ruta física de archivo guardado en el servidor
                    elseif (isset($adjunto['ruta_fisica'])) {
                        $message->attach($adjunto['ruta_fisica'], [
                            'as' => $adjunto['nombre'],
                            'mime' => $adjunto['mime'] ?? 'application/pdf'
                        ]);
                    }
                }
            });

            return true;
        } catch (\Exception $e) {
            Log::error("Error enviando email general: " . $e->getMessage());
            return false;
        }
    }
}