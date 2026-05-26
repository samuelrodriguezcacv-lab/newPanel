<?php

namespace App\Support;

class EmailTemplateBuilder
{
    /**
     * Construye un payload estandar para la vista de correo genérica.
     *
     * @param string $modulo Ej: pedidos, sellos, metacrilatos
     * @param string $tituloCabecera Titulo principal del correo
     * @param string $mensajeHtml Cuerpo principal en HTML
     * @param array $bloques Bloques secundarios [{ titulo, contenido }]
     * @param array $meta Metadatos [{ label, value }]
     * @return array
     */
    public static function build(
        string $modulo,
        string $tituloCabecera,
        string $mensajeHtml,
        array $bloques = [],
        array $meta = []
    ): array {
        return [
            'modulo' => $modulo,
            'titulo_cabecera' => $tituloCabecera,
            'mensaje_cuerpo' => $mensajeHtml,
            'bloques' => array_values(array_filter($bloques, function ($bloque) {
                return !empty($bloque['titulo']) || !empty($bloque['contenido']);
            })),
            'meta' => array_values(array_filter($meta, function ($item) {
                return !empty($item['label']) && isset($item['value']);
            })),
        ];
    }
}

