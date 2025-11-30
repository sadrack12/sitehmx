<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedicoHorario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class MedicoHorarioController extends Controller
{
    public function index(Request $request)
    {
        $query = MedicoHorario::with('medico');

        if ($request->has('medico_id')) {
            $query->where('medico_id', $request->medico_id);
        }

        if ($request->has('mes')) {
            $mes = Carbon::parse($request->mes)->startOfMonth();
            $query->whereBetween('data', [
                $mes->format('Y-m-d'),
                $mes->copy()->endOfMonth()->format('Y-m-d')
            ]);
        }

        $horarios = $query->orderBy('data')->orderBy('hora_inicio')->get();

        // Formatar datas para garantir formato YYYY-MM-DD
        $horariosFormatados = $horarios->map(function($horario) {
            return [
                'id' => $horario->id,
                'medico_id' => $horario->medico_id,
                'data' => Carbon::parse($horario->data)->format('Y-m-d'),
                'hora_inicio' => $horario->hora_inicio,
                'hora_fim' => $horario->hora_fim,
                'disponivel' => $horario->disponivel,
                'observacoes' => $horario->observacoes,
                'medico' => $horario->medico,
            ];
        });

        return response()->json(['data' => $horariosFormatados]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'medico_id' => 'required|exists:medicos,id',
            'data' => 'required|date',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fim' => 'nullable|date_format:H:i|after:hora_inicio',
            'disponivel' => 'boolean',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $horario = MedicoHorario::updateOrCreate(
            [
                'medico_id' => $request->medico_id,
                'data' => $request->data,
            ],
            $request->only(['hora_inicio', 'hora_fim', 'disponivel', 'observacoes'])
        );

        return response()->json(['data' => $horario->load('medico')], 201);
    }

    public function update(Request $request, $id)
    {
        $horario = MedicoHorario::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fim' => 'nullable|date_format:H:i|after:hora_inicio',
            'disponivel' => 'boolean',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $horario->update($request->only(['hora_inicio', 'hora_fim', 'disponivel', 'observacoes']));

        return response()->json(['data' => $horario->load('medico')]);
    }

    public function destroy($id)
    {
        $horario = MedicoHorario::findOrFail($id);
        $horario->delete();

        return response()->json(['message' => 'Horário removido com sucesso']);
    }

    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'medico_id' => 'required|exists:medicos,id',
            'datas' => 'required|array|min:1',
            'datas.*' => 'date',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fim' => 'nullable|date_format:H:i',
            'disponivel' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'message' => 'Erro de validação'], 422);
        }

        $medicoId = $request->medico_id;
        $datas = $request->datas;
        $horaInicio = $request->hora_inicio;
        $horaFim = $request->hora_fim;
        $disponivel = $request->input('disponivel', true);

        $horarios = [];
        $erros = [];

        foreach ($datas as $data) {
            try {
                $horario = MedicoHorario::updateOrCreate(
                    [
                        'medico_id' => $medicoId,
                        'data' => $data,
                    ],
                    [
                        'hora_inicio' => $horaInicio,
                        'hora_fim' => $horaFim,
                        'disponivel' => $disponivel,
                    ]
                );
                $horarios[] = $horario;
            } catch (\Exception $e) {
                $erros[] = "Erro ao processar data {$data}: " . $e->getMessage();
            }
        }

        if (count($erros) > 0) {
            return response()->json([
                'data' => $horarios,
                'errors' => $erros,
                'message' => 'Alguns horários foram atualizados, mas ocorreram erros'
            ], 207); // 207 Multi-Status
        }

        return response()->json([
            'data' => $horarios,
            'message' => count($horarios) . ' horário(s) atualizado(s) com sucesso'
        ]);
    }
}

