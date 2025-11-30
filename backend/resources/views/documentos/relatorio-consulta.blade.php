<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Consulta</title>
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
            min-width: 30mm;
        }
        
        .info-value {
            color: #1a1a1a;
            font-size: 8px;
            text-align: right;
            flex: 1;
        }
        
        .content-box {
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            padding: 3mm;
            border: 2px solid #e9ecef;
            border-left: 4px solid #2c5530;
            border-radius: 4px;
            margin-top: 1mm;
            min-height: 15mm;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        
        .content-text {
            font-size: 8px;
            color: #1a1a1a;
            line-height: 1.7;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .vitals-grid {
            display: table;
            width: 100%;
            margin-top: 1mm;
            border-collapse: collapse;
        }
        
        .vital-item {
            display: table-cell;
            width: 25%;
            padding: 1mm;
            text-align: center;
            border: 1px solid #e9ecef;
            background: #ffffff;
        }
        
        .vital-label {
            font-size: 7px;
            color: #666;
            margin-bottom: 0.3mm;
        }
        
        .vital-value {
            font-size: 9px;
            font-weight: bold;
            color: #1a1a1a;
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
            <h1>RELATÓRIO DE CONSULTA MÉDICA</h1>
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
            @if($consulta->paciente->data_nascimento)
            <div class="info-item">
                <span class="info-label">Data de Nascimento:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($consulta->paciente->data_nascimento)->format('d/m/Y') }}</span>
            </div>
            @endif
        </div>
        
        <!-- Dados da Consulta -->
        <div class="info-section">
            <div class="section-title">Dados da Consulta</div>
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
        
        <!-- Anamnese -->
        @if($consulta->queixa_principal || $consulta->historia_doenca_atual)
        <div class="info-section">
            <div class="section-title">Anamnese</div>
            @if($consulta->queixa_principal)
            <div class="content-box">
                <div class="content-text"><strong>Queixa Principal:</strong> {{ $consulta->queixa_principal }}</div>
            </div>
            @endif
            @if($consulta->historia_doenca_atual)
            <div class="content-box" style="margin-top: 1mm;">
                <div class="content-text"><strong>História da Doença Atual:</strong> {{ $consulta->historia_doenca_atual }}</div>
            </div>
            @endif
        </div>
        @endif
        
        <!-- Sinais Vitais -->
        @if($consulta->pressao_arterial || $consulta->frequencia_cardiaca || $consulta->frequencia_respiratoria || $consulta->temperatura || $consulta->peso || $consulta->altura)
        <div class="info-section">
            <div class="section-title">Sinais Vitais</div>
            <div class="vitals-grid">
                @if($consulta->pressao_arterial)
                <div class="vital-item">
                    <div class="vital-label">Pressão Arterial</div>
                    <div class="vital-value">{{ $consulta->pressao_arterial }}</div>
                </div>
                @endif
                @if($consulta->frequencia_cardiaca)
                <div class="vital-item">
                    <div class="vital-label">FC</div>
                    <div class="vital-value">{{ $consulta->frequencia_cardiaca }} bpm</div>
                </div>
                @endif
                @if($consulta->frequencia_respiratoria)
                <div class="vital-item">
                    <div class="vital-label">FR</div>
                    <div class="vital-value">{{ $consulta->frequencia_respiratoria }} rpm</div>
                </div>
                @endif
                @if($consulta->temperatura)
                <div class="vital-item">
                    <div class="vital-label">Temperatura</div>
                    <div class="vital-value">{{ $consulta->temperatura }}°C</div>
                </div>
                @endif
                @if($consulta->peso)
                <div class="vital-item">
                    <div class="vital-label">Peso</div>
                    <div class="vital-value">{{ $consulta->peso }} kg</div>
                </div>
                @endif
                @if($consulta->altura)
                <div class="vital-item">
                    <div class="vital-label">Altura</div>
                    <div class="vital-value">{{ $consulta->altura }} cm</div>
                </div>
                @endif
            </div>
        </div>
        @endif
        
        <!-- Exame Físico -->
        @if($consulta->exame_fisico)
        <div class="info-section">
            <div class="section-title">Exame Físico</div>
            <div class="content-box">
                <div class="content-text">{{ $consulta->exame_fisico }}</div>
            </div>
        </div>
        @endif
        
        <!-- Diagnóstico -->
        @if($consulta->diagnostico)
        <div class="info-section">
            <div class="section-title">Diagnóstico</div>
            <div class="content-box">
                <div class="content-text">{{ $consulta->diagnostico }}</div>
            </div>
        </div>
        @endif
        
        <!-- Conduta -->
        @if($consulta->conduta)
        <div class="info-section">
            <div class="section-title">Conduta</div>
            <div class="content-box">
                <div class="content-text">{{ $consulta->conduta }}</div>
            </div>
        </div>
        @endif
        
        <!-- Assinatura -->
        <div class="assinatura-section">
            <div class="assinatura-line"></div>
            <div class="assinatura-text">
                @if($consulta->medico)
                    {{ $consulta->medico->nome }}@if($consulta->medico->crm) - Nº Ordem: {{ $consulta->medico->crm }}@endif
                @else
                    Médico Responsável
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

