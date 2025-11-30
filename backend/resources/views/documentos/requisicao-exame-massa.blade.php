<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Requisição de Exames em Massa</title>
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
        
        .documento-container {
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
        
        .header-modern {
            background: linear-gradient(135deg, #2c5530 0%, #3d6b42 100%);
            color: #000000;
            padding: 1.5mm;
            border-radius: 3px 3px 0 0;
            margin-bottom: 1.5mm;
            text-align: center;
            flex-shrink: 0;
        }
        
        .logo-container {
            margin-bottom: 0.5mm;
        }
        
        .logo-container img {
            max-height: 8mm;
            max-width: 45mm;
            filter: brightness(0);
            display: block;
            margin: 0 auto;
        }
        
        .governo-info {
            font-size: 6px;
            font-weight: bold;
            margin-bottom: 0.2mm;
            line-height: 1.2;
            color: #000000;
            display: block;
            letter-spacing: 0.1px;
            text-transform: uppercase;
        }
        
        .instituicao-nome {
            font-size: 10px;
            font-weight: bold;
            margin: 0.5mm 0 0.3mm 0;
            letter-spacing: 0.3px;
            color: #000000;
            display: block;
        }
        
        .documento-title {
            background: #f8f9fa;
            border-left: 3px solid #2c5530;
            padding: 0.6mm 1.5mm;
            margin-bottom: 1.5mm;
            border-radius: 2px;
            flex-shrink: 0;
        }
        
        .documento-title h1 {
            font-size: 7px;
            font-weight: bold;
            color: #2c5530;
            text-transform: uppercase;
            margin: 0;
        }
        
        .documento-title .numero {
            font-size: 5px;
            color: #666;
            margin-top: 0.2mm;
        }
        
        .info-compact {
            background: #f8f9fa;
            padding: 1mm 1.5mm;
            margin-bottom: 1.5mm;
            border: 1px solid #e9ecef;
            border-radius: 2px;
            flex-shrink: 0;
        }
        
        .info-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 6px;
            margin-bottom: 0.4mm;
        }
        
        .info-line:last-child {
            margin-bottom: 0;
        }
        
        .info-label-compact {
            font-weight: 600;
            color: #495057;
            font-size: 6px;
            margin-right: 2mm;
        }
        
        .info-value-compact {
            color: #1a1a1a;
            font-size: 6px;
            text-align: right;
            flex: 1;
        }
        
        .info-separator {
            color: #ccc;
            margin: 0 1mm;
        }
        
        .exames-section {
            margin-bottom: 1.5mm;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }
        
        .exames-title {
            font-size: 7px;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 0.8mm;
            padding-bottom: 0.4mm;
            border-bottom: 1.5px solid #2c5530;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            flex-shrink: 0;
        }
        
        .exames-list {
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            padding: 2mm;
            border: 1.5px solid #2c5530;
            border-left: 3px solid #2c5530;
            border-radius: 2px;
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }
        
        .exame-item {
            margin-bottom: 1mm;
            padding-bottom: 1mm;
            border-bottom: 0.5px solid #e9ecef;
            font-size: 6px;
        }
        
        .exame-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .exame-nome {
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 0.2mm;
        }
        
        .exame-codigo {
            font-size: 5px;
            color: #666;
            margin-left: 1mm;
        }
        
        .urgente-badge {
            display: inline-block;
            padding: 0.2mm 1mm;
            background: #dc3545;
            color: #fff;
            border-radius: 8px;
            font-size: 4px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 1mm;
        }
        
        .assinatura-section {
            margin-top: 2mm;
            text-align: right;
            flex-shrink: 0;
        }
        
        .assinatura-line {
            border-top: 0.5px solid #000;
            width: 40mm;
            margin: 2mm auto 0.5mm;
        }
        
        .assinatura-text {
            font-size: 6px;
            color: #495057;
            text-align: center;
        }
        
        .footer-modern {
            background: #f8f9fa;
            border-top: 1.5px solid #2c5530;
            padding: 0.6mm 1.5mm;
            margin-top: 1mm;
            border-radius: 0 0 2px 2px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .footer-modern .texto {
            font-size: 4px;
            color: #495057;
            line-height: 1.1;
        }
        
        @page {
            margin: 0;
            size: A4;
        }
        
        .documento-container * {
            max-width: 100%;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="documento-container">
        <!-- Cabeçalho -->
        <div class="header-modern">
            @if($configuracao && $configuracao->mostrar_logo && $logo_base64)
                <div class="logo-container">
                    <img src="{{ $logo_base64 }}" alt="Logo">
                </div>
            @endif
            
            @if($configuracao)
                @if($configuracao->a_republica)
                    <div class="governo-info">{{ $configuracao->a_republica }}</div>
                @endif
                @if($configuracao->o_ministerio)
                    <div class="governo-info">{{ $configuracao->o_ministerio }}</div>
                @endif
                @if($configuracao->o_governo)
                    <div class="governo-info">{{ $configuracao->o_governo }}</div>
                @endif
                <div class="instituicao-nome">{{ $configuracao->nome_instituicao }}</div>
            @else
                <div class="governo-info">REPÚBLICA DE ANGOLA</div>
                <div class="governo-info">MINISTÉRIO DA SAÚDE</div>
                <div class="governo-info">GOVERNO PROVINCIAL DO MOXICO</div>
                <div class="instituicao-nome">Hospital Geral do Moxico</div>
            @endif
        </div>
        
        <!-- Título do Documento -->
        <div class="documento-title">
            <h1>Requisição de Exames Laboratoriais</h1>
            <div class="numero">Nº {{ str_pad($primeiraSolicitacao->id, 6, '0', STR_PAD_LEFT) }} | Emitido em: {{ $data_emissao }}</div>
        </div>
        
        <!-- Informações Compactas -->
        <div class="info-compact">
            <div class="info-line">
                <span class="info-label-compact">Paciente:</span>
                <span class="info-value-compact">{{ $primeiraSolicitacao->paciente->nome }}</span>
                <span class="info-separator">|</span>
                <span class="info-label-compact">NIF:</span>
                <span class="info-value-compact">{{ $primeiraSolicitacao->paciente->nif }}</span>
            </div>
            <div class="info-line">
                <span class="info-label-compact">Data:</span>
                <span class="info-value-compact">{{ \Carbon\Carbon::parse($primeiraSolicitacao->data_solicitacao)->format('d/m/Y') }}</span>
                @if($primeiraSolicitacao->medicoSolicitante)
                <span class="info-separator">|</span>
                <span class="info-label-compact">Médico:</span>
                <span class="info-value-compact">{{ $primeiraSolicitacao->medicoSolicitante->nome }}</span>
                @endif
            </div>
        </div>
        
        <!-- Lista de Exames -->
        <div class="exames-section">
            <div class="exames-title">Exames Solicitados ({{ count($solicitacoes) }})</div>
            <div class="exames-list">
                @foreach($solicitacoes as $index => $solicitacao)
                <div class="exame-item">
                    <div class="exame-nome">
                        {{ $index + 1 }}. {{ $solicitacao->exame->nome }}
                        @if($solicitacao->urgente)
                            <span class="urgente-badge">URGENTE</span>
                        @endif
                    </div>
                    @if($solicitacao->exame->codigo)
                    <div class="exame-codigo">Código: {{ $solicitacao->exame->codigo }}</div>
                    @endif
                </div>
                @endforeach
            </div>
        </div>
        
        <!-- Assinatura -->
        <div class="assinatura-section">
            <div class="assinatura-line"></div>
            <div class="assinatura-text">
                @if($primeiraSolicitacao->medicoSolicitante)
                    {{ $primeiraSolicitacao->medicoSolicitante->nome }}@if($primeiraSolicitacao->medicoSolicitante->crm) - Nº Ordem: {{ $primeiraSolicitacao->medicoSolicitante->crm }}@endif
                @else
                    Médico Solicitante
                @endif
            </div>
        </div>
        
        <!-- Rodapé -->
        <div class="footer-modern">
            <div class="texto">Documento gerado automaticamente pelo sistema</div>
        </div>
    </div>
</body>
</html>

