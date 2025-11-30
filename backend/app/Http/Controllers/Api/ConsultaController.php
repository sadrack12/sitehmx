<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\Especialidade;
use App\Models\MedicoHorario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ConsultaController extends Controller
{
    public function index(Request $request)
    {
        $query = Consulta::with(['paciente', 'medico', 'sala']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('data')) {
            $query->whereDate('data_consulta', $request->data);
        }

        if ($request->has('medico_id')) {
            $query->where('medico_id', $request->medico_id);
        }

        if ($request->has('paciente_id')) {
            $query->where('paciente_id', $request->paciente_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('tipo_consulta', 'like', "%{$search}%")
                  ->orWhereHas('paciente', function($q) use ($search) {
                      $q->where('nome', 'like', "%{$search}%")
                        ->orWhere('nif', 'like', "%{$search}%");
                  })
                  ->orWhereHas('medico', function($q) use ($search) {
                      $q->where('nome', 'like', "%{$search}%");
                  });
            });
        }

        $consultas = $query->orderBy('data_consulta', 'desc')->orderBy('hora_consulta', 'asc')->get();

        return response()->json(['data' => $consultas]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'nullable|exists:medicos,id',
            'sala_id' => 'nullable|exists:salas_consultas,id',
            'data_consulta' => 'required|date|after_or_equal:today',
            'hora_consulta' => 'nullable|date_format:H:i',
            'tipo_consulta' => 'required|string|max:255',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Se médico não foi fornecido, mas temos especialidade e data, atribuir automaticamente
        $data = $request->all();
        if (empty($data['medico_id']) && $request->has('especialidade') && $request->has('data_consulta')) {
            $medico = $this->atribuirMedicoAutomatico($request->especialidade, $request->data_consulta);
            if ($medico) {
                $data['medico_id'] = $medico->id;
            } else {
                return response()->json([
                    'errors' => ['medico_id' => ['Nenhum médico disponível para esta especialidade na data selecionada']]
                ], 422);
            }
        }

        if (empty($data['medico_id'])) {
            return response()->json([
                'errors' => ['medico_id' => ['É necessário selecionar um médico ou uma especialidade']]
            ], 422);
        }

        // Verificar se paciente já tem consulta da mesma especialidade no mesmo dia
        if ($request->has('especialidade') && $request->has('data_consulta') && $request->has('paciente_id')) {
            $medicoConsulta = \App\Models\Medico::find($data['medico_id']);
            $especialidadeConsulta = $request->especialidade;
            
            $consultaExistente = Consulta::where('paciente_id', $request->paciente_id)
                ->whereDate('data_consulta', $request->data_consulta)
                ->whereIn('status', ['agendada', 'confirmada'])
                ->whereHas('medico', function($query) use ($especialidadeConsulta) {
                    $query->where('especialidade', $especialidadeConsulta);
                })
                ->first();

            if ($consultaExistente) {
                return response()->json([
                    'message' => 'O paciente já possui uma consulta agendada desta especialidade para esta data',
                    'errors' => [
                        'data_consulta' => [
                            'Você já possui uma consulta agendada da especialidade "' . $especialidadeConsulta . '" para o dia ' . \Carbon\Carbon::parse($request->data_consulta)->format('d/m/Y')
                        ]
                    ],
                    'consulta_existente' => $consultaExistente->load(['paciente', 'medico', 'sala']),
                ], 422);
            }
        }

        // Se sala não foi fornecida, mas temos especialidade e data, atribuir automaticamente
        if (empty($data['sala_id']) && $request->has('especialidade') && $request->has('data_consulta')) {
            $sala = $this->atribuirSalaAutomatico($request->especialidade, $request->data_consulta);
            if ($sala) {
                $data['sala_id'] = $sala->id;
            }
            // Se não houver sala disponível, continuar sem sala (não é obrigatório)
        }

        // Verificar limite de vagas se temos especialidade e data
        if ($request->has('especialidade') && $request->has('data_consulta')) {
            $medico = \App\Models\Medico::find($data['medico_id']);
            if ($medico && $medico->especialidade === $request->especialidade) {
                $vagasDisponiveis = $this->verificarVagasDisponiveis($request->especialidade, $request->data_consulta);
                if ($vagasDisponiveis <= 0) {
                    return response()->json([
                        'message' => 'Não há vagas disponíveis para esta especialidade na data selecionada',
                        'errors' => [
                            'data_consulta' => ['Todas as vagas para esta especialidade nesta data já foram preenchidas']
                        ],
                    ], 422);
                }
            }
        }

        $consulta = Consulta::create($data);

        return response()->json($consulta->load(['paciente', 'medico', 'sala']), 201);
    }

    private function atribuirMedicoAutomatico($especialidade, $data)
    {
        // Buscar médicos da especialidade
        $medicos = \App\Models\Medico::where('especialidade', $especialidade)->get();
        
        if ($medicos->isEmpty()) {
            return null;
        }

        // Buscar médicos disponíveis na data
        $medicosDisponiveis = \App\Models\MedicoHorario::whereIn('medico_id', $medicos->pluck('id'))
            ->where('data', $data)
            ->where('disponivel', true)
            ->pluck('medico_id')
            ->unique();

        if ($medicosDisponiveis->isEmpty()) {
            return null;
        }

        // Selecionar um médico aleatoriamente dos disponíveis
        $medicoId = $medicosDisponiveis->random();
        return \App\Models\Medico::find($medicoId);
    }

    /**
     * Verificar vagas disponíveis para uma especialidade em uma data específica
     */
    private function verificarVagasDisponiveis($especialidadeNome, $data)
    {
        // Buscar médicos da especialidade
        $medicos = \App\Models\Medico::where('especialidade', $especialidadeNome)->get();
        
        if ($medicos->isEmpty()) {
            return 0;
        }

        $medicoIds = $medicos->pluck('id')->toArray();

        // Buscar médicos que trabalham nesta data específica
        $medicosQueTrabalhamIds = MedicoHorario::whereIn('medico_id', $medicoIds)
            ->where('data', $data)
            ->where('disponivel', true)
            ->pluck('medico_id')
            ->unique()
            ->toArray();

        $medicosQueTrabalham = count($medicosQueTrabalhamIds);

        if ($medicosQueTrabalham == 0) {
            return 0;
        }

        // Buscar capacidade da especialidade
        $especialidade = Especialidade::where('nome', $especialidadeNome)->first();
        $capacidadePorMedico = $especialidade && $especialidade->capacidade_diaria 
            ? $especialidade->capacidade_diaria 
            : 10;

        // Contar consultas já agendadas APENAS dos médicos que trabalham neste dia
        $consultasMarcadas = Consulta::whereIn('medico_id', $medicosQueTrabalhamIds)
            ->whereDate('data_consulta', $data)
            ->whereIn('status', ['agendada', 'confirmada'])
            ->count();

        // Calcular vagas disponíveis
        $totalVagas = $medicosQueTrabalham * $capacidadePorMedico;
        $vagasDisponiveis = $totalVagas - $consultasMarcadas;

        return max(0, $vagasDisponiveis);
    }

    private function atribuirSalaAutomatico($especialidade, $data)
    {
        // Buscar especialidade pelo nome
        $especialidadeModel = \App\Models\Especialidade::where('nome', $especialidade)->first();
        
        if (!$especialidadeModel) {
            return null;
        }

        // Buscar salas disponíveis para esta especialidade
        $salas = $especialidadeModel->salas()
            ->where('disponivel', true)
            ->get();

        if ($salas->isEmpty()) {
            return null;
        }

        // Contar consultas agendadas por sala na data selecionada
        $consultasPorSala = Consulta::whereDate('data_consulta', $data)
            ->whereIn('sala_id', $salas->pluck('id'))
            ->whereIn('status', ['agendada', 'confirmada'])
            ->selectRaw('sala_id, COUNT(*) as total')
            ->groupBy('sala_id')
            ->pluck('total', 'sala_id')
            ->toArray();

        // Encontrar a sala com menos consultas (mais vagas disponíveis)
        $salaComMenosConsultas = null;
        $menorNumeroConsultas = PHP_INT_MAX;

        foreach ($salas as $sala) {
            $numeroConsultas = $consultasPorSala[$sala->id] ?? 0;
            
            if ($numeroConsultas < $menorNumeroConsultas) {
                $menorNumeroConsultas = $numeroConsultas;
                $salaComMenosConsultas = $sala;
            }
        }

        // Se todas têm o mesmo número de consultas, selecionar aleatoriamente
        if ($salaComMenosConsultas) {
            $salasComMesmoNumero = $salas->filter(function($sala) use ($consultasPorSala, $menorNumeroConsultas) {
                return ($consultasPorSala[$sala->id] ?? 0) === $menorNumeroConsultas;
            });

            if ($salasComMesmoNumero->count() > 1) {
                return $salasComMesmoNumero->random();
            }

            return $salaComMenosConsultas;
        }

        // Se não encontrou nenhuma, retornar a primeira disponível
        return $salas->first();
    }

    public function show($id)
    {
        $consulta = Consulta::with(['paciente', 'medico', 'sala', 'solicitacoesExames.exame', 'solicitacoesExames.medicoSolicitante'])->findOrFail($id);
        return response()->json($consulta);
    }

    public function update(Request $request, $id)
    {
        $consulta = Consulta::findOrFail($id);
        
        // Permitir atualizar apenas prescrição, anamnese e dados médicos se consulta está realizada
        $camposPermitidosParaRealizada = [
            'prescricao', 'queixa_principal', 'historia_doenca_atual', 
            'historia_patologica_pregressa', 'historia_familiar', 'historia_social',
            'exame_fisico', 'pressao_arterial', 'frequencia_cardiaca', 
            'frequencia_respiratoria', 'temperatura', 'peso', 'altura',
            'diagnostico', 'conduta', 'exames_complementares', 'observacoes'
        ];
        
        // Se consulta está realizada, só permitir atualizar campos médicos
        if ($consulta->status === 'realizada') {
            $camposRecebidos = array_keys($request->all());
            $camposNaoPermitidos = array_diff($camposRecebidos, $camposPermitidosParaRealizada);
            
            if (!empty($camposNaoPermitidos)) {
                return response()->json([
                    'message' => 'Não é possível editar dados básicos de uma consulta já realizada. Apenas dados médicos (prescrição, anamnese, etc.) podem ser atualizados.',
                    'errors' => ['status' => ['Consulta já realizada']]
                ], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'paciente_id' => 'sometimes|exists:pacientes,id',
            'medico_id' => 'sometimes|exists:medicos,id',
            'sala_id' => 'nullable|exists:salas_consultas,id',
            'data_consulta' => 'sometimes|date',
            'hora_consulta' => 'sometimes|date_format:H:i',
            'tipo_consulta' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:agendada,confirmada,realizada,cancelada',
            'observacoes' => 'nullable|string',
            'queixa_principal' => 'nullable|string',
            'historia_doenca_atual' => 'nullable|string',
            'historia_patologica_pregressa' => 'nullable|string',
            'historia_familiar' => 'nullable|string',
            'historia_social' => 'nullable|string',
            'exame_fisico' => 'nullable|string',
            'pressao_arterial' => 'nullable|string|max:50',
            'frequencia_cardiaca' => 'nullable|string|max:50',
            'frequencia_respiratoria' => 'nullable|string|max:50',
            'temperatura' => 'nullable|string|max:50',
            'peso' => 'nullable|string|max:50',
            'altura' => 'nullable|string|max:50',
            'diagnostico' => 'nullable|string',
            'conduta' => 'nullable|string',
            'prescricao' => 'nullable|string',
            'exames_complementares' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Se está transferindo o paciente (mudando paciente_id), verificar conflitos
        if ($request->has('paciente_id') && $request->paciente_id != $consulta->paciente_id) {
            $novoPacienteId = $request->paciente_id;
            $dataConsulta = $request->has('data_consulta') ? $request->data_consulta : $consulta->data_consulta;
            $horaConsulta = $request->has('hora_consulta') ? $request->hora_consulta : $consulta->hora_consulta;
            $medicoId = $request->has('medico_id') ? $request->medico_id : $consulta->medico_id;

            // Verificar se o novo paciente já tem consulta no mesmo horário com o mesmo médico
            $consultaConflito = Consulta::where('paciente_id', $novoPacienteId)
                ->where('medico_id', $medicoId)
                ->whereDate('data_consulta', $dataConsulta)
                ->where('hora_consulta', $horaConsulta)
                ->whereIn('status', ['agendada', 'confirmada'])
                ->where('id', '!=', $consulta->id)
                ->first();

            if ($consultaConflito) {
                return response()->json([
                    'message' => 'O paciente selecionado já possui uma consulta agendada neste mesmo horário',
                    'errors' => [
                        'paciente_id' => [
                            'Este paciente já tem uma consulta agendada para ' . 
                            \Carbon\Carbon::parse($dataConsulta)->format('d/m/Y') . 
                            ' às ' . $horaConsulta
                        ]
                    ]
                ], 422);
            }
        }

        $consulta->update($request->all());

        return response()->json($consulta->load(['paciente', 'medico', 'sala']));
    }

    public function destroy($id)
    {
        $consulta = Consulta::findOrFail($id);
        
        // Se tiver sala de videoconferência, deletar também
        if ($consulta->sala_videoconferencia) {
            try {
                // Tentar deletar sala Daily.co se configurado
                $dailyApiKey = env('DAILY_API_KEY');
                if ($dailyApiKey) {
                    $response = \Illuminate\Support\Facades\Http::withHeaders([
                        'Authorization' => 'Bearer ' . $dailyApiKey,
                    ])->delete('https://api.daily.co/v1/rooms/' . $consulta->sala_videoconferencia);
                }
            } catch (\Exception $e) {
                // Ignorar erro ao deletar sala - não é crítico
                \Log::warning('Erro ao deletar sala Daily.co: ' . $e->getMessage());
            }
        }
        
        $consulta->delete();

        return response()->json(['message' => 'Consulta removida com sucesso']);
    }

    /**
     * Deletar múltiplas consultas
     */
    public function destroyMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:consultas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ids = $request->ids;
        $deleted = 0;
        $errors = [];

        foreach ($ids as $id) {
            try {
                $consulta = Consulta::find($id);
                if ($consulta) {
                    // Deletar sala de videoconferência se existir
                    if ($consulta->sala_videoconferencia) {
                        try {
                            $dailyApiKey = env('DAILY_API_KEY');
                            if ($dailyApiKey) {
                                \Illuminate\Support\Facades\Http::withHeaders([
                                    'Authorization' => 'Bearer ' . $dailyApiKey,
                                ])->delete('https://api.daily.co/v1/rooms/' . $consulta->sala_videoconferencia);
                            }
                        } catch (\Exception $e) {
                            // Ignorar erro
                        }
                    }
                    
                    $consulta->delete();
                    $deleted++;
                }
            } catch (\Exception $e) {
                $errors[] = "Erro ao deletar consulta ID {$id}: " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => "{$deleted} consulta(s) removida(s) com sucesso",
            'deleted' => $deleted,
            'total' => count($ids),
            'errors' => $errors,
        ]);
    }

    /**
     * Deletar todas as consultas (cuidado!)
     */
    public function destroyAll(Request $request)
    {
        try {
            // Verificar se é admin
            $user = $request->user();
            if (!$user || !$user->isAdmin()) {
                return response()->json([
                    'message' => 'Apenas administradores podem deletar todas as consultas'
                ], 403);
            }

            // Confirmar ação
            if (!$request->has('confirm') || $request->confirm !== 'true') {
                return response()->json([
                    'message' => 'Confirmação necessária. Envie confirm=true para deletar todas as consultas.',
                    'requires_confirmation' => true,
                ], 400);
            }

            $total = Consulta::count();
            
            if ($total === 0) {
                return response()->json([
                    'message' => 'Não há consultas para deletar',
                    'deleted' => 0,
                ]);
            }
            
            // Deletar salas de videoconferência primeiro
            $consultasComSala = Consulta::whereNotNull('sala_videoconferencia')->get();
            $dailyApiKey = env('DAILY_API_KEY');
            
            foreach ($consultasComSala as $consulta) {
                try {
                    if ($dailyApiKey && $consulta->sala_videoconferencia) {
                        \Illuminate\Support\Facades\Http::withHeaders([
                            'Authorization' => 'Bearer ' . $dailyApiKey,
                        ])->delete('https://api.daily.co/v1/rooms/' . $consulta->sala_videoconferencia);
                    }
                } catch (\Exception $e) {
                    // Ignorar erro - não é crítico
                    \Log::warning('Erro ao deletar sala Daily.co: ' . $e->getMessage());
                }
            }

            // Deletar todas as consultas (usar delete() em vez de truncate() para respeitar foreign keys)
            $deleted = Consulta::query()->delete();

            return response()->json([
                'message' => "Todas as {$deleted} consulta(s) foram removidas com sucesso",
                'deleted' => $deleted,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao deletar todas as consultas: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Erro ao deletar consultas: ' . $e->getMessage(),
            ], 500);
        }
    }
}

