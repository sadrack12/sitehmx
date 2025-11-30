<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\Especialidade;
use App\Models\MedicoHorario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PublicAgendamentoController extends Controller
{
    /**
     * Verificar se paciente já tem consulta da mesma especialidade no mesmo dia (público)
     */
    public function verificarConsultaExistente(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paciente_id' => 'required|exists:pacientes,id',
            'especialidade' => 'required|string|max:255',
            'data_consulta' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $consultaExistente = Consulta::with(['paciente', 'medico', 'sala'])
            ->where('paciente_id', $request->paciente_id)
            ->whereDate('data_consulta', $request->data_consulta)
            ->whereIn('status', ['agendada', 'confirmada'])
            ->whereHas('medico', function($query) use ($request) {
                $query->where('especialidade', $request->especialidade);
            })
            ->first();

        return response()->json([
            'existe' => $consultaExistente !== null,
            'consulta' => $consultaExistente,
        ]);
    }

    /**
     * Buscar paciente por NIF (público)
     */
    public function buscarPaciente(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nif' => 'required|string|max:14',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $paciente = Paciente::where('nif', $request->nif)->first();

        if ($paciente) {
            return response()->json([
                'encontrado' => true,
                'paciente' => $paciente,
            ]);
        }

        return response()->json([
            'encontrado' => false,
            'message' => 'Paciente não encontrado. Por favor, complete seu cadastro.',
        ]);
    }

    /**
     * Criar paciente (público)
     */
    public function criarPaciente(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'nif' => 'required|string|max:14|unique:pacientes,nif',
            'email' => 'required|email|max:255',
            'telefone' => 'required|string|max:20',
            'data_nascimento' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $paciente = Paciente::create([
                'nome' => $request->nome,
                'nif' => $request->nif,
                'email' => $request->email,
                'telefone' => $request->telefone,
                'data_nascimento' => $request->data_nascimento,
            ]);

            return response()->json([
                'message' => 'Paciente cadastrado com sucesso!',
                'paciente' => $paciente,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao cadastrar paciente',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Criar ou buscar paciente e agendar consulta (público)
     */
    public function agendar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paciente_id' => 'nullable|exists:pacientes,id',
            'nome' => 'required|string|max:255',
            'nif' => 'required|string|max:14',
            'email' => 'required|email|max:255',
            'telefone' => 'required|string|max:20',
            'data_nascimento' => 'nullable|date',
            'especialidade' => 'required|string|max:255',
            'data_consulta' => 'required|date|after_or_equal:today',
            'observacoes' => 'nullable|string',
            'consulta_online' => 'nullable',
        ], [
            'nif.required' => 'O NIF é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'Email inválido',
            'especialidade.required' => 'Selecione uma especialidade',
            'data_consulta.required' => 'Selecione uma data',
            'data_consulta.after_or_equal' => 'A data deve ser hoje ou uma data futura',
        ]);

        if ($validator->fails()) {
            \Log::error('Erro de validação no agendamento:', [
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Se paciente_id foi fornecido, usar esse paciente
            if ($request->paciente_id) {
                $paciente = Paciente::findOrFail($request->paciente_id);
                // Atualizar dados do paciente
                $paciente->update([
                    'nome' => $request->nome,
                    'email' => $request->email,
                    'telefone' => $request->telefone,
                    'data_nascimento' => $request->data_nascimento,
                ]);
            } else {
                // Buscar ou criar paciente
                $paciente = Paciente::where('nif', $request->nif)->first();

                if ($paciente) {
                    // Atualizar dados do paciente
                    $paciente->update([
                        'nome' => $request->nome,
                        'email' => $request->email,
                        'telefone' => $request->telefone,
                        'data_nascimento' => $request->data_nascimento,
                    ]);
                } else {
                    // Criar novo paciente
                    $paciente = Paciente::create([
                        'nome' => $request->nome,
                        'nif' => $request->nif,
                        'email' => $request->email,
                        'telefone' => $request->telefone,
                        'data_nascimento' => $request->data_nascimento,
                    ]);
                }
            }

            // Verificar se o paciente já tem uma consulta agendada da mesma especialidade no mesmo dia
            $consultaExistente = Consulta::where('paciente_id', $paciente->id)
                ->whereDate('data_consulta', $request->data_consulta)
                ->whereIn('status', ['agendada', 'confirmada'])
                ->whereHas('medico', function($query) use ($request) {
                    $query->where('especialidade', $request->especialidade);
                })
                ->first();

            if ($consultaExistente) {
                return response()->json([
                    'message' => 'Você já possui uma consulta agendada desta especialidade para esta data',
                    'errors' => [
                        'data_consulta' => [
                            'Você já possui uma consulta agendada da especialidade "' . $request->especialidade . '" para o dia ' . \Carbon\Carbon::parse($request->data_consulta)->format('d/m/Y')
                        ]
                    ],
                ], 422);
            }

            // Buscar médicos disponíveis da especialidade na data selecionada
            $medicosDisponiveis = \App\Models\Medico::where('especialidade', $request->especialidade)
                ->whereHas('horarios', function($query) use ($request) {
                    $query->where('data', $request->data_consulta)
                          ->where('disponivel', true);
                })
                ->get();

            if ($medicosDisponiveis->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhum médico disponível para esta especialidade na data selecionada',
                    'errors' => ['especialidade' => ['Não há médicos disponíveis para esta especialidade na data selecionada']],
                ], 422);
            }

            // Verificar se há vagas disponíveis antes de agendar
            $vagasDisponiveis = $this->verificarVagasDisponiveis($request->especialidade, $request->data_consulta);
            if ($vagasDisponiveis <= 0) {
                return response()->json([
                    'message' => 'Não há vagas disponíveis para esta especialidade na data selecionada',
                    'errors' => [
                        'data_consulta' => ['Todas as vagas para esta especialidade nesta data já foram preenchidas. Por favor, escolha outra data.']
                    ],
                ], 422);
            }

            // Escolher aleatoriamente um médico disponível
            $medicoEscolhido = $medicosDisponiveis->random();

            // Atribuir sala automaticamente baseada na especialidade e data
            $salaAtribuida = $this->atribuirSalaAutomatico($request->especialidade, $request->data_consulta);

            // Criar consulta (sem horário específico, apenas data)
            // Tipo de consulta sempre será "Consulta de Especialidade" para agendamentos online
            $consulta = Consulta::create([
                'paciente_id' => $paciente->id,
                'medico_id' => $medicoEscolhido->id,
                'sala_id' => $salaAtribuida ? $salaAtribuida->id : null,
                'data_consulta' => $request->data_consulta,
                'hora_consulta' => null, // Não trabalhamos com horários específicos
                'tipo_consulta' => ($request->consulta_online === true || $request->consulta_online === 'true' || $request->consulta_online === 1) ? 'Consulta Online' : 'Consulta de Especialidade',
                'observacoes' => $request->observacoes,
                'status' => 'agendada',
                'agendada_online' => true, // Marcar como agendada online
                'consulta_online' => ($request->consulta_online === true || $request->consulta_online === 'true' || $request->consulta_online === 1),
            ]);

            return response()->json([
                'message' => 'Consulta agendada com sucesso!',
                'consulta' => $consulta->load(['paciente', 'medico', 'sala']),
                'medico_atribuido' => [
                    'id' => $medicoEscolhido->id,
                    'nome' => $medicoEscolhido->nome,
                    'crm' => $medicoEscolhido->crm,
                ],
                'sala_atribuida' => $salaAtribuida ? [
                    'id' => $salaAtribuida->id,
                    'numero' => $salaAtribuida->numero,
                    'nome' => $salaAtribuida->nome,
                ] : null,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao agendar consulta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Atribuir sala automaticamente baseada na especialidade e data
     */
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
}

