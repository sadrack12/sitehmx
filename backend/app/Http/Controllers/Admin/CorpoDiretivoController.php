<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CorpoDiretivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CorpoDiretivoController extends Controller
{
    public function index()
    {
        $membros = CorpoDiretivo::with('parent', 'children')->ordered()->get();
        return response()->json($membros);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('corpo-diretivo', 'public');
        }

        $membro = CorpoDiretivo::create($validated);
        return response()->json($membro, 201);
    }

    public function show($id)
    {
        $membro = CorpoDiretivo::findOrFail($id);
        return response()->json($membro);
    }

    public function update(Request $request, $id)
    {
        $membro = CorpoDiretivo::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'published' => 'boolean',
            'order' => 'integer',
            'parent_id' => 'nullable|exists:corpo_diretivo,id',
            'nivel' => 'integer|min:1',
        ]);

        if ($request->hasFile('image')) {
            if ($membro->image) {
                Storage::disk('public')->delete($membro->image);
            }
            $validated['image'] = $request->file('image')->store('corpo-diretivo', 'public');
        }

        $membro->update($validated);
        return response()->json($membro);
    }

    public function destroy($id)
    {
        $membro = CorpoDiretivo::findOrFail($id);
        
        if ($membro->image) {
            Storage::disk('public')->delete($membro->image);
        }
        
        $membro->delete();
        return response()->json(null, 204);
    }
}

