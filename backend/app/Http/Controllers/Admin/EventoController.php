<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventoController extends Controller
{
    public function index()
    {
        $eventos = Evento::ordered()->get();
        return response()->json($eventos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'featured' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('eventos', 'public');
        }

        $evento = Evento::create($validated);
        return response()->json($evento, 201);
    }

    public function show($id)
    {
        $evento = Evento::findOrFail($id);
        return response()->json($evento);
    }

    public function update(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'featured' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($evento->image) {
                Storage::disk('public')->delete($evento->image);
            }
            $validated['image'] = $request->file('image')->store('eventos', 'public');
        }

        $evento->update($validated);
        return response()->json($evento);
    }

    public function destroy($id)
    {
        $evento = Evento::findOrFail($id);
        
        if ($evento->image) {
            Storage::disk('public')->delete($evento->image);
        }
        
        $evento->delete();
        return response()->json(null, 204);
    }
}

