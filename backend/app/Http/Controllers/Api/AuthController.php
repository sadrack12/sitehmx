<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Garantir conexão ativa - tentar reconectar se necessário
            $maxConnectionRetries = 3;
            $connectionRetry = 0;
            while ($connectionRetry < $maxConnectionRetries) {
                try {
                    DB::connection()->getPdo();
                    break; // Conexão OK, sair do loop
                } catch (\Exception $e) {
                    $connectionRetry++;
                    if ($connectionRetry >= $maxConnectionRetries) {
                        \Log::error('Não foi possível conectar ao MySQL após ' . $maxConnectionRetries . ' tentativas');
                        throw $e;
                    }
                    \Log::warning('Conexão MySQL perdida, tentando reconectar (tentativa ' . $connectionRetry . '): ' . $e->getMessage());
                    DB::purge('mysql');
                    DB::reconnect('mysql');
                }
            }

            // Buscar usuário
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['As credenciais fornecidas estão incorretas.'],
                ]);
            }

            // Criar token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Erro no login: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            // Tentar uma última vez com reconexão
            try {
                DB::purge('mysql');
                DB::reconnect('mysql');
                $user = User::where('email', $request->email)->first();
                if ($user && Hash::check($request->password, $user->password)) {
                    $token = $user->createToken('auth-token')->plainTextToken;
                    return response()->json([
                        'user' => $user,
                        'token' => $token,
                    ]);
                }
            } catch (\Exception $retryException) {
                \Log::error('Erro no retry do login: ' . $retryException->getMessage());
            }
            
            return response()->json([
                'message' => 'Erro ao realizar login. Tente novamente.',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user) {
                try {
                    $user->currentAccessToken()->delete();
                } catch (\Illuminate\Database\QueryException $e) {
                    if (str_contains($e->getMessage(), 'Connection refused') || str_contains($e->getMessage(), 'Connection')) {
                        DB::purge('mysql');
                        DB::reconnect('mysql');
                        $user->currentAccessToken()->delete();
                    } else {
                        throw $e;
                    }
                }
            }

            return response()->json(['message' => 'Logout realizado com sucesso']);
        } catch (\Exception $e) {
            \Log::error('Erro no logout: ' . $e->getMessage());
            // Mesmo com erro, retornar sucesso para não bloquear o frontend
            return response()->json(['message' => 'Logout realizado com sucesso']);
        }
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('medico');
        
        // Garantir que medico_id está presente mesmo se o relacionamento não carregar
        $response = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'medico_id' => $user->medico_id,
            'medico' => $user->medico,
        ];
        
        return response()->json($response);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Link de recuperação enviado para seu email.',
            ]);
        }

        return response()->json([
            'message' => 'Não foi possível enviar o link de recuperação.',
        ], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Senha redefinida com sucesso.',
            ]);
        }

        return response()->json([
            'message' => 'Token inválido ou expirado.',
        ], 400);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Senha atual incorreta.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Senha alterada com sucesso.',
        ]);
    }
}

