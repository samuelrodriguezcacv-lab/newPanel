<?php

namespace App\Support\EmailModules;

use App\Support\EmailTemplateBuilder;

class PedidosEmailModule implements EmailModuleInterface
{
    public function key(): string
    {
        return 'pedidos';
    }

    public function buildPayload(array $context): array
    {
        $pedido = $context['pedido'];
        $asunto = $context['asunto'];
        $mensajeHtml = $context['mensaje_html'];

        $cfg = config('email_modules.pedidos', []);

        return EmailTemplateBuilder::build(
            $this->key(),
            $asunto,
            $mensajeHtml,
            [
                [
                    'titulo' => $cfg['bloque_resumen_titulo'] ?? 'Resumen del pedido',
                    'contenido' => '<p>' . e($cfg['bloque_resumen_contenido'] ?? 'Se adjunta el albaran en PDF con el detalle completo del pedido.') . '</p>',
                ],
            ],
            [
                ['label' => 'Numero de pedido', 'value' => $pedido->numero_pedido],
                ['label' => 'Proveedor', 'value' => $pedido->proveedor->nombre ?? '-'],
                ['label' => 'Colegio', 'value' => $pedido->colegio->nombre ?? '-'],
                ['label' => 'Total', 'value' => number_format((float) $pedido->total, 2, ',', '.') . ' EUR'],
            ]
        );
    }
}
