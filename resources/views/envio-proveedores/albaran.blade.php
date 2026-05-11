<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        @page { margin: 0; }
        
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            font-size: 10px; 
            color: #374151; 
            line-height: 1.5;
            background-color: #ffffff;
            margin: 0;
            padding: 40px;
        }

        .top-stripe {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 4px;
            background: linear-gradient(to right, #1e3a5f, #3b82f6);
        }

        .cabecera { 
            margin-bottom: 30px; 
            padding-bottom: 10px;
        }

        .header-table { width: 100%; border-collapse: collapse; }

        .empresa-emisora {
            vertical-align: top;
            width: 70%;
        }

        .empresa-nombre {
            font-size: 16px;
            font-weight: 800;
            color: #1e3a5f;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .empresa-datos {
            font-size: 10px;
            color: #4b5563;
            line-height: 1.3;
        }

        .pedido-meta {
            text-align: right;
            vertical-align: top;
        }

        .ref-numero {
            font-size: 14px;
            font-weight: 700;
            color: #111827;
            font-family: 'Courier', monospace;
        }

        /* Direcciones */
        .direcciones { 
            width: 100%; 
            margin-bottom: 30px; 
            table-layout: fixed;
        }

        .bloque-box {
            padding-right: 15px;
            vertical-align: top;
        }

        .bloque-inner {
            background-color: #f9fafb;
            border-radius: 10px;
            padding: 15px;
            height: 110px;
            border: 1px solid #f3f4f6;
        }

        .label-direccion {
            font-size: 8px;
            font-weight: 800;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: block;
        }

        .nombre-entidad {
            font-size: 12px;
            font-weight: bold;
            color: #1e3a5f;
            margin-bottom: 4px;
        }

        /* Tabla Productos */
        .tabla-productos {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .tabla-productos thead th {
            background-color: #f8fafc;
            color: #64748b;
            text-transform: uppercase;
            font-size: 8.5px;
            font-weight: 700;
            padding: 12px 15px;
            border-bottom: 2px solid #e2e8f0;
            text-align: left;
        }

        .tabla-productos tbody td {
            padding: 10px 15px;
            border-bottom: 1px solid #f1f5f9;
        }

        /* Totales Modificados */
        .totales-table {
            width: 280px;
            margin-left: auto;
            border-collapse: collapse;
        }

        .totales-table td {
            padding: 6px 15px;
            text-align: right;
        }

        .total-label { color: #64748b; font-weight: 500; font-size: 9.5px; }
        .total-valor { font-family: 'Courier', monospace; font-weight: 600; color: #1e293b; font-size: 10px; }
        
        .fila-gran-total {
            background-color: #1e3a5f;
        }

        .fila-gran-total td {
            padding: 12px 15px !important;
            color: white !important;
            border-radius: 0 0 8px 8px;
        }

        .gran-total-label { font-size: 12px; font-weight: 800; text-transform: uppercase; }
        .gran-total-valor { font-size: 16px; font-weight: 800; }

        .pie {
            position: fixed;
            bottom: 30px;
            left: 40px;
            right: 40px;
            border-top: 1px solid #f1f5f9;
            padding-top: 15px;
            text-align: center;
            font-size: 8.5px;
            color: #94a3b8;
        }

        .text-right { text-align: right !important; }
    </style>
</head>
<body>
    <div class="top-stripe"></div>

    <div class="cabecera">
        <table class="header-table">
            <tr>
                <td class="empresa-emisora">
                    <div class="empresa-nombre">CONSEJO ANDALUZ DE COLEGIOS VETERINARIOS</div>
                    <div class="empresa-datos">
                        CL GONZALO BILBAO, 23<br>
                        41003 SEVILLA, ESPAÑA<br>
                        <strong>CIF:</strong> ESQ9155032G | <strong>Teléfono:</strong> 954452701
                    </div>
                </td>
                <td class="pedido-meta">
                    <div class="ref-numero">REF: {{ $pedido->numero_pedido }}</div>
                    <div style="margin-top: 5px; color: #64748b;">
                        Fecha: <strong>{{ \Carbon\Carbon::parse($pedido->fecha)->format('d/m/Y') }}</strong>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <table class="direcciones">
        <tr>
            <td class="bloque-box">
                <div class="bloque-inner">
                    <span class="label-direccion">Proveedor (Almacén)</span>
                    <div class="nombre-entidad">{{ $pedido->proveedor->nombre }}</div>
                    <div class="datos-entidad">
                        {{ $pedido->proveedor->direccion }}<br>
                        {{ $pedido->proveedor->ciudad }}<br>
                        <strong>CIF:</strong> {{ $pedido->proveedor->cif }}
                    </div>
                </div>
            </td>
            <td class="bloque-box" style="padding-right: 0; padding-left: 10px;">
                <div class="bloque-inner" style="border-left: 4px solid #3b82f6;">
                    <span class="label-direccion">Destinatario</span>
                    <div class="nombre-entidad">{{ $pedido->colegio->nombre }}</div>
                    <div class="datos-entidad">
                        {{ $pedido->colegio->direccion }}<br>
                        {{ $pedido->colegio->ciudad }}<br>
                        <strong>CIF:</strong> {{ $pedido->colegio->cif }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <table class="tabla-productos">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 55%;">Descripción</th>
                <th style="width: 10%;" class="text-right">Cant.</th>
                <th style="width: 15%;" class="text-right">Precio Un.</th>
                <th style="width: 15%;" class="text-right">Importe</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pedido->lineas as $i => $linea)
            <tr>
                <td style="color: #94a3b8;">{{ str_pad($i + 1, 2, '0', STR_PAD_LEFT) }}</td>
                <td style="font-weight: 700;">{{ $linea->descripcion }}</td>
                <td class="text-right">{{ $linea->unidades }}</td>
                <td class="text-right">{{ number_format($linea->precio_unitario, 2) }}€</td>
                <td class="text-right" style="font-weight: 700;">{{ number_format($linea->importe, 2) }}€</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totales-container">
        <table class="totales-table">
            <tr>
                <td class="total-label">Base Imponible</td>
                <td class="total-valor">{{ number_format($pedido->subtotal, 2) }}€</td>
            </tr>
            <tr>
                <td class="total-label">% I.V.A.</td>
                <td class="total-valor">0,00</td>
            </tr>
            <tr>
                <td class="total-label">Total I.V.A.</td>
                <td class="total-valor">0,000</td>
            </tr>
            <tr class="fila-gran-total">
                <td class="gran-total-label">TOTAL</td>
                <td class="gran-total-valor">{{ number_format($pedido->subtotal, 2) }}€</td>
            </tr>
        </table>
    </div>

    <div class="pie">
        <table style="width: 100%">
            <tr>
                <td style="text-align: left;">Suministro gestionado vía <strong>RAIADash</strong></td>
                <td style="text-align: center;">Página 1 de 1</td>
                <td style="text-align: right;">{{ now()->format('d/m/Y H:i') }}</td>
            </tr>
        </table>
    </div>
</body>
</html>