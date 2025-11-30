<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExameController extends Controller
{
    public function index()
    {
        $exames = Exame::orderBy('nome')->get();
        return response()->json(['data' => $exames]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string|max:255|unique:exames,codigo',
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'tipo' => 'required|in:laboratorio,imagem,clinico,outro',
            'valor' => 'nullable|numeric|min:0',
            'prazo_resultado' => 'nullable|integer|min:0',
            'preparo' => 'nullable|string',
            'requer_jejum' => 'boolean',
            'ativo' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exame = Exame::create($request->all());

        return response()->json(['data' => $exame], 201);
    }

    public function show($id)
    {
        $exame = Exame::findOrFail($id);
        return response()->json(['data' => $exame]);
    }

    public function update(Request $request, $id)
    {
        $exame = Exame::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'codigo' => 'sometimes|required|string|max:255|unique:exames,codigo,' . $id,
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
            'tipo' => 'sometimes|in:laboratorio,imagem,clinico,outro',
            'valor' => 'nullable|numeric|min:0',
            'prazo_resultado' => 'nullable|integer|min:0',
            'preparo' => 'nullable|string',
            'requer_jejum' => 'boolean',
            'ativo' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exame->update($request->all());

        return response()->json(['data' => $exame]);
    }

    public function destroy($id)
    {
        $exame = Exame::findOrFail($id);
        $exame->delete();

        return response()->json(['message' => 'Exame removido com sucesso']);
    }
}

