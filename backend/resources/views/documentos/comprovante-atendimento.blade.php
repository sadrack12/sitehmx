<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprovante de Atendimento</title>
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
            min-width: 25mm;
        }
        
        .info-value {
            color: #1a1a1a;
            font-size: 8px;
            text-align: right;
            flex: 1;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.5mm 2mm;
            border-radius: 15px;
            font-size: 7px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .badge-realizada {
            background: linear-gradient(135deg, #d4edda 0%, #28a745 100%);
            color: #155724;
            border: 2px solid #28a745;
        }
        
        .badge-confirmada {
            background: linear-gradient(135deg, #d1ecf1 0%, #17a2b8 100%);
            color: #0c5460;
            border: 2px solid #17a2b8;
        }
        
        .badge-agendada {
            background: linear-gradient(135deg, #fff3cd 0%, #ffc107 100%);
            color: #856404;
            border: 2px solid #ffc107;
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
            <h1>COMPROVANTE DE ATENDIMENTO</h1>
            <div class="numero">Nº {{ str_pad($consulta->id, 6, '0', STR_PAD_LEFT) }} | Emitido em: {{ $data_emissao }}</div>
        </div>
        
        <!-- Dados do Paciente -->
        <div class="info-section">
            <div class="section-title">Dados do Paciente</div>
            <div class="info-item">
                <span class="info-label">Nome Completo:</span>
                <span class="info-value">{{ $consulta->paciente->nome }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">NIF:</span>
                <span class="info-value">{{ $consulta->paciente->nif }}</span>
            </div>
            @if($consulta->paciente->telefone)
            <div class="info-item">
                <span class="info-label">Telefone:</span>
                <span class="info-value">{{ $consulta->paciente->telefone }}</span>
            </div>
            @endif
        </div>
        
        <!-- Dados do Atendimento -->
        <div class="info-section">
            <div class="section-title">Dados do Atendimento</div>
            <div class="info-item">
                <span class="info-label">Data:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($consulta->data_consulta)->locale('pt')->isoFormat('dddd, DD/MM/YYYY') }}</span>
            </div>
            @if($consulta->hora_consulta)
            <div class="info-item">
                <span class="info-label">Hora:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($consulta->hora_consulta)->format('H:i') }}</span>
            </div>
            @endif
            <div class="info-item">
                <span class="info-label">Tipo de Consulta:</span>
                <span class="info-value">{{ $consulta->tipo_consulta }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span class="status-badge badge-{{ $consulta->status }}">{{ ucfirst($consulta->status) }}</span>
                </span>
            </div>
            @if($consulta->medico)
            <div class="info-item">
                <span class="info-label">Médico:</span>
                <span class="info-value">{{ $consulta->medico->nome }}@if($consulta->medico->especialidade) - {{ $consulta->medico->especialidade }}@endif</span>
            </div>
            @endif
            @if($consulta->sala)
            <div class="info-item">
                <span class="info-label">Sala:</span>
                <span class="info-value">{{ $consulta->sala->numero }}@if($consulta->sala->nome) - {{ $consulta->sala->nome }}@endif</span>
            </div>
            @endif
        </div>
        
        <!-- Rodapé -->
        <div class="footer-modern">
            <div class="texto">Este comprovante confirma o atendimento médico realizado nesta unidade de saúde.</div>
            <div class="texto" style="margin-top: 0.3mm;">Documento gerado automaticamente pelo sistema</div>
        </div>
    </div>
</body>
</html>

