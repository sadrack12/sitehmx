<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescrição Médica</title>
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
        
        /* Header Moderno */
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
            opacity: 1;
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
        
        /* Título do Documento */
        .documento-title-modern {
            background: #f8f9fa;
            border-left: 3px solid #2c5530;
            padding: 0.6mm 1.5mm;
            margin-bottom: 1mm;
            border-radius: 2px;
            flex-shrink: 0;
        }
        
        .documento-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .documento-title-text {
            font-size: 7px;
            font-weight: bold;
            color: #2c5530;
            text-transform: uppercase;
            letter-spacing: 0.1px;
        }
        
        .numero-destaque {
            text-align: right;
        }
        
        .numero-destaque .numero {
            font-size: 9px;
            font-weight: bold;
            color: #2c5530;
            line-height: 1.1;
        }
        
        .numero-destaque .data {
            font-size: 4px;
            color: #666;
            line-height: 1.0;
        }
        
        /* Informações Compactas */
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
        
        /* Prescrição */
        .prescricao-section {
            margin-bottom: 1.5mm;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }
        
        .prescricao-title {
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
        
        .prescricao-content {
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            padding: 2mm;
            border: 1.5px solid #2c5530;
            border-left: 3px solid #2c5530;
            border-radius: 3px;
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }
        
        .prescricao-text {
            font-size: 7px;
            color: #1a1a1a;
            line-height: 1.5;
            word-wrap: break-word;
            font-family: 'DejaVu Sans', Arial, sans-serif;
        }
        
        .medicamento-item {
            margin-bottom: 1.2mm;
            padding-bottom: 1mm;
            border-bottom: 0.5px solid #e0e0e0;
        }
        
        .medicamento-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .medicamento-numero {
            display: inline-block;
            width: 3mm;
            font-weight: bold;
            color: #2c5530;
            margin-right: 1mm;
        }
        
        .medicamento-nome {
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 0.3mm;
        }
        
        .medicamento-detalhes {
            font-size: 6px;
            color: #495057;
            margin-left: 4mm;
            line-height: 1.4;
        }
        
        .medicamento-detalhes-linha {
            margin-bottom: 0.3mm;
            line-height: 1.3;
        }
        
        .medicamento-detalhe-item {
            display: inline;
            white-space: nowrap;
        }
        
        .medicamento-detalhe-item:not(:last-child)::after {
            content: " | ";
            color: #ccc;
            margin: 0 0.5mm;
        }
        
        .medicamento-instrucoes {
            margin-top: 0.3mm;
            margin-left: 4mm;
            font-size: 6px;
            color: #495057;
        }
        
        .instrucoes-gerais {
            margin-top: 1.5mm;
            padding-top: 1mm;
            border-top: 1px solid #2c5530;
            font-size: 6.5px;
            color: #495057;
            font-style: italic;
        }
        
        /* Assinatura */
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
            font-size: 7px;
            color: #495057;
            text-align: center;
        }
        
        /* Footer Moderno */
        .footer-modern {
            background: #f8f9fa;
            border-top: 1.5px solid #2c5530;
            padding: 0.6mm 1.5mm;
            margin-top: 1mm;
            border-radius: 0 0 3px 3px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .footer-modern .texto {
            font-size: 5px;
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
        <!-- Cabeçalho Moderno -->
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
        <div class="documento-title-modern">
            <div class="documento-header-row">
                <div class="documento-title-text">Prescrição Médica</div>
                <div class="numero-destaque">
                    <div class="numero">Nº {{ str_pad($consulta->id, 6, '0', STR_PAD_LEFT) }}</div>
                    <div class="data">Emitido em: {{ $data_emissao }}</div>
                </div>
            </div>
        </div>
        
        <!-- Informações Compactas -->
        <div class="info-compact">
            <div class="info-line">
                <span class="info-label-compact">Paciente:</span>
                <span class="info-value-compact">{{ $consulta->paciente->nome }}</span>
                <span class="info-separator">|</span>
                <span class="info-label-compact">NIF:</span>
                <span class="info-value-compact">{{ $consulta->paciente->nif }}</span>
            </div>
            <div class="info-line">
                <span class="info-label-compact">Data:</span>
                <span class="info-value-compact">{{ \Carbon\Carbon::parse($consulta->data_consulta)->format('d/m/Y') }}</span>
                @if($consulta->medico)
                <span class="info-separator">|</span>
                <span class="info-label-compact">Médico:</span>
                <span class="info-value-compact">{{ $consulta->medico->nome }}</span>
                @endif
            </div>
        </div>
        
        <!-- Prescrição -->
        <div class="prescricao-section">
            <div class="prescricao-title">Prescrição Médica</div>
            <div class="prescricao-content">
                <div class="prescricao-text">
                    @if($consulta->prescricao)
                        @php
                            // Tentar parsear como JSON primeiro (formato novo)
                            $itens = null;
                            try {
                                $parsed = json_decode($consulta->prescricao, true);
                                if (is_array($parsed)) {
                                    $itens = $parsed;
                                }
                            } catch (\Exception $e) {
                                // Não é JSON, tratar como texto
                            }
                            
                            // Se não for JSON, processar como texto formatado
                            if (!$itens) {
                                $linhas = explode("\n", trim($consulta->prescricao));
                                $itens = [];
                                $instrucoesGerais = [];
                                $emInstrucoesGerais = false;
                                
                                foreach ($linhas as $linha) {
                                    $linha = trim($linha);
                                    if (empty($linha)) continue;
                                    
                                    // Verificar se é início de instruções gerais
                                    if (stripos($linha, 'Instruções Gerais') !== false || stripos($linha, 'instrucoes gerais') !== false) {
                                        $emInstrucoesGerais = true;
                                        continue;
                                    }
                                    
                                    if ($emInstrucoesGerais) {
                                        $instrucoesGerais[] = $linha;
                                    } else {
                                        // Tentar parsear linha formatada: "1. Medicamento - Dosagem - Posologia - Dias - Instruções"
                                        if (preg_match('/^(\d+)\.\s*(.+)$/', $linha, $matches)) {
                                            $numero = $matches[1];
                                            $resto = trim($matches[2]);
                                            $partes = preg_split('/\s*-\s*/', $resto, -1, PREG_SPLIT_NO_EMPTY);
                                            
                                            $itens[] = [
                                                'numero' => $numero,
                                                'medicamento_nome' => $partes[0] ?? '',
                                                'dosagem' => $partes[1] ?? '',
                                                'posologia' => $partes[2] ?? '',
                                                'dias' => $partes[3] ?? '',
                                                'instrucoes' => isset($partes[4]) ? implode(' - ', array_slice($partes, 4)) : '',
                                            ];
                                        } else {
                                            // Linha simples, adicionar como nome do medicamento
                                            $itens[] = [
                                                'numero' => count($itens) + 1,
                                                'medicamento_nome' => $linha,
                                                'dosagem' => '',
                                                'posologia' => '',
                                                'dias' => '',
                                                'instrucoes' => '',
                                            ];
                                        }
                                    }
                                }
                            }
                        @endphp
                        
                        @if(!empty($itens))
                            @foreach($itens as $index => $item)
                                <div class="medicamento-item">
                                    <div class="medicamento-nome">
                                        <span class="medicamento-numero">{{ $item['numero'] ?? ($index + 1) }}.</span>
                                        {{ $item['medicamento_nome'] ?? '' }}
                                    </div>
                                    @if(!empty($item['dosagem']) || !empty($item['posologia']) || !empty($item['dias']) || !empty($item['instrucoes']))
                                        <div class="medicamento-detalhes">
                                            @if(!empty($item['dosagem']) || !empty($item['posologia']) || !empty($item['dias']))
                                                <div class="medicamento-detalhes-linha">
                                                    @if(!empty($item['dosagem']))
                                                        <span class="medicamento-detalhe-item"><strong>Dosagem:</strong> {{ $item['dosagem'] }}</span>
                                                    @endif
                                                    @if(!empty($item['posologia']))
                                                        <span class="medicamento-detalhe-item"><strong>Posologia:</strong> {{ $item['posologia'] }}</span>
                                                    @endif
                                                    @if(!empty($item['dias']))
                                                        <span class="medicamento-detalhe-item"><strong>Duração:</strong> {{ $item['dias'] }}@if(is_numeric($item['dias'])) dias @endif</span>
                                                    @endif
                                                </div>
                                            @endif
                                            @if(!empty($item['instrucoes']))
                                                <div class="medicamento-instrucoes"><strong>Instruções:</strong> {{ $item['instrucoes'] }}</div>
                                            @endif
                                        </div>
                                    @endif
                                </div>
                            @endforeach
                            
                            @if(!empty($instrucoesGerais))
                                <div class="instrucoes-gerais">
                                    <strong>Instruções Gerais:</strong><br>
                                    {{ implode("\n", $instrucoesGerais) }}
                                </div>
                            @endif
                        @else
                            {{ $consulta->prescricao }}
                        @endif
                    @else
                        <em style="color: #999;">Nenhuma prescrição registrada.</em>
                    @endif
                </div>
            </div>
        </div>
        
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
        
        <!-- Rodapé Moderno -->
        <div class="footer-modern">
            <div class="texto">Documento gerado automaticamente pelo sistema</div>
        </div>
    </div>
</body>
</html>
