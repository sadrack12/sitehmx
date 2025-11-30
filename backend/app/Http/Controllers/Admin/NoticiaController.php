<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class NoticiaController extends Controller
{
    public function index()
    {
        $noticias = Noticia::ordered()->get();
        return response()->json($noticias);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'image' => 'nullable|image|max:2048',
            'color' => 'nullable|string|max:50',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('noticias', 'public');
        }

        $noticia = Noticia::create($validated);
        return response()->json($noticia, 201);
    }

    public function show($id)
    {
        $noticia = Noticia::findOrFail($id);
        return response()->json($noticia);
    }

    public function update(Request $request, $id)
    {
        $noticia = Noticia::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'image' => 'nullable|image|max:2048',
            'color' => 'nullable|string|max:50',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($noticia->image) {
                Storage::disk('public')->delete($noticia->image);
            }
            $validated['image'] = $request->file('image')->store('noticias', 'public');
        }

        $noticia->update($validated);
        return response()->json($noticia);
    }

    public function destroy($id)
    {
        $noticia = Noticia::findOrFail($id);
        
        if ($noticia->image) {
            Storage::disk('public')->delete($noticia->image);
        }
        
        $noticia->delete();
        return response()->json(null, 204);
    }
}

