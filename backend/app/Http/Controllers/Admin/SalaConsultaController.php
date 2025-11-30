<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SalaConsulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalaConsultaController extends Controller
{
    public function index(Request $request)
    {
        $query = SalaConsulta::with('especialidades');
        
        // Filtrar por especialidade se fornecida
        if ($request->has('especialidade_id')) {
            $query->whereHas('especialidades', function($q) use ($request) {
                $q->where('especialidades.id', $request->especialidade_id);
            });
        }
        
        // Filtrar por nome da especialidade se fornecido
        if ($request->has('especialidade')) {
            $query->whereHas('especialidades', function($q) use ($request) {
                $q->where('especialidades.nome', $request->especialidade);
            });
        }
        
        $salas = $query->orderBy('numero')->get();
        return response()->json(['data' => $salas]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'numero' => 'required|string|max:255|unique:salas_consultas,numero',
            'nome' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
            'tipo' => 'required|in:consulta,exame,cirurgia,outro',
            'disponivel' => 'boolean',
            'equipamentos' => 'nullable|string',
            'especialidades' => 'nullable|array',
            'especialidades.*' => 'exists:especialidades,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $especialidades = $data['especialidades'] ?? [];
        unset($data['especialidades']);

        $sala = SalaConsulta::create($data);
        
        if (!empty($especialidades)) {
            $sala->especialidades()->sync($especialidades);
        }

        $sala->load('especialidades');

        return response()->json(['data' => $sala], 201);
    }

    public function show($id)
    {
        $sala = SalaConsulta::with('especialidades')->findOrFail($id);
        return response()->json(['data' => $sala]);
    }

    public function update(Request $request, $id)
    {
        $sala = SalaConsulta::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'numero' => 'sometimes|required|string|max:255|unique:salas_consultas,numero,' . $id,
            'nome' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
            'tipo' => 'sometimes|in:consulta,exame,cirurgia,outro',
            'disponivel' => 'boolean',
            'equipamentos' => 'nullable|string',
            'especialidades' => 'nullable|array',
            'especialidades.*' => 'exists:especialidades,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $especialidades = $data['especialidades'] ?? null;
        unset($data['especialidades']);

        $sala->update($data);
        
        if ($especialidades !== null) {
            $sala->especialidades()->sync($especialidades);
        }

        $sala->load('especialidades');

        return response()->json(['data' => $sala]);
    }

    public function destroy($id)
    {
        $sala = SalaConsulta::findOrFail($id);
        $sala->delete();

        return response()->json(['message' => 'Sala removida com sucesso']);
    }
}

