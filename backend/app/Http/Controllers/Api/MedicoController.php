<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medico;
use Illuminate\Http\Request;

class MedicoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Medico::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('especialidade', 'like', "%{$search}%")
                  ->orWhere('crm', 'like', "%{$search}%");
            });
        }

        if ($request->has('especialidade')) {
            $query->where('especialidade', $request->especialidade);
        }

        $medicos = $query->orderBy('nome')->get();
        
        return response()->json(['data' => $medicos]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
