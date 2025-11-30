<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SolicitacaoExameLaboratorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LaboratorioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = SolicitacaoExameLaboratorio::query();

            // Filtros
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            if ($request->has('paciente_id') && $request->paciente_id !== '') {
                $query->where('paciente_id', $request->paciente_id);
            }

            if ($request->has('medico_id') && $request->medico_id !== '') {
                $query->where('medico_solicitante_id', $request->medico_id);
            }

            if ($request->has('exame_id') && $request->exame_id !== '') {
                $query->where('exame_id', $request->exame_id);
            }

            if ($request->has('urgente') && $request->urgente !== '') {
                $query->where('urgente', $request->urgente === 'true');
            }

            if ($request->has('data_inicio') && $request->data_inicio !== '') {
                $query->whereDate('data_solicitacao', '>=', $request->data_inicio);
            }

            if ($request->has('data_fim') && $request->data_fim !== '') {
                $query->whereDate('data_solicitacao', '<=', $request->data_fim);
            }

            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->whereHas('paciente', function($q) use ($search) {
                        $q->where('nome', 'like', "%{$search}%")
                          ->orWhere('nif', 'like', "%{$search}%");
                    })
                    ->orWhereHas('exame', function($q) use ($search) {
                        $q->where('nome', 'like', "%{$search}%")
                          ->orWhere('codigo', 'like', "%{$search}%");
                    })
                    ->orWhereHas('medicoSolicitante', function($q) use ($search) {
                        $q->where('nome', 'like', "%{$search}%");
                    })
                    ->orWhere('observacoes', 'like', "%{$search}%");
                });
            }

            $solicitacoes = $query->with(['paciente', 'exame', 'medicoSolicitante', 'consulta'])
                                  ->orderBy('urgente', 'desc')
                                  ->orderBy('data_solicitacao', 'desc')
                                  ->orderBy('created_at', 'desc')
                                  ->get();

            // Converter para array para evitar problemas de serialização
            $data = $solicitacoes->toArray();

            return response()->json(['data' => $data]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar solicitações de laboratório: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Erro ao carregar solicitações',
                'error' => config('app.debug') ? $e->getMessage() . ' em ' . $e->getFile() . ':' . $e->getLine() : 'Erro interno do servidor'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // Verificar se é criação em massa (múltiplos exames)
        if ($request->has('exames') && is_array($request->exames) && count($request->exames) > 1) {
            return $this->storeBulk($request);
        }

        $validator = Validator::make($request->all(), [
            'consulta_id' => 'nullable|exists:consultas,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'exame_id' => 'required|exists:exames,id',
            'medico_solicitante_id' => 'required|exists:medicos,id',
            'data_solicitacao' => 'required|date',
            'data_prevista_realizacao' => 'nullable|date',
            'observacoes' => 'nullable|string',
            'urgente' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        // Remover data_prevista_realizacao se for null
        if (isset($data['data_prevista_realizacao']) && $data['data_prevista_realizacao'] === null) {
            unset($data['data_prevista_realizacao']);
        }
        
        // Garantir que consulta_id seja salvo se fornecido
        if (isset($data['consulta_id']) && !empty($data['consulta_id'])) {
            \Log::info('Criando solicitação de exame com consulta_id: ' . $data['consulta_id']);
        } else {
            \Log::warning('Solicitação de exame criada SEM consulta_id');
        }
        
        $solicitacao = SolicitacaoExameLaboratorio::create($data);

        return response()->json([
            'message' => 'Solicitação de exame criada com sucesso!',
            'data' => $solicitacao->load(['paciente', 'exame', 'medicoSolicitante', 'consulta'])
        ], 201);
    }

    /**
     * Criar múltiplas solicitações em massa com o mesmo bulk_group_id
     */
    private function storeBulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'consulta_id' => 'nullable|exists:consultas,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_solicitante_id' => 'required|exists:medicos,id',
            'data_solicitacao' => 'required|date',
            'data_prevista_realizacao' => 'nullable|date',
            'observacoes' => 'nullable|string',
            'urgente' => 'boolean',
            'exames' => 'required|array|min:2',
            'exames.*' => 'required|exists:exames,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Gerar ID único para o grupo bulk
        $bulkGroupId = 'BULK-' . time() . '-' . uniqid();

        $solicitacoes = [];
        $examesIds = $request->exames;

        // Garantir que consulta_id seja salvo se fornecido
        if (isset($request->consulta_id) && !empty($request->consulta_id)) {
            \Log::info('Criando solicitações de exames em massa com consulta_id: ' . $request->consulta_id);
        } else {
            \Log::warning('Solicitações de exames em massa criadas SEM consulta_id');
        }

        foreach ($examesIds as $exameId) {
            $data = [
                'bulk_group_id' => $bulkGroupId,
                'consulta_id' => $request->consulta_id,
                'paciente_id' => $request->paciente_id,
                'exame_id' => $exameId,
                'medico_solicitante_id' => $request->medico_solicitante_id,
                'data_solicitacao' => $request->data_solicitacao,
                'data_prevista_realizacao' => $request->data_prevista_realizacao,
                'observacoes' => $request->observacoes,
                'urgente' => $request->urgente ?? false,
                'status' => 'solicitado',
            ];

            $solicitacoes[] = SolicitacaoExameLaboratorio::create($data);
        }

        return response()->json([
            'message' => count($solicitacoes) . ' solicitação(ões) criada(s) em massa com sucesso!',
            'data' => SolicitacaoExameLaboratorio::where('bulk_group_id', $bulkGroupId)
                ->with(['paciente', 'exame', 'medicoSolicitante', 'consulta'])
                ->get(),
            'bulk_group_id' => $bulkGroupId,
        ], 201);
    }

    public function show($id)
    {
        $solicitacao = SolicitacaoExameLaboratorio::with(['paciente', 'exame', 'medicoSolicitante', 'consulta'])
                                                   ->findOrFail($id);
        return response()->json(['data' => $solicitacao]);
    }

    public function update(Request $request, $id)
    {
        try {
            $solicitacao = SolicitacaoExameLaboratorio::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'data_prevista_realizacao' => 'nullable|date',
                'data_realizacao' => 'nullable|date',
                'data_resultado' => 'nullable|date',
                'status' => 'required|in:solicitado,agendado,em_andamento,concluido,cancelado',
                'observacoes' => 'nullable|string',
                'resultado' => 'nullable|string',
                'arquivo_resultado' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
                'urgente' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Preparar dados para atualização - apenas campos permitidos
            $data = [];
            
            if ($request->has('data_prevista_realizacao')) {
                $data['data_prevista_realizacao'] = $request->data_prevista_realizacao;
            }
            if ($request->has('data_realizacao')) {
                $data['data_realizacao'] = $request->data_realizacao;
            }
            if ($request->has('data_resultado')) {
                $data['data_resultado'] = $request->data_resultado;
            }
            if ($request->has('status')) {
                $data['status'] = $request->status;
            }
            if ($request->has('observacoes')) {
                $data['observacoes'] = $request->observacoes;
            }
            if ($request->has('resultado')) {
                $data['resultado'] = $request->resultado;
            }
            if ($request->has('urgente')) {
                $data['urgente'] = $request->boolean('urgente');
            }
            
            // Remover valores vazios
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });

            // Upload de arquivo de resultado
            if ($request->hasFile('arquivo_resultado')) {
                // Remove arquivo antigo se existir
                if ($solicitacao->arquivo_resultado) {
                    Storage::disk('public')->delete($solicitacao->arquivo_resultado);
                }

                $arquivo = $request->file('arquivo_resultado');
                $path = $arquivo->store('laboratorio/resultados', 'public');
                $data['arquivo_resultado'] = $path;
            }

            $solicitacao->update($data);

            return response()->json([
                'message' => 'Solicitação atualizada com sucesso!',
                'data' => $solicitacao->load(['paciente', 'exame', 'medicoSolicitante', 'consulta'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar solicitação: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Erro ao atualizar solicitação',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $solicitacao = SolicitacaoExameLaboratorio::findOrFail($id);

        // Remove arquivo se existir
        if ($solicitacao->arquivo_resultado) {
            Storage::disk('public')->delete($solicitacao->arquivo_resultado);
        }

        $solicitacao->delete();

        return response()->json(['message' => 'Solicitação excluída com sucesso!'], 200);
    }

    public function downloadArquivo($id)
    {
        $solicitacao = SolicitacaoExameLaboratorio::findOrFail($id);

        if (!$solicitacao->arquivo_resultado) {
            return response()->json(['message' => 'Arquivo não encontrado'], 404);
        }

        $path = storage_path('app/public/' . $solicitacao->arquivo_resultado);

        if (!file_exists($path)) {
            return response()->json(['message' => 'Arquivo não encontrado no servidor'], 404);
        }

        return response()->download($path);
    }
}

