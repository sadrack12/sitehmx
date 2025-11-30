<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Medico;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class MedicoController extends Controller
{
    public function index()
    {
        $medicos = Medico::with('user')->orderBy('nome')->get();
        return response()->json(['data' => $medicos]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'crm' => 'required|string|unique:medicos,crm',
            'especialidade' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefone' => 'nullable|string|max:255',
            'criar_login' => 'boolean',
            'login_email' => 'required_if:criar_login,true|email|unique:users,email',
            'login_password' => 'required_if:criar_login,true|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $medico = Medico::create($request->only(['nome', 'crm', 'especialidade', 'email', 'telefone']));

        // Criar usuário de login se solicitado
        if ($request->criar_login && $request->login_email && $request->login_password) {
            User::create([
                'name' => $medico->nome,
                'email' => $request->login_email,
                'password' => Hash::make($request->login_password),
                'role' => 'medico',
                'medico_id' => $medico->id,
            ]);
        }

        return response()->json(['data' => $medico->load('user')], 201);
    }

    public function show($id)
    {
        $medico = Medico::with('user')->findOrFail($id);
        return response()->json(['data' => $medico]);
    }

    public function update(Request $request, $id)
    {
        $medico = Medico::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'crm' => 'sometimes|required|string|unique:medicos,crm,' . $id,
            'especialidade' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefone' => 'nullable|string|max:255',
            'criar_login' => 'boolean',
            'login_email' => 'required_if:criar_login,true|email|unique:users,email,' . ($medico->user ? $medico->user->id : 'NULL') . ',id',
            'login_password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $medico->update($request->only(['nome', 'crm', 'especialidade', 'email', 'telefone']));

        // Gerenciar usuário de login
        if ($request->criar_login && $request->login_email) {
            $userData = [
                'name' => $medico->nome,
                'email' => $request->login_email,
                'role' => 'medico',
                'medico_id' => $medico->id,
            ];

            if ($request->login_password) {
                $userData['password'] = Hash::make($request->login_password);
            }

            if ($medico->user) {
                // Atualizar usuário existente
                $medico->user->update($userData);
            } else {
                // Criar novo usuário
                if ($request->login_password) {
                    User::create($userData);
                }
            }
        }

        return response()->json(['data' => $medico->load('user')]);
    }

    public function destroy($id)
    {
        $medico = Medico::findOrFail($id);
        $medico->delete();

        return response()->json(['message' => 'Médico removido com sucesso']);
    }
}

