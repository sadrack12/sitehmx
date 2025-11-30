<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Valor;
use Illuminate\Http\Request;

class ValorController extends Controller
{
    public function index()
    {
        $valores = Valor::ordered()->get();
        return response()->json($valores);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon' => 'required|string|max:10',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        $valor = Valor::create($validated);
        return response()->json($valor, 201);
    }

    public function show($id)
    {
        $valor = Valor::findOrFail($id);
        return response()->json($valor);
    }

    public function update(Request $request, $id)
    {
        $valor = Valor::findOrFail($id);

        $validated = $request->validate([
            'icon' => 'required|string|max:10',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        $valor->update($validated);
        return response()->json($valor);
    }

    public function destroy($id)
    {
        $valor = Valor::findOrFail($id);
        $valor->delete();
        return response()->json(null, 204);
    }
}

