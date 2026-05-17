<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EnvioProveedores\PedidoColegioModel;
use App\Models\EnvioProveedores\ProductoModel;
use App\Models\EnvioProveedores\ProveedorModel;
use App\Models\EnvioProveedores\ColegioVeterinarioModel;
use App\Services\EmailEnvioService; 
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class OrdenProveedorController extends Controller
{
    // 1. MÉTODO INDEX
    public function index()
    {
        $proveedores = ProveedorModel::with('productos')->get();
        $colegios = ColegioVeterinarioModel::all(); 

        $pedidos = PedidoColegioModel::with(['proveedor', 'colegio'])
            ->latest()
            ->get();

        return Inertia::render('EnvioProveedores/Index', [
            'proveedores' => $proveedores,
            'colegios'    => $colegios,
            'pedidos'     => $pedidos 
        ]);
    }

    // 2. MÉTODO STORE (PROCESAR Y ENVIAR)
// 2. MÉTODO STORE (MENSAJE PREDETERMINADO LIMPIO + PDF ADJUNTO)
    public function store(Request $request)
    {
        // 1. VALIDACIÓN DE ENTRADA
        $request->validate([
            'proveedor_id'           => 'required',
            'colegio_veterinario_id' => 'required',
            'lineas'                 => 'required|array|min:1',
            'lineas.*.producto_id'   => 'required',
            'lineas.*.unidades'      => 'required|integer|min:1',
            'email_manual'           => 'nullable|email', 
        ]);

        try {
            // 2. CREAR CABECERA DEL PEDIDO
            $pedido = PedidoColegioModel::create([
                'numero_pedido'          => 'OP-' . time(),
                'fecha'                  => now(),
                'proveedor_id'           => $request->proveedor_id,
                'colegio_veterinario_id' => $request->colegio_veterinario_id, 
                'estado'                 => 'pendiente'
            ]);

            // 3. CREAR LÍNEAS DE ARTÍCULOS
            foreach ($request->lineas as $linea) {
                $producto = ProductoModel::find($linea['producto_id']);
                
                if ($producto) {
                    $unidades = (int)$linea['unidades'];
                    $precio   = (float)$producto->precio;

                    $pedido->lineas()->create([
                        'producto_id'     => $producto->id,
                        'descripcion'     => $producto->nombre,
                        'unidades'        => $unidades,
                        'precio_unitario' => $precio,
                        'importe'         => $unidades * $precio
                    ]);
                }
            }

            if (method_exists($pedido, 'recalcularTotales')) {
                $pedido->recalcularTotales();
            }

            // Cargamos las relaciones necesarias para el PDF y el correo
            $pedido->load(['proveedor', 'colegio', 'lineas']);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'error'   => 'Error al guardar en Base de Datos', 
                'mensaje' => $e->getMessage()
            ], 500);
        }

        // 4. GENERACIÓN DE MENSAJE PREDETERMINADO Y ENVIAR
        $emailEnviado = false;
        $errorEmail   = null;

        try {
            // Destinatario automático o de pruebas
            $correoDestinatario = 'alonsopaez1206@gmail.com';

            if (empty($correoDestinatario)) {
                throw new \Exception("El proveedor '{$pedido->proveedor->nombre}' no tiene un correo configurado.");
            }

            // 1. Determinar el saludo según la hora (mañana, tarde o noche)
            $horaActual = (int)now()->format('H');
            if ($horaActual >= 6 && $horaActual < 13) {
                $saludo = "Buenos días";
            } elseif ($horaActual >= 13 && $horaActual < 21) {
                $saludo = "Buenas tardes";
            } else {
                $saludo = "Buenas noches";
            }

            // 2. Nombre del proveedor
            $nombreProveedor = $pedido->proveedor ? $pedido->proveedor->nombre : 'Proveedor';

            // 3. Redactar el Cuerpo del Mensaje Predeterminado (Limpio, sin el listado)
            $cuerpoEmail = "
                <p>{$saludo} <strong>{$nombreProveedor}</strong>,</p>
                <p>Solicito confirmación para el siguiente pedido.</p>
                <p>Adjunto a este correo electrónico encontrará el Albarán correspondiente con todos los detalles.</p>
                <br>
                <p>Muchas gracias,</p>
                <p>—<br><strong>Departamento de Logística</strong></p>
            ";

            // Generar el PDF del Albarán en memoria a partir de tu vista real
            $pdfAlbaranRaw = Pdf::loadView('envio-proveedores.albaran', compact('pedido'))->output();

            // Adjuntar el archivo PDF
            $adjuntos = [
                [
                    'raw_data' => $pdfAlbaranRaw, 
                    'nombre'   => "Albaran_{$pedido->numero_pedido}.pdf", 
                    'mime'     => 'application/pdf'
                ]
            ];

            $datosEmail = [
                'pedido'         => $pedido,
                'titulo_cabecera'=> "Solicitud de Confirmación de Pedido - {$pedido->numero_pedido}",
                'mensaje_cuerpo' => $cuerpoEmail
            ];

            // Enviar usando tu servicio
            $emailEnviado = EmailEnvioService::enviarConAdjuntos(
                $correoDestinatario,                                        
                "Solicitud de Confirmación de Pedido - {$pedido->numero_pedido}", 
                'envio-proveedores.albaran', 
                $datosEmail,           
                $adjuntos                                                   
            );

            if (!$emailEnviado) {
                $errorEmail = 'El servidor de correo rechazó el envío.';
            }

        } catch (\Exception $e) {
            $errorEmail = $e->getMessage();
        }

        // 5. RESPUESTA HACIA EL FRONTEND
        if (!$emailEnviado) {
            return response()->json([
                'success' => false,
                'error'   => 'Fallo al procesar el envío automático',
                'mensaje' => $errorEmail
            ], 500); 
        }

        return response()->json([
            'success'       => true,
            'pedido_id'     => $pedido->id,
            'email_enviado' => true,
            'mensaje'       => "Pedido generado con éxito. Mensaje predeterminado enviado a {$nombreProveedor} con el PDF adjunto."
        ]);
    }

    // 3. ACTUALIZAR ESTADO
    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,recibido_parcial,completado,cancelado'
        ]);

        $pedido = PedidoColegioModel::findOrFail($id);
        $pedido->update([
            'estado' => $request->estado
        ]);

        return redirect()->back()->with('success', 'Estado del pedido actualizado con éxito.');
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
    $pedido = PedidoColegioModel::with(['proveedor', 'colegio', 'lineas'])->findOrFail($id);

    $saludo          = $request->saludo ?? "Estimado/a {$pedido->proveedor->nombre},";
    $mensajeAdicional = $request->mensaje_adicional ?? "";
    $asunto          = $request->asunto ?? "Solicitud de Confirmación - {$pedido->numero_pedido}";

    $cuerpoEmail = "
        <p>{$saludo}</p>
        <p>Solicito confirmación para el siguiente pedido:</p>
        <p><strong>📋 {$pedido->numero_pedido}</strong></p>
        " . ($mensajeAdicional ? "<p>{$mensajeAdicional}</p>" : "") . "
        <p>Adjunto a este correo encontrará el albarán correspondiente con todos los detalles.</p>
        <br>
        <p>—<br><strong>Departamento de Logística</strong></p>
    ";

    try {
        $pdfRaw = Pdf::loadView('envio-proveedores.albaran', compact('pedido'))->output();

        $adjuntos = [[
            'raw_data' => $pdfRaw,
            'nombre'   => "Albaran_{$pedido->numero_pedido}.pdf",
            'mime'     => 'application/pdf'
        ]];

        $datosEmail = [
            'pedido'          => $pedido,
            'titulo_cabecera' => $asunto,
            'mensaje_cuerpo'  => $cuerpoEmail,
        ];

        $enviado = EmailEnvioService::enviarConAdjuntos(
            'alonsopaez1206@gmail.com', // fijo en pruebas
            $asunto,
            'envio-proveedores.albaran',
            $datosEmail,
            $adjuntos
        );

        if (!$enviado) {
            return response()->json(['success' => false, 'mensaje' => 'El servidor rechazó el envío.'], 500);
        }

        return response()->json(['success' => true]);

    } catch (\Exception $e) {
        return response()->json(['success' => false, 'mensaje' => $e->getMessage()], 500);
    }
}

    // 4. GENERAR PDF MANUAL
    public function generarPdf($id)
    {
        $pedido = PedidoColegioModel::with(['lineas', 'proveedor', 'colegio'])->findOrFail($id);
        $pdf = Pdf::loadView('envio-proveedores.albaran', compact('pedido'));
        return $pdf->stream('Albaran_' . $pedido->numero_pedido . '.pdf');
    }
}