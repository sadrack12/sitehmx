<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicoHorario;
use App\Models\Consulta;
use App\Models\Medico;
use App\Models\Especialidade;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EspecialidadeDisponibilidadeController extends Controller
{
    public function disponibilidade(Request $request)
    {
        $request->validate([
            'especialidade' => 'required|string',
            'mes' => 'nullable|date', // Mês para buscar disponibilidade (formato Y-m)
        ]);

        $especialidadeNome = $request->especialidade;
        $mes = $request->mes ? Carbon::parse($request->mes) : Carbon::now();
        $inicioMes = $mes->copy()->startOfMonth();
        $fimMes = $mes->copy()->endOfMonth();

        // Buscar todos os médicos da especialidade
        $medicos = Medico::where('especialidade', $especialidadeNome)->get();
        
        if ($medicos->isEmpty()) {
            return response()->json([
                'data' => [],
                'mes' => $mes->format('Y-m'),
                'medicos' => [],
            ]);
        }

        $medicoIds = $medicos->pluck('id')->toArray();

        // Buscar horários disponíveis de todos os médicos da especialidade
        $horarios = MedicoHorario::whereIn('medico_id', $medicoIds)
            ->whereBetween('data', [$inicioMes->format('Y-m-d'), $fimMes->format('Y-m-d')])
            ->where('disponivel', true)
            ->orderBy('data')
            ->get();

        // Buscar consultas já agendadas de todos os médicos da especialidade
        $consultasAgendadas = Consulta::whereIn('medico_id', $medicoIds)
            ->whereBetween('data_consulta', [$inicioMes->format('Y-m-d'), $fimMes->format('Y-m-d')])
            ->whereIn('status', ['agendada', 'confirmada'])
            ->get()
            ->groupBy(function($consulta) {
                return Carbon::parse($consulta->data_consulta)->format('Y-m-d');
            })
            ->map(function($group) {
                // Agrupar por médico_id para contar consultas por médico por dia
                return $group->groupBy('medico_id')->map(function($consultasMedico) {
                    return $consultasMedico->count();
                });
            });

        // Agrupar por data e contar médicos disponíveis e vagas
        $disponibilidade = [];
        
        foreach ($horarios as $horario) {
            $data = Carbon::parse($horario->data)->format('Y-m-d');
            
            if (!isset($disponibilidade[$data])) {
                $disponibilidade[$data] = [
                    'data' => $data,
                    'medicos_disponiveis' => [],
                    'total_medicos' => 0,
                ];
            }

            // Adicionar médico à lista de disponíveis neste dia (evitar duplicatas)
            if (!in_array($horario->medico_id, $disponibilidade[$data]['medicos_disponiveis'])) {
                $disponibilidade[$data]['medicos_disponiveis'][] = $horario->medico_id;
                $disponibilidade[$data]['total_medicos'] += 1;
            }
        }
        
        // Contar consultas apenas dos médicos que trabalham em cada dia específico
        foreach ($disponibilidade as $data => &$info) {
            $consultasDoDia = $consultasAgendadas->get($data, collect());
            $totalConsultas = 0;
            
            // Somar consultas apenas dos médicos que trabalham neste dia
            foreach ($info['medicos_disponiveis'] as $medicoId) {
                $totalConsultas += $consultasDoDia->get($medicoId, 0);
            }
            
            $info['consultas_marcadas'] = $totalConsultas;
        }
        
        // Buscar a especialidade para obter a capacidade diária configurada
        $especialidade = Especialidade::where('nome', $especialidadeNome)->first();
        $capacidadePorMedico = $especialidade && $especialidade->capacidade_diaria 
            ? $especialidade->capacidade_diaria 
            : 10; // Valor padrão caso não encontre a especialidade ou não tenha capacidade configurada
        
        // Calcular total de vagas usando apenas os médicos que trabalham naquele dia específico
        foreach ($disponibilidade as $data => &$info) {
            // total_medicos já contém apenas os médicos que trabalham neste dia
            // consultas_marcadas já contém apenas as consultas dos médicos que trabalham neste dia
            $info['total_vagas'] = ($info['total_medicos'] * $capacidadePorMedico) - $info['consultas_marcadas'];
        }

        // Adicionar informações dos médicos disponíveis em cada dia
        foreach ($disponibilidade as $data => &$info) {
            $medicosDisponiveis = Medico::whereIn('id', $info['medicos_disponiveis'])->get();
            $info['medicos'] = $medicosDisponiveis->map(function($medico) {
                return [
                    'id' => $medico->id,
                    'nome' => $medico->nome,
                    'crm' => $medico->crm,
                ];
            })->toArray();
            // Também adicionar como medicos_disponiveis para compatibilidade
            $info['medicos_disponiveis'] = $info['medicos'];
            $info['vagas_disponiveis'] = max(0, $info['total_vagas']);
        }

        // Ordenar por data
        ksort($disponibilidade);

        return response()->json([
            'data' => array_values($disponibilidade),
            'mes' => $mes->format('Y-m'),
            'especialidade' => $especialidadeNome,
            'total_medicos' => $medicos->count(),
        ]);
    }
}

