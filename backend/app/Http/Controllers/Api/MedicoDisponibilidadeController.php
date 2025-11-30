<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicoHorario;
use App\Models\Consulta;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MedicoDisponibilidadeController extends Controller
{
    public function disponibilidade(Request $request)
    {
        $request->validate([
            'medico_id' => 'required|exists:medicos,id',
            'mes' => 'nullable|date', // Mês para buscar disponibilidade (formato Y-m)
        ]);

        $medicoId = $request->medico_id;
        $mes = $request->mes ? Carbon::parse($request->mes) : Carbon::now();
        $inicioMes = $mes->copy()->startOfMonth();
        $fimMes = $mes->copy()->endOfMonth();

        // Buscar horários disponíveis do médico
        $horarios = MedicoHorario::where('medico_id', $medicoId)
            ->whereBetween('data', [$inicioMes->format('Y-m-d'), $fimMes->format('Y-m-d')])
            ->where('disponivel', true)
            ->orderBy('data')
            ->get();

        // Buscar consultas já agendadas do médico
        $consultasAgendadas = Consulta::where('medico_id', $medicoId)
            ->whereBetween('data_consulta', [$inicioMes->format('Y-m-d'), $fimMes->format('Y-m-d')])
            ->whereIn('status', ['agendada', 'confirmada'])
            ->get()
            ->groupBy(function($consulta) {
                return Carbon::parse($consulta->data_consulta)->format('Y-m-d');
            })
            ->map(function($group) {
                return $group->count();
            });

        // Agrupar por data
        $disponibilidade = [];
        
        foreach ($horarios as $horario) {
            // Converter data para string no formato Y-m-d
            // O modelo MedicoHorario tem 'data' cast como 'date', então é um Carbon
            $data = Carbon::parse($horario->data)->format('Y-m-d');
            
            $consultaCount = $consultasAgendadas->get($data) ?? 0;
            
            if (!isset($disponibilidade[$data])) {
                $disponibilidade[$data] = [
                    'data' => $data,
                    'disponivel' => true,
                    'consultas_marcadas' => $consultaCount,
                ];
            } else {
                // Se já existe, atualizar contagem de consultas
                $disponibilidade[$data]['consultas_marcadas'] = $consultaCount;
            }
        }

        // Ordenar por data
        ksort($disponibilidade);

        return response()->json([
            'data' => array_values($disponibilidade),
            'mes' => $mes->format('Y-m'),
        ]);
    }
}

