<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado de Exame</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            color: #1a1a1a;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }
        
        .documento-container {
            width: 85%;
            max-width: 85%;
            background: #ffffff;
            margin: 0 auto;
            padding: 3mm;
            box-sizing: border-box;
        }
        
        .header-modern {
            background: linear-gradient(135deg, #2c5530 0%, #3d6b42 100%);
            color: #000000;
            padding: 2.5mm;
            border-radius: 4px 4px 0 0;
            margin-bottom: 2mm;
            text-align: center;
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
        
        .documento-title {
            background: #f8f9fa;
            border-left: 4px solid #2c5530;
            padding: 1mm 2mm;
            margin-bottom: 2mm;
            border-radius: 3px;
        }
        
        .documento-title h1 {
            font-size: 12px;
            font-weight: bold;
            color: #2c5530;
            text-transform: uppercase;
            margin: 0;
        }
        
        .documento-title .numero {
            font-size: 9px;
            color: #666;
            margin-top: 0.3mm;
        }
        
        .info-section {
            margin-bottom: 2mm;
        }
        
        .section-title {
            font-size: 9px;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 1mm;
            padding-bottom: 0.5mm;
            border-bottom: 2px solid #2c5530;
            text-transform: uppercase;
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
        }
        
        .info-label {
            font-weight: 600;
            color: #495057;
            font-size: 8px;
            min-width: 30mm;
        }
        
        .info-value {
            color: #1a1a1a;
            font-size: 8px;
            text-align: right;
            flex: 1;
        }
        
        .exame-box {
            background: #fafafa;
            padding: 2mm;
            border: 1px solid #e9ecef;
            border-radius: 3px;
            margin-top: 1mm;
        }
        
        .exame-nome {
            font-size: 10px;
            font-weight: bold;
            color: #2c5530;
            margin-bottom: 0.5mm;
        }
        
        .resultado-box {
            background: linear-gradient(to bottom, #ffffff 0%, #f0fdf4 100%);
            padding: 3mm;
            border: 2px solid #2c5530;
            border-left: 5px solid #28a745;
            border-radius: 4px;
            margin-top: 1mm;
            min-height: 30mm;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .resultado-text {
            font-size: 9px;
            color: #1a1a1a;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'DejaVu Sans', 'Courier New', monospace;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.5mm 2mm;
            border-radius: 10px;
            font-size: 7px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 2mm;
        }
        
        .status-normal {
            background: #d4edda;
            color: #155724;
        }
        
        .status-anormal {
            background: #f8d7da;
            color: #721c24;
        }
        
        .assinatura-section {
            margin-top: 8mm;
            text-align: right;
        }
        
        .assinatura-line {
            border-top: 1px solid #000;
            width: 60mm;
            margin: 8mm auto 1mm;
        }
        
        .assinatura-text {
            font-size: 8px;
            color: #495057;
            text-align: center;
        }
        
        .footer-modern {
            background: #f8f9fa;
            border-top: 2px solid #2c5530;
            padding: 0.8mm 2mm;
            margin-top: 2mm;
            border-radius: 0 0 4px 4px;
            text-align: center;
        }
        
        .footer-modern .texto {
            font-size: 6px;
            color: #495057;
            line-height: 1.2;
        }
        
        @page {
            margin: 3mm;
            size: A4;
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
                @else
                    <div class="governo-info">REPÚBLICA DE ANGOLA</div>
                @endif
                @if($configuracao->o_ministerio)
                    <div class="governo-info">{{ $configuracao->o_ministerio }}</div>
                @else
                    <div class="governo-info">MINISTÉRIO DA SAÚDE</div>
                @endif
                @if($configuracao->o_governo)
                    <div class="governo-info">{{ $configuracao->o_governo }}</div>
                @else
                    <div class="governo-info">GOVERNO PROVINCIAL DO MOXICO</div>
                @endif
                
                <div class="instituicao-nome">{{ $configuracao->nome_instituicao }}</div>
            @else
                <div class="instituicao-nome">Hospital Geral do Moxico</div>
            @endif
        </div>
        
        <!-- Título do Documento -->
        <div class="documento-title">
            <h1>RESULTADO DE EXAME LABORATORIAL</h1>
            <div class="numero">Nº {{ str_pad($solicitacao->id, 6, '0', STR_PAD_LEFT) }} | Emitido em: {{ $data_emissao }}</div>
        </div>
        
        <!-- Dados do Paciente -->
        <div class="info-section">
            <div class="section-title">Dados do Paciente</div>
            <div class="info-item">
                <span class="info-label">Nome Completo:</span>
                <span class="info-value">{{ $solicitacao->paciente->nome }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">NIF:</span>
                <span class="info-value">{{ $solicitacao->paciente->nif }}</span>
            </div>
            @if($solicitacao->paciente->data_nascimento)
            <div class="info-item">
                <span class="info-label">Data de Nascimento:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($solicitacao->paciente->data_nascimento)->format('d/m/Y') }}</span>
            </div>
            @endif
        </div>
        
        <!-- Dados do Exame -->
        <div class="info-section">
            <div class="section-title">Dados do Exame</div>
            <div class="exame-box">
                <div class="exame-nome">{{ $solicitacao->exame->nome }}</div>
                @if($solicitacao->exame->codigo)
                <div style="font-size: 8px; color: #666;">Código: {{ $solicitacao->exame->codigo }}</div>
                @endif
            </div>
            @if($solicitacao->data_realizacao)
            <div class="info-item" style="margin-top: 1mm;">
                <span class="info-label">Data de Realização:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($solicitacao->data_realizacao)->format('d/m/Y') }}</span>
            </div>
            @endif
            @if($solicitacao->data_resultado)
            <div class="info-item">
                <span class="info-label">Data do Resultado:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($solicitacao->data_resultado)->format('d/m/Y') }}</span>
            </div>
            @endif
        </div>
        
        <!-- Resultado -->
        <div class="info-section">
            <div class="section-title">Resultado</div>
            <div class="resultado-box">
                @if($solicitacao->resultado)
                    <div class="resultado-text">{{ $solicitacao->resultado }}</div>
                @else
                    <div class="resultado-text" style="color: #999; font-style: italic;">Resultado não disponível.</div>
                @endif
            </div>
        </div>
        
        <!-- Assinatura -->
        <div class="assinatura-section">
            <div class="assinatura-line"></div>
            <div class="assinatura-text">
                Responsável Técnico do Laboratório
            </div>
        </div>
        
        <!-- Rodapé -->
        <div class="footer-modern">
            <div class="texto">Documento gerado automaticamente pelo sistema</div>
        </div>
    </div>
</body>
</html>

