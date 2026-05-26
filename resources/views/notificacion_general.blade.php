<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; color: #334155; line-height: 1.6; }
        .container { max-width: 660px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; }
        .chip { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; padding: 4px 8px; border-radius: 9999px; margin-bottom: 10px; }
        .header { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
        .meta { margin: 14px 0; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
        .meta-row { font-size: 13px; margin: 2px 0; color: #334155; }
        .meta-row strong { color: #0f172a; }
        .bloque { margin-top: 14px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; }
        .bloque h4 { margin: 0 0 6px 0; font-size: 14px; color: #0f172a; }
        .footer { margin-top: 25px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        @if(!empty($modulo))
            <span class="chip">{{ $modulo }}</span>
        @endif

        <div class="header">{{ $titulo_cabecera ?? 'Notificacion del Sistema' }}</div>

        <div class="contenido">
            {!! $mensaje_cuerpo !!}
        </div>

        @if(!empty($meta) && is_array($meta))
            <div class="meta">
                @foreach($meta as $item)
                    <div class="meta-row">
                        <strong>{{ $item['label'] ?? '' }}:</strong> {{ $item['value'] ?? '' }}
                    </div>
                @endforeach
            </div>
        @endif

        @if(!empty($bloques) && is_array($bloques))
            @foreach($bloques as $bloque)
                <div class="bloque">
                    @if(!empty($bloque['titulo']))
                        <h4>{{ $bloque['titulo'] }}</h4>
                    @endif
                    <div>{!! $bloque['contenido'] ?? '' !!}</div>
                </div>
            @endforeach
        @endif

        <div class="footer">
            Este es un correo automatico, por favor no responda directamente a este mensaje.
        </div>
    </div>
</body>
</html>
