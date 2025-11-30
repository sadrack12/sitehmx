<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Servico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ServicoController extends Controller
{
    public function index(Request $request)
    {
        $query = Servico::query();
        
        if ($request->has('tipo')) {
            $query->tipo($request->tipo);
        }
        
        $servicos = $query->ordered()->get();
        return response()->json($servicos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tipo' => ['required', Rule::in(['especializado', 'apoio'])],
            'icon' => 'nullable|string|max:100',
            'image' => 'nullable|image|max:2048',
            'href' => 'nullable|string|max:255',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('servicos', 'public');
        }

        $servico = Servico::create($validated);
        return response()->json($servico, 201);
    }

    public function show($id)
    {
        $servico = Servico::findOrFail($id);
        return response()->json($servico);
    }

    public function update(Request $request, $id)
    {
        $servico = Servico::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tipo' => ['required', Rule::in(['especializado', 'apoio'])],
            'icon' => 'nullable|string|max:100',
            'image' => 'nullable|image|max:2048',
            'href' => 'nullable|string|max:255',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($servico->image) {
                Storage::disk('public')->delete($servico->image);
            }
            $validated['image'] = $request->file('image')->store('servicos', 'public');
        }

        $servico->update($validated);
        return response()->json($servico);
    }

    public function destroy($id)
    {
        $servico = Servico::findOrFail($id);
        
        if ($servico->image) {
            Storage::disk('public')->delete($servico->image);
        }
        
        $servico->delete();
        return response()->json(null, 204);
    }
}

