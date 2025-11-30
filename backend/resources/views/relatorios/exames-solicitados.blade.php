<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Exames Solicitados</title>
    <style>
        @page {
            margin: 8mm;
            size: A4;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 9px;
            color: #000000;
            line-height: 1.4;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #000;
        }
        
        .logo-container {
            margin-bottom: 2mm;
        }
        
        .logo-container img {
            max-height: 20mm;
            max-width: 80mm;
            display: block;
            margin: 0 auto;
        }
        
        .governo-info {
            font-size: 8px;
            font-weight: bold;
            margin-bottom: 1mm;
            color: #000;
            text-transform: uppercase;
        }
        
        .instituicao-nome {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 2mm;
            color: #000;
        }
        
        .header h1 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 1mm;
            text-transform: uppercase;
        }
        
        .header .periodo {
            font-size: 10px;
            color: #333;
            font-weight: bold;
        }
        
        .filtros {
            margin-bottom: 4mm;
            font-size: 8px;
            padding: 2mm;
            background: #f5f5f5;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5mm;
            font-size: 8px;
        }
        
        thead {
            background: #333;
            color: #fff;
        }
        
        th {
            padding: 2mm;
            text-align: left;
            font-weight: bold;
            border: 1px solid #000;
            font-size: 8px;
        }
        
        td {
            padding: 1.5mm 2mm;
            border: 1px solid #ccc;
        }
        
        tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        .footer {
            margin-top: 5mm;
            padding-top: 2mm;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 7px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        @if(isset($logo_base64) && $logo_base64)
        <div class="logo-container">
            <img src="{{ $logo_base64 }}" alt="Logo">
        </div>
        @endif
        @if(isset($configuracao) && $configuracao)
            @if($configuracao->a_republica)
                <div class="governo-info">{{ $configuracao->a_republica }}</div>
            @endif
            @if($configuracao->o_ministerio)
                <div class="governo-info">{{ $configuracao->o_ministerio }}</div>
            @endif
            @if($configuracao->o_governo)
                <div class="governo-info">{{ $configuracao->o_governo }}</div>
            @endif
            @if($configuracao->nome_instituicao)
                <div class="instituicao-nome">{{ $configuracao->nome_instituicao }}</div>
            @endif
        @endif
        <h1>RELATÓRIO DE EXAMES SOLICITADOS</h1>
        @if($data_inicio && $data_fim)
        <div class="periodo">Período: {{ $data_inicio }} a {{ $data_fim }}</div>
        @endif
    </div>

    @if($filtros['medico'] || $filtros['exame'] || $filtros['status'])
    <div class="filtros">
        <strong>Filtros:</strong>
        @if($filtros['medico'])
            Médico: {{ $filtros['medico']->nome }}
        @endif
        @if($filtros['exame'])
            | Exame: {{ $filtros['exame']->nome }}
        @endif
        @if($filtros['status'])
            | Status: {{ ucfirst($filtros['status']) }}
        @endif
    </div>
    @endif

    @if($estatisticas['por_exame']->count() > 0)
    <table>
        <thead>
            <tr>
                <th>Exame</th>
                <th style="text-align: center;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($estatisticas['por_exame'] as $exame)
            <tr>
                <td>{{ $exame['nome'] }}</td>
                <td style="text-align: center;">{{ $exame['total'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Paciente</th>
                <th>Exame</th>
                <th>Médico</th>
                <th>Status</th>
                <th style="text-align: center;">Urgente</th>
            </tr>
        </thead>
        <tbody>
            @forelse($solicitacoes as $solicitacao)
            <tr>
                <td>{{ \Carbon\Carbon::parse($solicitacao->data_solicitacao)->format('d/m/Y') }}</td>
                <td>{{ $solicitacao->paciente->nome }}</td>
                <td>{{ $solicitacao->exame ? $solicitacao->exame->nome : '-' }}</td>
                <td>{{ $solicitacao->medicoSolicitante ? $solicitacao->medicoSolicitante->nome : '-' }}</td>
                <td>{{ ucfirst($solicitacao->status) }}</td>
                <td style="text-align: center;">{{ $solicitacao->urgente ? 'Sim' : 'Não' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 4mm;">
                    Nenhuma solicitação encontrada.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Relatório gerado em {{ $data_emissao }}
        @if(isset($configuracao) && $configuracao)
            @if($configuracao->nome_instituicao)
            <br><strong>{{ $configuracao->nome_instituicao }}</strong>
            @endif
            @if($configuracao->mostrar_endereco && $configuracao->endereco)
            <br>{{ $configuracao->endereco }}
            @endif
            @if($configuracao->mostrar_contato)
                @if($configuracao->telefone)
                <br>Tel: {{ $configuracao->telefone }}
                @endif
                @if($configuracao->email)
                | Email: {{ $configuracao->email }}
                @endif
            @endif
        @endif
    </div>
</body>
</html>

