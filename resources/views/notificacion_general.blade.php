<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; color: #334155; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .header { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #0f172a; }
        .footer { margin-top: 25px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">{{ $titulo_cabecera ?? 'Notificación del Sistema' }}</div>
        
        <!-- Renderiza el mensaje HTML que le envíes desde el controlador -->
        <div class="contenido">
            {!! $mensaje_cuerpo !!}
        </div>

        <div class="footer">
            Este es un correo automático, por favor no responda directamente a este mensaje.
        </div>
    </div>
</body>
</html>