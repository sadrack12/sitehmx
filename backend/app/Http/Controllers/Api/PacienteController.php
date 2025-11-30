<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Paciente::withCount('consultas');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('nif', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('cidade')) {
            $query->where('cidade', $request->cidade);
        }

        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        $pacientes = $query->orderBy('nome')->get();
        
        return response()->json(['data' => $pacientes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'nif' => 'required|string|max:14|unique:pacientes,nif',
            'email' => 'nullable|email|max:255',
            'telefone' => 'nullable|string|max:20',
            'data_nascimento' => 'nullable|date',
            'endereco' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:2',
        ]);

        $paciente = Paciente::create($validated);

        return response()->json($paciente, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $paciente = Paciente::with(['consultas' => function($query) {
            $query->with('medico')->orderBy('data_consulta', 'desc');
        }])->findOrFail($id);
        return response()->json($paciente);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $paciente = Paciente::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'nif' => 'sometimes|required|string|max:14|unique:pacientes,nif,' . $id,
            'email' => 'nullable|email|max:255',
            'telefone' => 'nullable|string|max:20',
            'data_nascimento' => 'nullable|date',
            'endereco' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:2',
        ]);

        $paciente->update($validated);

        return response()->json($paciente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $paciente = Paciente::findOrFail($id);
        $paciente->delete();

        return response()->json(['message' => 'Paciente removido com sucesso'], 200);
    }
}
