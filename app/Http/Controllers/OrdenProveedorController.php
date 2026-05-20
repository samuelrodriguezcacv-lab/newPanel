<?php

namespace App\Http\Controllers;

use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use App\Models\EnvioProveedores\PedidoColegioModel;
use App\Models\EnvioProveedores\ProductoModel;
use App\Models\EnvioProveedores\ProveedorModel;
use App\Services\EmailEnvioService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrdenProveedorController extends Controller
{
    public function index()
    {
        $proveedores = ProveedorModel::with('productos')->get();
        $colegios = ColegioVeterinarioModel::all();

        $pedidos = PedidoColegioModel::with(['proveedor', 'colegio'])
            ->latest()
            ->get();

        return Inertia::render('EnvioProveedores/Index', [
            'proveedores' => $proveedores,
            'colegios' => $colegios,
            'pedidos' => $pedidos,
        ]);
    }

    public function prepararBorrador(Request $request)
    {
        $validated = $this->validatePedidoRequest($request);
        $proveedor = ProveedorModel::findOrFail($validated['proveedor_id']);

        return response()->json([
            'success' => true,
            'borrador' => [
                'destinatario' => $proveedor->email,
                'asunto' => 'Solicitud de Confirmacion de Pedido',
                'mensaje' => $this->crearTextoPlanoEmail($proveedor->nombre),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePedidoRequest($request, [
            'email_manual' => 'nullable|email',
            'email_asunto_custom' => 'nullable|string|max:255',
            'email_mensaje_custom' => 'nullable|string',
        ]);

        try {
            $pedido = DB::transaction(function () use ($validated) {
                $pedido = PedidoColegioModel::create([
                    'numero_pedido' => $this->generarNumeroOrdenProveedor(),
                    'fecha' => now(),
                    'proveedor_id' => $validated['proveedor_id'],
                    'colegio_veterinario_id' => $validated['colegio_veterinario_id'],
                    'estado' => 'pendiente',
                ]);

                foreach ($validated['lineas'] as $linea) {
                    $producto = ProductoModel::where('proveedor_id', $validated['proveedor_id'])
                        ->findOrFail($linea['producto_id']);

                    $unidades = (int) $linea['unidades'];
                    $precio = (float) $producto->precio;

                    $pedido->lineas()->create([
                        'producto_id' => $producto->id,
                        'descripcion' => $producto->nombre,
                        'unidades' => $unidades,
                        'precio_unitario' => $precio,
                        'importe' => $unidades * $precio,
                    ]);
                }

                $pedido->load(['proveedor', 'colegio', 'lineas']);
                $pedido->recalcularTotales();
                $pedido->refresh()->load(['proveedor', 'colegio', 'lineas']);

                $destinatario = $validated['email_manual'] ?? $pedido->proveedor?->email;

                if (empty($destinatario)) {
                    throw new \RuntimeException("El proveedor '{$pedido->proveedor->nombre}' no tiene correo configurado.");
                }

                $asunto = $validated['email_asunto_custom']
                    ?? "Solicitud de Confirmacion de Pedido - {$pedido->numero_pedido}";
                $cuerpo = isset($validated['email_mensaje_custom'])
                    ? nl2br(e($validated['email_mensaje_custom']))
                    : $this->crearCuerpoEmailPedido($pedido->proveedor->nombre);

                $pdfRaw = Pdf::loadView('envio-proveedores.albaran', compact('pedido'))->output();

                $enviado = EmailEnvioService::enviarConAdjuntos(
                    $destinatario,
                    $asunto,
                    'notificacion_general',
                    [
                        'pedido' => $pedido,
                        'titulo_cabecera' => $asunto,
                        'mensaje_cuerpo' => $cuerpo,
                    ],
                    [[
                        'raw_data' => $pdfRaw,
                        'nombre' => "Albaran_{$pedido->numero_pedido}.pdf",
                        'mime' => 'application/pdf',
                    ]]
                );

                if (!$enviado) {
                    throw new \RuntimeException('El servidor de correo rechazo el envio.');
                }

                return $pedido;
            });
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => 'Fallo al procesar el pedido',
                'mensaje' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'pedido_id' => $pedido->id,
            'email_enviado' => true,
            'mensaje' => "Pedido generado con exito. Mensaje enviado a {$pedido->proveedor->nombre} con el PDF adjunto.",
        ]);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,recibido_parcial,completado,cancelado',
        ]);

        $pedido = PedidoColegioModel::findOrFail($id);
        $pedido->update([
            'estado' => $request->estado,
        ]);

        return redirect()->back()->with('success', 'Estado del pedido actualizado con exito.');
    }

    public function vistaEnvio($id)
    {
        $pedido = PedidoColegioModel::with(['proveedor', 'colegio', 'lineas'])->findOrFail($id);

        return Inertia::render('EnvioProveedores/EnviarPedido', [
            'pedido' => $pedido,
        ]);
    }

    public function enviarDesdePanel(Request $request, $id)
    {
        $validated = $request->validate([
            'saludo' => 'nullable|string|max:255',
            'mensaje_adicional' => 'nullable|string',
            'asunto' => 'nullable|string|max:255',
            'destinatario' => 'nullable|email',
        ]);

        $pedido = PedidoColegioModel::with(['proveedor', 'colegio', 'lineas'])->findOrFail($id);

        $saludo = e($validated['saludo'] ?? "Estimado/a {$pedido->proveedor->nombre},");
        $mensajeAdicional = isset($validated['mensaje_adicional'])
            ? nl2br(e($validated['mensaje_adicional']))
            : '';
        $asunto = $validated['asunto'] ?? "Solicitud de Confirmacion - {$pedido->numero_pedido}";
        $destinatario = $validated['destinatario'] ?? $pedido->proveedor?->email;

        if (empty($destinatario)) {
            return response()->json(['success' => false, 'mensaje' => 'El proveedor no tiene correo configurado.'], 422);
        }

        $cuerpoEmail = "
            <p>{$saludo}</p>
            <p>Solicito confirmacion para el siguiente pedido:</p>
            <p><strong>{$pedido->numero_pedido}</strong></p>
            " . ($mensajeAdicional ? "<p>{$mensajeAdicional}</p>" : '') . "
            <p>Adjunto a este correo encontrara el albaran correspondiente con todos los detalles.</p>
            <br>
            <p><strong>Departamento de Logistica</strong></p>
        ";

        try {
            $pdfRaw = Pdf::loadView('envio-proveedores.albaran', compact('pedido'))->output();

            $enviado = EmailEnvioService::enviarConAdjuntos(
                $destinatario,
                $asunto,
                'notificacion_general',
                [
                    'pedido' => $pedido,
                    'titulo_cabecera' => $asunto,
                    'mensaje_cuerpo' => $cuerpoEmail,
                ],
                [[
                    'raw_data' => $pdfRaw,
                    'nombre' => "Albaran_{$pedido->numero_pedido}.pdf",
                    'mime' => 'application/pdf',
                ]]
            );

            if (!$enviado) {
                return response()->json(['success' => false, 'mensaje' => 'El servidor rechazo el envio.'], 500);
            }

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'mensaje' => $e->getMessage()], 500);
        }
    }

    public function generarPdf($id)
    {
        $pedido = PedidoColegioModel::with(['lineas', 'proveedor', 'colegio'])->findOrFail($id);
        $pdf = Pdf::loadView('envio-proveedores.albaran', compact('pedido'));

        return $pdf->stream('Albaran_' . $pedido->numero_pedido . '.pdf');
    }

    private function validatePedidoRequest(Request $request, array $extraRules = []): array
    {
        return $request->validate([
            'proveedor_id' => 'required|exists:proveedores,id',
            'colegio_veterinario_id' => 'required|exists:colegios_veterinarios,id',
            'lineas' => 'required|array|min:1',
            'lineas.*.producto_id' => [
                'required',
                Rule::exists('productos', 'id')->where(fn ($query) => $query->where('proveedor_id', $request->proveedor_id)),
            ],
            'lineas.*.unidades' => 'required|integer|min:1',
            ...$extraRules,
        ]);
    }

    private function crearTextoPlanoEmail(string $nombreProveedor): string
    {
        return trim(strip_tags(str_replace(
            ['<br>', '<br/>', '<br />', '</p>', '</div>'],
            ["\n", "\n", "\n", "\n", "\n"],
            $this->crearCuerpoEmailPedido($nombreProveedor)
        )));
    }

    private function crearCuerpoEmailPedido(string $nombreProveedor): string
    {
        $horaActual = (int) now()->format('H');
        $saludo = match (true) {
            $horaActual >= 6 && $horaActual < 13 => 'Buenos dias',
            $horaActual >= 13 && $horaActual < 21 => 'Buenas tardes',
            default => 'Buenas noches',
        };

        $nombreProveedor = e($nombreProveedor);

        return "
            <p>{$saludo} <strong>{$nombreProveedor}</strong>,</p>
            <p>Solicito confirmacion para el siguiente pedido.</p>
            <p>Adjunto a este correo electronico encontrara el albaran correspondiente con todos los detalles.</p>
            <br>
            <p>Muchas gracias,</p>
            <p><strong>Departamento de Logistica</strong></p>
        ";
    }

    private function generarNumeroOrdenProveedor(): string
    {
        do {
            $numero = 'OP-' . now()->format('YmdHis') . '-' . random_int(100, 999);
        } while (PedidoColegioModel::where('numero_pedido', $numero)->exists());

        return $numero;
    }
}
