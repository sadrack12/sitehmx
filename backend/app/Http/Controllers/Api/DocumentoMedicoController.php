<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\PdfConfiguracao;
use App\Models\SolicitacaoExameLaboratorio;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DocumentoMedicoController extends Controller
{
    /**
     * Prepara dados comuns para todos os documentos
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
     * 1. PRESCRIÇÃO MÉDICA
     */
    public function gerarPrescricao($id)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);
            
            // Permitir gerar prescrição para qualquer consulta (mesmo sem prescrição registrada)
            // O médico pode querer gerar o documento e preencher manualmente
            
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'consulta' => $consulta,
            ]);
            
            $pdf = Pdf::loadView('documentos.prescricao', $data);
            $nomeArquivo = 'prescricao-medica-' . $consulta->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar prescrição médica',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 2. ATESTADO MÉDICO
     */
    public function gerarAtestado($id, Request $request)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);
            
            // Validar que a consulta está confirmada ou realizada
            if (!in_array($consulta->status, ['confirmada', 'realizada'])) {
                return response()->json([
                    'message' => 'Apenas consultas confirmadas ou realizadas podem gerar atestado médico',
                    'error' => 'Consulta não confirmada'
                ], 422);
            }
            
            // Validar dados do atestado
            $validated = $request->validate([
                'tipo_atestado' => 'required|in:saude,doenca,comparecimento',
                'dias_afastamento' => 'nullable|string',
                'cid' => 'nullable|string|max:20',
                'observacoes' => 'nullable|string|max:500',
            ]);
            
            // Converter dias_afastamento para inteiro se fornecido e válido
            $diasAfastamento = null;
            if (!empty($validated['dias_afastamento']) && is_numeric($validated['dias_afastamento'])) {
                $diasAfastamento = (int) $validated['dias_afastamento'];
                if ($diasAfastamento < 0 || $diasAfastamento > 365) {
                    return response()->json([
                        'message' => 'Dias de afastamento deve ser entre 0 e 365',
                        'error' => 'Dias de afastamento inválido'
                    ], 422);
                }
            }
            
            // Validação adicional: dias de afastamento obrigatório para atestado de doença
            if ($validated['tipo_atestado'] === 'doenca' && ($diasAfastamento === null || $diasAfastamento <= 0)) {
                return response()->json([
                    'message' => 'Dias de afastamento são obrigatórios para atestado de doença',
                    'error' => 'Dias de afastamento obrigatório'
                ], 422);
            }
            
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'consulta' => $consulta,
                'tipo_atestado' => $validated['tipo_atestado'],
                'dias_afastamento' => $diasAfastamento,
                'cid' => !empty($validated['cid']) ? trim($validated['cid']) : null,
                'observacoes' => !empty($validated['observacoes']) ? trim($validated['observacoes']) : null,
            ]);
            
            $pdf = Pdf::loadView('documentos.atestado', $data);
            $nomeArquivo = 'atestado-medico-' . $consulta->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar atestado médico: ' . $e->getMessage(), [
                'consulta_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erro ao gerar atestado médico',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 3. RELATÓRIO DE CONSULTA
     */
    public function gerarRelatorioConsulta($id)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);
            
            // Validar que a consulta foi realizada
            if ($consulta->status !== 'realizada') {
                return response()->json([
                    'message' => 'Apenas consultas realizadas podem gerar relatório',
                    'error' => 'Consulta não realizada'
                ], 422);
            }
            
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'consulta' => $consulta,
            ]);
            
            $pdf = Pdf::loadView('documentos.relatorio-consulta', $data);
            $nomeArquivo = 'relatorio-consulta-' . $consulta->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar relatório de consulta',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 4. REQUISIÇÃO DE EXAME
     */
    public function gerarRequisicaoExame($id)
    {
        try {
            $solicitacao = SolicitacaoExameLaboratorio::with(['paciente', 'medicoSolicitante', 'exame', 'consulta'])->findOrFail($id);
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'solicitacao' => $solicitacao,
            ]);
            
            $pdf = Pdf::loadView('documentos.requisicao-exame', $data);
            $nomeArquivo = 'requisicao-exame-' . $solicitacao->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar requisição de exame',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Gerar requisição de exames de uma consulta
     */
    public function gerarRequisicaoExamePorConsulta($consultaId)
    {
        try {
            $consulta = Consulta::findOrFail($consultaId);
            
            $solicitacoes = SolicitacaoExameLaboratorio::with(['paciente', 'medicoSolicitante', 'exame', 'consulta'])
                ->where('consulta_id', $consultaId)
                ->get();
            
            if ($solicitacoes->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhuma solicitação de exame encontrada para esta consulta',
                    'error' => 'Solicitações não encontradas'
                ], 404);
            }
            
            $primeiraSolicitacao = $solicitacoes->first();
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'solicitacoes' => $solicitacoes,
                'primeiraSolicitacao' => $primeiraSolicitacao,
            ]);
            
            $pdf = Pdf::loadView('documentos.requisicao-exame-massa', $data);
            $nomeArquivo = 'requisicao-exames-consulta-' . $consultaId . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar requisição de exames por consulta: ' . $e->getMessage(), [
                'consulta_id' => $consultaId,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erro ao gerar requisição de exames',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Gerar requisição em massa (múltiplos exames)
     */
    public function gerarRequisicaoExameMassa(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            
            if (empty($ids) || !is_array($ids)) {
                return response()->json([
                    'message' => 'IDs dos exames são obrigatórios',
                    'error' => 'IDs inválidos'
                ], 422);
            }
            
            $solicitacoes = SolicitacaoExameLaboratorio::with(['paciente', 'medicoSolicitante', 'exame', 'consulta'])
                ->whereIn('id', $ids)
                ->get();
            
            if ($solicitacoes->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhuma solicitação encontrada',
                    'error' => 'Solicitações não encontradas'
                ], 404);
            }
            
            // Verificar se todas as solicitações são do mesmo paciente e médico
            $primeiraSolicitacao = $solicitacoes->first();
            $pacienteId = $primeiraSolicitacao->paciente_id;
            $medicoId = $primeiraSolicitacao->medico_solicitante_id;
            
            foreach ($solicitacoes as $solicitacao) {
                if ($solicitacao->paciente_id !== $pacienteId || $solicitacao->medico_solicitante_id !== $medicoId) {
                    return response()->json([
                        'message' => 'Todas as solicitações devem ser do mesmo paciente e médico',
                        'error' => 'Solicitações incompatíveis'
                    ], 422);
                }
            }
            
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'solicitacoes' => $solicitacoes,
                'primeiraSolicitacao' => $primeiraSolicitacao,
            ]);
            
            $pdf = Pdf::loadView('documentos.requisicao-exame-massa', $data);
            $nomeArquivo = 'requisicao-exames-massa-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar requisição de exames em massa',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 5. RESULTADO DE EXAME
     */
    public function gerarResultadoExame($id)
    {
        try {
            $solicitacao = SolicitacaoExameLaboratorio::with(['paciente', 'medicoSolicitante', 'exame', 'consulta'])->findOrFail($id);
            
            // Validar que o exame foi concluído
            if ($solicitacao->status !== 'concluido') {
                return response()->json([
                    'message' => 'Apenas exames concluídos podem gerar resultado',
                    'error' => 'Exame não concluído'
                ], 422);
            }
            
            // Validar que existe resultado
            if (empty($solicitacao->resultado)) {
                return response()->json([
                    'message' => 'Este exame não possui resultado registrado',
                    'error' => 'Resultado não encontrado'
                ], 422);
            }
            
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'solicitacao' => $solicitacao,
            ]);
            
            $pdf = Pdf::loadView('documentos.resultado-exame', $data);
            $nomeArquivo = 'resultado-exame-' . $solicitacao->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar resultado de exame',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * 6. COMPROVANTE DE ATENDIMENTO
     */
    public function gerarComprovanteAtendimento($id)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'consulta' => $consulta,
            ]);
            
            $pdf = Pdf::loadView('documentos.comprovante-atendimento', $data);
            $nomeArquivo = 'comprovante-atendimento-' . $consulta->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar comprovante de atendimento',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Gerar prescrição médica pública (validação por NIF)
     */
    public function gerarPrescricaoPublica(Request $request, $id)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nif' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);

            // Validar que o NIF corresponde ao paciente da consulta
            if ($consulta->paciente->nif !== $request->nif) {
                return response()->json([
                    'message' => 'NIF não corresponde a esta consulta',
                ], 403);
            }

            // Verificar se existe prescrição
            if (empty($consulta->prescricao)) {
                return response()->json([
                    'message' => 'Esta consulta não possui prescrição médica',
                ], 404);
            }

            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'consulta' => $consulta,
            ]);
            
            $pdf = Pdf::loadView('documentos.prescricao', $data);
            $nomeArquivo = 'prescricao-medica-' . $consulta->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar prescrição pública: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao gerar prescrição médica',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Gerar requisição de exames pública (validação por NIF)
     */
    public function gerarRequisicaoExamePorConsultaPublica(Request $request, $consultaId)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nif' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $consulta = Consulta::with(['paciente'])->findOrFail($consultaId);

            // Validar que o NIF corresponde ao paciente da consulta
            if ($consulta->paciente->nif !== $request->nif) {
                return response()->json([
                    'message' => 'NIF não corresponde a esta consulta',
                ], 403);
            }

            $solicitacoes = SolicitacaoExameLaboratorio::with(['paciente', 'medicoSolicitante', 'exame', 'consulta'])
                ->where('consulta_id', $consultaId)
                ->get();
            
            if ($solicitacoes->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhuma solicitação de exame encontrada para esta consulta',
                    'error' => 'Solicitações não encontradas'
                ], 404);
            }
            
            $primeiraSolicitacao = $solicitacoes->first();
            $dadosComuns = $this->prepararDadosComuns();
            
            $data = array_merge($dadosComuns, [
                'solicitacoes' => $solicitacoes,
                'primeiraSolicitacao' => $primeiraSolicitacao,
            ]);
            
            $pdf = Pdf::loadView('documentos.requisicao-exame-massa', $data);
            $nomeArquivo = 'requisicao-exames-consulta-' . $consultaId . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->stream($nomeArquivo);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar requisição de exames pública: ' . $e->getMessage(), [
                'consulta_id' => $consultaId,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erro ao gerar requisição de exames',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }
}

