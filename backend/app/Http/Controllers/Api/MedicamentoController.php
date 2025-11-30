<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicamento;
use Illuminate\Http\Request;

class MedicamentoController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicamento::where('ativo', true);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('principio_ativo', 'like', "%{$search}%")
                  ->orWhere('apresentacao', 'like', "%{$search}%");
            });
        }

        $medicamentos = $query->orderBy('nome', 'asc')->limit(50)->get();

        return response()->json(['data' => $medicamentos]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:medicamentos,nome',
            'principio_ativo' => 'nullable|string|max:255',
            'apresentacao' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
        ]);

        $medicamento = Medicamento::create($validated);

        return response()->json($medicamento, 201);
    }
}
