<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\Medico;
use App\Models\Especialidade;
use App\Models\SolicitacaoExameLaboratorio;
use App\Models\Exame;
use App\Models\PdfConfiguracao;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RelatorioController extends Controller
{
    /**
     * Prepara dados comuns para todos os relatórios
     */
    private function prepararDadosComuns()
    {
        $configuracao = PdfConfiguracao::first();
        
        $logoBase64 = null;
        if ($configuracao && $configuracao->logo_path && $configuracao->mostrar_logo) {
            try {
                $logoPath = storage_path('app/public/' . $configuracao->logo_path);
                if (file_exists($logoPath)) {
                    $logoContent = file_get_contents($logoPath);
                    $logoBase64 = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . base64_encode($logoContent);
                }
            } catch (\Exception $e) {
                \Log::warning('Erro ao carregar logo para PDF: ' . $e->getMessage());
            }
        }
        
        return [
            'configuracao' => $configuracao,
            'logo_base64' => $logoBase64,
            'data_emissao' => Carbon::now()->format('d/m/Y H:i:s'),
        ];
    }

    /**
     * 1. RELATÓRIO DE CONSULTAS POR PERÍODO
     */
    public function consultasPorPeriodo(Request $request)
    {
        try {
            $request->validate([
                'data_inicio' => 'required|date',
                'data_fim' => 'required|date|after_or_equal:data_inicio',
                'medico_id' => 'nullable|exists:medicos,id',
                'especialidade' => 'nullable|string',
                'status' => 'nullable|in:agendada,confirmada,realizada,cancelada',
            ]);

            $dataInicio = Carbon::parse($request->data_inicio)->startOfDay();
            $dataFim = Carbon::parse($request->data_fim)->endOfDay();

            $query = Consulta::with(['paciente', 'medico', 'sala'])
                ->whereBetween('data_consulta', [$dataInicio, $dataFim]);

            if ($request->medico_id) {
                $query->where('medico_id', $request->medico_id);
            }

            if ($request->especialidade) {
                $query->whereHas('medico', function($q) use ($request) {
                    $q->where('especialidade', $request->especialidade);
                });
            }

            if ($request->status) {
                $query->where('status', $request->status);
            }

            $consultas = $query->orderBy('data_consulta', 'asc')
                ->orderBy('hora_consulta', 'asc')
                ->get();

            // Estatísticas
            $totalConsultas = $consultas->count();
            $porStatus = $consultas->groupBy('status')->map->count();
            $porEspecialidade = $consultas->groupBy(function($consulta) {
                return $consulta->medico ? $consulta->medico->especialidade : 'Sem especialidade';
            })->map->count();

            $dadosComuns = $this->prepararDadosComuns();

            $data = array_merge($dadosComuns, [
                'consultas' => $consultas,
                'data_inicio' => $dataInicio->format('d/m/Y'),
                'data_fim' => $dataFim->format('d/m/Y'),
                'filtros' => [
                    'medico' => $request->medico_id ? Medico::find($request->medico_id) : null,
                    'especialidade' => $request->especialidade,
                    'status' => $request->status,
                ],
                'estatisticas' => [
                    'total' => $totalConsultas,
                    'por_status' => $porStatus,
                    'por_especialidade' => $porEspecialidade,
                ],
            ]);

            $pdf = Pdf::loadView('relatorios.consultas-periodo', $data);
            $nomeArquivo = 'relatorio-consultas-' . $dataInicio->format('Ymd') . '-' . $dataFim->format('Ymd') . '.pdf';

            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar relatório de consultas: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao gerar relatório',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 2. RELATÓRIO DE EXAMES SOLICITADOS
     */
    public function examesSolicitados(Request $request)
    {
        try {
            $request->validate([
                'data_inicio' => 'nullable|date',
                'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                'medico_id' => 'nullable|exists:medicos,id',
                'exame_id' => 'nullable|exists:exames,id',
                'status' => 'nullable|in:pending,completed,cancelled',
            ]);

            $query = SolicitacaoExameLaboratorio::with(['paciente', 'medicoSolicitante', 'exame', 'consulta']);

            if ($request->data_inicio) {
                $dataInicio = Carbon::parse($request->data_inicio)->startOfDay();
                $query->whereDate('data_solicitacao', '>=', $dataInicio);
            }

            if ($request->data_fim) {
                $dataFim = Carbon::parse($request->data_fim)->endOfDay();
                $query->whereDate('data_solicitacao', '<=', $dataFim);
            }

            if ($request->medico_id) {
                $query->where('medico_solicitante_id', $request->medico_id);
            }

            if ($request->exame_id) {
                $query->where('exame_id', $request->exame_id);
            }

            if ($request->status) {
                $query->where('status', $request->status);
            }

            $solicitacoes = $query->orderBy('data_solicitacao', 'desc')->get();

            // Estatísticas
            $totalSolicitacoes = $solicitacoes->count();
            $porStatus = $solicitacoes->groupBy('status')->map->count();
            $porExame = $solicitacoes->groupBy('exame_id')->map(function($group) {
                return [
                    'nome' => $group->first()->exame ? $group->first()->exame->nome : 'Exame não encontrado',
                    'total' => $group->count(),
                ];
            })->sortByDesc('total')->take(10);

            $dadosComuns = $this->prepararDadosComuns();

            $data = array_merge($dadosComuns, [
                'solicitacoes' => $solicitacoes,
                'data_inicio' => $request->data_inicio ? Carbon::parse($request->data_inicio)->format('d/m/Y') : null,
                'data_fim' => $request->data_fim ? Carbon::parse($request->data_fim)->format('d/m/Y') : null,
                'filtros' => [
                    'medico' => $request->medico_id ? Medico::find($request->medico_id) : null,
                    'exame' => $request->exame_id ? Exame::find($request->exame_id) : null,
                    'status' => $request->status,
                ],
                'estatisticas' => [
                    'total' => $totalSolicitacoes,
                    'por_status' => $porStatus,
                    'por_exame' => $porExame,
                ],
            ]);

            $pdf = Pdf::loadView('relatorios.exames-solicitados', $data);
            $nomeArquivo = 'relatorio-exames-' . Carbon::now()->format('YmdHis') . '.pdf';

            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar relatório de exames: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao gerar relatório',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 3. RELATÓRIO ESTATÍSTICO GERAL
     */
    public function estatisticoGeral(Request $request)
    {
        try {
            $request->validate([
                'data_inicio' => 'nullable|date',
                'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            ]);

            $dataInicio = $request->data_inicio 
                ? Carbon::parse($request->data_inicio)->startOfDay() 
                : Carbon::now()->startOfMonth();
            $dataFim = $request->data_fim 
                ? Carbon::parse($request->data_fim)->endOfDay() 
                : Carbon::now()->endOfDay();

            // Consultas
            $totalConsultas = Consulta::whereBetween('data_consulta', [$dataInicio, $dataFim])->count();
            $consultasPorStatus = Consulta::whereBetween('data_consulta', [$dataInicio, $dataFim])
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            // Pacientes
            $totalPacientes = Paciente::count();
            $pacientesNovos = Paciente::whereBetween('created_at', [$dataInicio, $dataFim])->count();
            $pacientesAtendidos = Consulta::whereBetween('data_consulta', [$dataInicio, $dataFim])
                ->distinct('paciente_id')
                ->count('paciente_id');

            // Médicos
            $totalMedicos = Medico::count();
            $medicosAtivos = Medico::whereHas('consultas', function($q) use ($dataInicio, $dataFim) {
                $q->whereBetween('data_consulta', [$dataInicio, $dataFim]);
            })->count();

            // Exames
            $totalExames = SolicitacaoExameLaboratorio::whereBetween('data_solicitacao', [$dataInicio, $dataFim])->count();
            $examesComResultado = SolicitacaoExameLaboratorio::whereBetween('data_solicitacao', [$dataInicio, $dataFim])
                ->whereNotNull('resultado')
                ->count();

            // Especialidades mais procuradas
            $especialidadesMaisProcuradas = Consulta::whereBetween('data_consulta', [$dataInicio, $dataFim])
                ->whereHas('medico')
                ->with('medico')
                ->get()
                ->groupBy(function($consulta) {
                    return $consulta->medico ? $consulta->medico->especialidade : 'Sem especialidade';
                })
                ->map(function($group) {
                    return $group->count();
                })
                ->sortByDesc(function($count) {
                    return $count;
                })
                ->take(5);

            $dadosComuns = $this->prepararDadosComuns();

            $data = array_merge($dadosComuns, [
                'data_inicio' => $dataInicio->format('d/m/Y'),
                'data_fim' => $dataFim->format('d/m/Y'),
                'consultas' => [
                    'total' => $totalConsultas,
                    'por_status' => $consultasPorStatus,
                ],
                'pacientes' => [
                    'total' => $totalPacientes,
                    'novos' => $pacientesNovos,
                    'atendidos' => $pacientesAtendidos,
                ],
                'medicos' => [
                    'total' => $totalMedicos,
                    'ativos' => $medicosAtivos,
                ],
                'exames' => [
                    'total' => $totalExames,
                    'com_resultado' => $examesComResultado,
                ],
                'especialidades_mais_procuradas' => $especialidadesMaisProcuradas,
            ]);

            $pdf = Pdf::loadView('relatorios.estatistico-geral', $data);
            $nomeArquivo = 'relatorio-estatistico-' . Carbon::now()->format('YmdHis') . '.pdf';

            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar relatório estatístico: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao gerar relatório',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 4. RELATÓRIO DE PRODUTIVIDADE MÉDICA
     */
    public function produtividadeMedica(Request $request)
    {
        try {
            $request->validate([
                'data_inicio' => 'required|date',
                'data_fim' => 'required|date|after_or_equal:data_inicio',
                'medico_id' => 'nullable|exists:medicos,id',
            ]);

            $dataInicio = Carbon::parse($request->data_inicio)->startOfDay();
            $dataFim = Carbon::parse($request->data_fim)->endOfDay();

            $query = Medico::withCount(['consultas' => function($q) use ($dataInicio, $dataFim) {
                $q->whereBetween('data_consulta', [$dataInicio, $dataFim]);
            }]);

            if ($request->medico_id) {
                $query->where('id', $request->medico_id);
            }

            $medicos = $query->orderBy('consultas_count', 'desc')->get();

            // Estatísticas detalhadas por médico
            $medicosDetalhados = $medicos->map(function($medico) use ($dataInicio, $dataFim) {
                $consultas = Consulta::where('medico_id', $medico->id)
                    ->whereBetween('data_consulta', [$dataInicio, $dataFim])
                    ->get();

                return [
                    'medico' => $medico,
                    'total_consultas' => $consultas->count(),
                    'consultas_realizadas' => $consultas->where('status', 'realizada')->count(),
                    'consultas_confirmadas' => $consultas->where('status', 'confirmada')->count(),
                    'consultas_agendadas' => $consultas->where('status', 'agendada')->count(),
                    'consultas_canceladas' => $consultas->where('status', 'cancelada')->count(),
                    'pacientes_unicos' => $consultas->pluck('paciente_id')->unique()->count(),
                ];
            });

            $dadosComuns = $this->prepararDadosComuns();

            $data = array_merge($dadosComuns, [
                'medicos' => $medicosDetalhados,
                'data_inicio' => $dataInicio->format('d/m/Y'),
                'data_fim' => $dataFim->format('d/m/Y'),
                'filtro_medico' => $request->medico_id ? Medico::find($request->medico_id) : null,
                'total_medicos' => $medicos->count(),
            ]);

            $pdf = Pdf::loadView('relatorios.produtividade-medica', $data);
            $nomeArquivo = 'relatorio-produtividade-medica-' . Carbon::now()->format('YmdHis') . '.pdf';

            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar relatório de produtividade: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao gerar relatório',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }
}

