<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Especialidade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EspecialidadeController extends Controller
{
    public function index()
    {
        $especialidades = Especialidade::orderBy('nome')->get();
        return response()->json(['data' => $especialidades]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255|unique:especialidades,nome',
            'descricao' => 'nullable|string',
            'ativa' => 'boolean',
            'capacidade_diaria' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $especialidade = Especialidade::create($request->all());

        return response()->json(['data' => $especialidade], 201);
    }

    public function show($id)
    {
        $especialidade = Especialidade::findOrFail($id);
        return response()->json(['data' => $especialidade]);
    }

    public function update(Request $request, $id)
    {
        $especialidade = Especialidade::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255|unique:especialidades,nome,' . $id,
            'descricao' => 'nullable|string',
            'ativa' => 'boolean',
            'capacidade_diaria' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $especialidade->update($request->all());

        return response()->json(['data' => $especialidade]);
    }

    public function destroy($id)
    {
        $especialidade = Especialidade::findOrFail($id);
        $especialidade->delete();

        return response()->json(['message' => 'Especialidade removida com sucesso']);
    }
}

