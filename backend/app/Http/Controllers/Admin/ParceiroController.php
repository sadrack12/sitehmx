<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Parceiro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ParceiroController extends Controller
{
    public function index()
    {
        $parceiros = Parceiro::ordered()->get();
        return response()->json($parceiros);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'url' => 'nullable|url|max:255',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('parceiros', 'public');
        }

        $parceiro = Parceiro::create($validated);
        return response()->json($parceiro, 201);
    }

    public function show($id)
    {
        $parceiro = Parceiro::findOrFail($id);
        return response()->json($parceiro);
    }

    public function update(Request $request, $id)
    {
        $parceiro = Parceiro::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'url' => 'nullable|url|max:255',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('logo')) {
            if ($parceiro->logo) {
                Storage::disk('public')->delete($parceiro->logo);
            }
            $validated['logo'] = $request->file('logo')->store('parceiros', 'public');
        }

        $parceiro->update($validated);
        return response()->json($parceiro);
    }

    public function destroy($id)
    {
        $parceiro = Parceiro::findOrFail($id);
        
        if ($parceiro->logo) {
            Storage::disk('public')->delete($parceiro->logo);
        }
        
        $parceiro->delete();
        return response()->json(null, 204);
    }
}

