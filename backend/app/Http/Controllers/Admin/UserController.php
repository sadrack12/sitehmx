<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Busca
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->with('medico')->orderBy('name')->get();

        return response()->json(['data' => $users]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,gestor,atendente,medico',
            'medico_id' => 'nullable|exists:medicos,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'medico_id' => $request->medico_id,
        ]);

        return response()->json(['data' => $user->load('medico')], 201);
    }

    public function show($id)
    {
        $user = User::with('medico')->findOrFail($id);
        return response()->json(['data' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,gestor,atendente,medico',
            'medico_id' => 'nullable|exists:medicos,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'medico_id' => $request->medico_id,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json(['data' => $user->load('medico')]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Não permitir deletar o próprio usuário
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Não é possível deletar seu próprio usuário'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso']);
    }
}

