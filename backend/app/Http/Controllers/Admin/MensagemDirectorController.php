<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MensagemDirector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MensagemDirectorController extends Controller
{
    public function index()
    {
        $mensagem = MensagemDirector::where('published', true)->first();
        return response()->json($mensagem ?: null);
    }

    public function store(Request $request)
    {
        // Deletar mensagem anterior se existir
        MensagemDirector::where('published', true)->update(['published' => false]);

        $validated = $request->validate([
            'director_name' => 'required|string|max:255',
            'message' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'published' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('mensagem-director', 'public');
        }

        $mensagem = MensagemDirector::create($validated);
        return response()->json($mensagem, 201);
    }

    public function show($id)
    {
        $mensagem = MensagemDirector::findOrFail($id);
        return response()->json($mensagem);
    }

    public function update(Request $request, $id)
    {
        $mensagem = MensagemDirector::findOrFail($id);

        $validated = $request->validate([
            'director_name' => 'required|string|max:255',
            'message' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'published' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($mensagem->image) {
                Storage::disk('public')->delete($mensagem->image);
            }
            $validated['image'] = $request->file('image')->store('mensagem-director', 'public');
        }

        $mensagem->update($validated);
        return response()->json($mensagem);
    }

    public function destroy($id)
    {
        $mensagem = MensagemDirector::findOrFail($id);
        
        if ($mensagem->image) {
            Storage::disk('public')->delete($mensagem->image);
        }
        
        $mensagem->delete();
        return response()->json(null, 204);
    }
}

