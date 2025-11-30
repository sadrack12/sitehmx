<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de Marcação de Consulta</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 9px;
            color: #1a1a1a;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }
        
        .recibo-container {
            width: 105mm;
            height: 148mm;
            background: #ffffff;
            position: absolute;
            top: 0;
            left: 0;
            padding: 3mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }
        
        /* Header Moderno */
        .header-modern {
            background: linear-gradient(135deg, #2c5530 0%, #3d6b42 100%);
            color: #000000;
            padding: 2.5mm;
            border-radius: 4px 4px 0 0;
            margin-bottom: 2mm;
            text-align: center;
            flex-shrink: 0;
        }
        
        .logo-container {
            margin-bottom: 1mm;
        }
        
        .logo-container img {
            max-height: 12mm;
            max-width: 55mm;
            filter: brightness(0);
            display: block;
            margin: 0 auto;
        }
        
        .governo-info {
            font-size: 8px;
            font-weight: bold;
            margin-bottom: 0.4mm;
            opacity: 1;
            line-height: 1.3;
            color: #000000;
            display: block;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }
        
        .instituicao-nome {
            font-size: 13px;
            font-weight: bold;
            margin: 1mm 0 0.5mm 0;
            letter-spacing: 0.5px;
            color: #000000;
            display: block;
        }
        
        /* Número do Recibo - Destaque */
        .recibo-number-modern {
            background: #f8f9fa;
            border-left: 4px solid #2c5530;
            padding: 0.8mm 2mm;
            margin-bottom: 1mm;
            border-radius: 3px;
            flex-shrink: 0;
        }
        
        .recibo-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.2mm;
        }
        
        .recibo-title-modern {
            font-size: 8px;
            font-weight: bold;
            color: #2c5530;
            text-transform: uppercase;
            letter-spacing: 0.1px;
        }
        
        .numero-destaque {
            text-align: right;
        }
        
        .numero-destaque .numero {
            font-size: 11px;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 0.05mm;
            line-height: 1.1;
        }
        
        .numero-destaque .data {
            font-size: 5px;
            color: #666;
            line-height: 1.0;
        }
        
        .status-inline {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 0.3mm;
            margin-top: 0.2mm;
        }
        
        /* Cards de Informação */
        .info-cards {
            display: table;
            width: 100%;
            margin-bottom: 2mm;
            border-spacing: 0;
            border-collapse: collapse;
            flex: 1;
            min-height: 0;
        }
        
        .info-card {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            background: #f8f9fa;
            padding: 2mm;
            border: 1px solid #e9ecef;
        }
        
        .info-card:first-child {
            border-radius: 4px 0 0 4px;
            border-right: none;
        }
        
        .info-card:last-child {
            border-radius: 0 4px 4px 0;
            border-left: 1px solid #e9ecef;
        }
        
        .card-title {
            font-size: 9px;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 1mm;
            padding-bottom: 0.5mm;
            border-bottom: 2px solid #2c5530;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .info-item {
            margin-bottom: 0.8mm;
            padding-bottom: 0.5mm;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
        }
        
        .info-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .info-item-inline {
            display: flex;
            gap: 1.5mm;
            margin-bottom: 0.8mm;
            padding-bottom: 0.5mm;
            border-bottom: 1px solid #e9ecef;
            width: 100%;
        }
        
        .info-item-inline .info-field {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 0;
        }
        
        .info-item-inline .info-field .info-label-modern {
            min-width: 12mm;
            flex-shrink: 0;
        }
        
        .info-item-inline .info-field .info-value-modern {
            text-align: right;
            flex: 1;
            min-width: 0;
        }
        
        .info-label-modern {
            font-weight: 600;
            color: #495057;
            font-size: 8px;
            min-width: 18mm;
        }
        
        .info-value-modern {
            color: #1a1a1a;
            font-size: 8px;
            text-align: right;
            flex: 1;
            word-wrap: break-word;
        }
        
        .badge-modern {
            display: inline-block;
            padding: 0.5mm 2mm;
            border-radius: 15px;
            font-size: 6px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .badge-agendada {
            background: linear-gradient(135deg, #fff3cd 0%, #ffc107 100%);
            color: #856404;
            border: 2px solid #ffc107;
        }
        
        .badge-confirmada {
            background: linear-gradient(135deg, #d1ecf1 0%, #17a2b8 100%);
            color: #0c5460;
            border: 2px solid #17a2b8;
        }
        
        .badge-realizada {
            background: linear-gradient(135deg, #d4edda 0%, #28a745 100%);
            color: #155724;
            border: 2px solid #28a745;
        }
        
        .badge-cancelada {
            background: linear-gradient(135deg, #f8d7da 0%, #dc3545 100%);
            color: #721c24;
            border: 2px solid #dc3545;
        }
        
        .badge-online {
            background: linear-gradient(135deg, #e7f3ff 0%, #0056b3 100%);
            color: #004085;
            border: 2px solid #0056b3;
        }
        
        /* Footer Moderno */
        .footer-modern {
            background: #f8f9fa;
            border-top: 2px solid #2c5530;
            padding: 0.8mm 2mm;
            margin-top: 1.5mm;
            border-radius: 0 0 4px 4px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .footer-modern .importante {
            font-weight: bold;
            color: #2c5530;
            font-size: 7px;
            margin-bottom: 0.3mm;
        }
        
        .footer-modern .texto {
            font-size: 6px;
            color: #495057;
            line-height: 1.2;
        }
        
        .footer-modern .sistema {
            font-size: 5px;
            color: #6c757d;
            margin-top: 0.3mm;
            font-style: italic;
        }
        
        @page {
            margin: 0;
            size: A4;
        }
        
        /* Garantir que não ultrapasse os limites */
        .recibo-container * {
            max-width: 100%;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="recibo-container">
        <!-- Cabeçalho Moderno -->
        <div class="header-modern">
            @if($configuracao && $configuracao->mostrar_logo && $logo_base64)
                <div class="logo-container">
                    <img src="{{ $logo_base64 }}" alt="Logo">
                </div>
            @endif
            
            @if($configuracao)
                @if($configuracao->a_republica)
                    <div class="governo-info" style="display: block; color: #000000; font-weight: bold; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2px;">{{ $configuracao->a_republica }}</div>
                @endif
                @if($configuracao->o_ministerio)
                    <div class="governo-info" style="display: block; color: #000000; font-weight: bold; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2px;">{{ $configuracao->o_ministerio }}</div>
                @endif
                @if($configuracao->o_governo)
                    <div class="governo-info" style="display: block; color: #000000; font-weight: bold; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2px;">{{ $configuracao->o_governo }}</div>
                @endif
                
                <div class="instituicao-nome" style="display: block; color: #000000;">{{ $configuracao->nome_instituicao }}</div>
            @else
                <div class="governo-info" style="display: block; color: #000000; font-weight: bold; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2px;">REPÚBLICA DE ANGOLA</div>
                <div class="governo-info" style="display: block; color: #000000; font-weight: bold; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2px;">MINISTÉRIO DA SAÚDE</div>
                <div class="governo-info" style="display: block; color: #000000; font-weight: bold; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2px;">GOVERNO PROVINCIAL DO MOXICO</div>
                <div class="instituicao-nome" style="display: block; color: #000000;">Hospital Geral do Moxico</div>
            @endif
        </div>
        
        <!-- Número do Recibo -->
        <div class="recibo-number-modern">
            <div class="recibo-header-row">
                <div class="recibo-title-modern">Recibo de Marcação</div>
                <div class="numero-destaque">
                    <div class="numero">Nº {{ str_pad($consulta->id, 6, '0', STR_PAD_LEFT) }}</div>
                    <div class="data">Emitido em: {{ $data_emissao }}</div>
                </div>
            </div>
            <div class="status-inline">
                <span class="badge-modern badge-{{ $consulta->status }}">
                    {{ ucfirst($consulta->status) }}
                </span>
                @if($consulta->agendada_online)
                    <span class="badge-modern badge-online">Online</span>
                @endif
            </div>
        </div>
        
        <!-- Cards de Informação -->
        <div class="info-cards">
            <!-- Card Paciente -->
            <div class="info-card">
                <div class="card-title">Dados do Paciente</div>
                <div class="info-item">
                    <span class="info-label-modern">Nome Completo:</span>
                    <span class="info-value-modern">{{ $consulta->paciente->nome }}</span>
                </div>
                <table style="width: 100%; margin-bottom: 0.8mm; padding-bottom: 0.5mm; border-bottom: 1px solid #e9ecef; border-collapse: collapse; table-layout: fixed;">
                    <tr>
                        <td style="width: 50%; padding-right: 0.8mm; vertical-align: top;">
                            <div style="display: flex; justify-content: space-between; flex-wrap: nowrap;">
                                <span class="info-label-modern" style="white-space: nowrap; flex-shrink: 0;">NIF:</span>
                                <span class="info-value-modern" style="white-space: nowrap; text-align: right; flex: 1; min-width: 0;">{{ $consulta->paciente->nif }}</span>
                            </div>
                        </td>
                        @if($consulta->paciente->telefone)
                        <td style="width: 50%; padding-left: 0.8mm; vertical-align: top;">
                            <div style="display: flex; justify-content: space-between; flex-wrap: nowrap;">
                                <span class="info-label-modern" style="white-space: nowrap; flex-shrink: 0;">Telefone:</span>
                                <span class="info-value-modern" style="white-space: nowrap; text-align: right; flex: 1; min-width: 0;">{{ $consulta->paciente->telefone }}</span>
                            </div>
                        </td>
                        @else
                        <td style="width: 50%;"></td>
                        @endif
                    </tr>
                </table>
            </div>
            
            <!-- Card Consulta -->
            <div class="info-card">
                <div class="card-title">Detalhes da Consulta</div>
                <div style="margin-bottom: 0.8mm; padding-bottom: 0.5mm; border-bottom: 1px solid #e9ecef;">
                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                        <tr>
                            <td style="width: 45%; padding-right: 0.8mm; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word;">
                                <div style="display: flex; justify-content: space-between; flex-wrap: nowrap;">
                                    <span class="info-label-modern" style="white-space: nowrap; flex-shrink: 0;">Data:</span>
                                    <span class="info-value-modern" style="white-space: nowrap; text-align: right; flex: 1; min-width: 0;">
                                        {{ \Carbon\Carbon::parse($consulta->data_consulta)->locale('pt')->isoFormat('dddd, DD/MM/YYYY') }}
                                    </span>
                                </div>
                            </td>
                            @if($consulta->hora_consulta)
                            <td style="width: 20%; padding: 0 0.8mm; vertical-align: top;">
                                <div style="display: flex; justify-content: space-between; flex-wrap: nowrap;">
                                    <span class="info-label-modern" style="white-space: nowrap; flex-shrink: 0;">Hora:</span>
                                    <span class="info-value-modern" style="white-space: nowrap; text-align: right;">{{ \Carbon\Carbon::parse($consulta->hora_consulta)->format('H:i') }}</span>
                                </div>
                            </td>
                            @else
                            <td style="width: 20%;"></td>
                            @endif
                            @if($consulta->sala)
                            <td style="width: 35%; padding-left: 0.8mm; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word;">
                                <div style="display: flex; justify-content: space-between; flex-wrap: nowrap;">
                                    <span class="info-label-modern" style="white-space: nowrap; flex-shrink: 0;">Sala:</span>
                                    <span class="info-value-modern" style="white-space: nowrap; text-align: right; flex: 1; min-width: 0;">{{ $consulta->sala->nome }}</span>
                                </div>
                            </td>
                            @else
                            <td style="width: 35%;"></td>
                            @endif
                        </tr>
                    </table>
                </div>
                @if($consulta->medico)
                <div class="info-item">
                    <span class="info-label-modern">Médico:</span>
                    <span class="info-value-modern">
                        {{ $consulta->medico->nome }}
                        @if($consulta->medico->especialidade) - {{ $consulta->medico->especialidade }}@endif
                    </span>
                </div>
                @endif
            </div>
        </div>
        
        <!-- Rodapé Moderno -->
        <div class="footer-modern">
            <div class="importante">Importante</div>
            <div class="texto">Apresente este recibo no dia da consulta. Chegue com 15 minutos de antecedência.</div>
            <div class="sistema">Documento gerado automaticamente pelo sistema</div>
        </div>
    </div>
</body>
</html>
