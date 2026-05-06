<?php

namespace App\Services;

class SelloDataSanitizer
{
    public static function sanitize(array $datos): array
    {
        return [
            'prefijo_postal' => trim($datos['prefijo_postal']),
            'codigo_postal'  => trim($datos['codigo_postal']),

            'nombre'    => self::cleanText($datos['nombre'] ?? null),
            'apellido1' => self::cleanText($datos['apellido1'] ?? null),
            'apellido2' => self::cleanText($datos['apellido2'] ?? null),

            'tipo_sello' => $datos['tipo_sello'] ?? 'manual',
        ];
    }

    private static function cleanText(?string $text): ?string
    {
        if (!$text) return null;

        $text = trim($text);
        $text = preg_replace('/\s+/', ' ', $text); // dobles espacios
        $text = mb_strtolower($text, 'UTF-8'); // minúsculas seguras

        return $text;
    }
}