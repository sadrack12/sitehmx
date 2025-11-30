<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroSlideController extends Controller
{
    public function index()
    {
        $slides = HeroSlide::ordered()->get();
        return response()->json($slides);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('hero-slides', 'public');
        }

        $slide = HeroSlide::create($validated);
        return response()->json($slide, 201);
    }

    public function show($id)
    {
        $slide = HeroSlide::findOrFail($id);
        return response()->json($slide);
    }

    public function update(Request $request, $id)
    {
        $slide = HeroSlide::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'published' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($slide->image) {
                Storage::disk('public')->delete($slide->image);
            }
            $validated['image'] = $request->file('image')->store('hero-slides', 'public');
        }

        $slide->update($validated);
        return response()->json($slide);
    }

    public function destroy($id)
    {
        $slide = HeroSlide::findOrFail($id);
        
        if ($slide->image) {
            Storage::disk('public')->delete($slide->image);
        }
        
        $slide->delete();
        return response()->json(null, 204);
    }
}

