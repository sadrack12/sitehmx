<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Relatório Estatístico Geral</title>
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
        <h1>RELATÓRIO ESTATÍSTICO GERAL</h1>
        <div class="periodo">Período: {{ $data_inicio }} a {{ $data_fim }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Indicador</th>
                <th style="text-align: center;">Valor</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>CONSULTAS</strong></td>
                <td></td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Total de Consultas</td>
                <td style="text-align: center;">{{ $consultas['total'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Agendadas</td>
                <td style="text-align: center;">{{ $consultas['por_status']['agendada'] ?? 0 }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Confirmadas</td>
                <td style="text-align: center;">{{ $consultas['por_status']['confirmada'] ?? 0 }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Realizadas</td>
                <td style="text-align: center;">{{ $consultas['por_status']['realizada'] ?? 0 }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Canceladas</td>
                <td style="text-align: center;">{{ $consultas['por_status']['cancelada'] ?? 0 }}</td>
            </tr>
            <tr>
                <td><strong>PACIENTES</strong></td>
                <td></td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Total Cadastrados</td>
                <td style="text-align: center;">{{ $pacientes['total'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Novos no Período</td>
                <td style="text-align: center;">{{ $pacientes['novos'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Atendidos</td>
                <td style="text-align: center;">{{ $pacientes['atendidos'] }}</td>
            </tr>
            <tr>
                <td><strong>MÉDICOS</strong></td>
                <td></td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Total</td>
                <td style="text-align: center;">{{ $medicos['total'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Ativos no Período</td>
                <td style="text-align: center;">{{ $medicos['ativos'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Taxa de Atividade</td>
                <td style="text-align: center;">
                    @if($medicos['total'] > 0)
                        {{ number_format(($medicos['ativos'] / $medicos['total']) * 100, 1) }}%
                    @else
                        0%
                    @endif
                </td>
            </tr>
            <tr>
                <td><strong>EXAMES</strong></td>
                <td></td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Total Solicitados</td>
                <td style="text-align: center;">{{ $exames['total'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Com Resultado</td>
                <td style="text-align: center;">{{ $exames['com_resultado'] }}</td>
            </tr>
            <tr>
                <td style="padding-left: 1mm;">Taxa de Conclusão</td>
                <td style="text-align: center;">
                    @if($exames['total'] > 0)
                        {{ number_format(($exames['com_resultado'] / $exames['total']) * 100, 1) }}%
                    @else
                        0%
                    @endif
                </td>
            </tr>
        </tbody>
    </table>

    @if($especialidades_mais_procuradas->count() > 0)
    <table>
        <thead>
            <tr>
                <th>Especialidade</th>
                <th style="text-align: center;">Total de Consultas</th>
            </tr>
        </thead>
        <tbody>
            @foreach($especialidades_mais_procuradas as $especialidade => $total)
            <tr>
                <td>{{ $especialidade }}</td>
                <td style="text-align: center;">{{ $total }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

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

