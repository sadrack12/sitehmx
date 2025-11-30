<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DailyController extends Controller
{
    private $apiKey;
    private $apiUrl = 'https://api.daily.co/v1';

    public function __construct()
    {
        $this->apiKey = env('DAILY_API_KEY');
        
        if (!$this->apiKey) {
            Log::warning('DAILY_API_KEY não configurada');
        }
    }

    /**
     * Verificar se Daily.co está configurado
     */
    private function checkConfiguration()
    {
        if (!$this->apiKey) {
            throw new \Exception('Daily.co não está configurado. Configure DAILY_API_KEY no arquivo .env');
        }
    }

    /**
     * Criar ou obter sala Daily.co para uma consulta
     */
    public function createOrGetRoom(Request $request, $consultaId)
    {
        try {
            $this->checkConfiguration();
            
            $consulta = Consulta::with(['paciente', 'medico'])->findOrFail($consultaId);
            
            // Verificar se já existe sala na consulta
            if ($consulta->sala_videoconferencia) {
                $roomName = $consulta->sala_videoconferencia;
                
                // Verificar se a sala ainda existe no Daily.co
                $room = $this->getRoom($roomName);
                
                if ($room) {
                    // Sala existe, verificar se tem configurações corretas para múltiplos participantes
                    $roomProperties = $room['config'] ?? [];
                    $maxParticipants = $roomProperties['max_participants'] ?? 0;
                    $privacy = $room['privacy'] ?? 'private';
                    $ejectAtExp = $roomProperties['eject_at_room_exp'] ?? true;
                    
                    // Se a sala tem configurações que impedem múltiplos participantes, recriar
                    if ($maxParticipants < 2 || $privacy === 'private' || $ejectAtExp === true) {
                        Log::info('Sala existente tem configurações que impedem múltiplos participantes, recriando...', [
                            'room_name' => $roomName,
                            'max_participants' => $maxParticipants,
                            'privacy' => $privacy,
                            'eject_at_room_exp' => $ejectAtExp,
                        ]);
                        // Deletar sala antiga
                        try {
                            $deleteResponse = Http::timeout(30)
                                ->retry(2, 1000)
                                ->withHeaders([
                                    'Authorization' => 'Bearer ' . $this->apiKey,
                                ])->delete($this->apiUrl . '/rooms/' . $roomName);
                            
                            if ($deleteResponse->successful()) {
                                Log::info('Sala antiga deletada com sucesso', ['room_name' => $roomName]);
                            }
                        } catch (\Exception $e) {
                            Log::warning('Erro ao deletar sala antiga:', ['error' => $e->getMessage()]);
                        }
                        $consulta->update(['sala_videoconferencia' => null]);
                    } else {
                        // Sala existe e tem configurações corretas, gerar tokens
                        return $this->generateTokens($roomName, $consulta, $request->user());
                    }
                } else {
                    // Sala não existe mais no Daily.co, limpar referência e criar nova
                    Log::info('Sala não encontrada no Daily.co, criando nova sala', [
                        'room_name' => $roomName,
                        'consulta_id' => $consultaId,
                    ]);
                    $consulta->update(['sala_videoconferencia' => null]);
                }
            }
            
            // Criar nova sala
            $roomName = 'consulta-' . $consultaId . '-' . time();
            
            $response = Http::timeout(30) // Timeout de 30 segundos
                ->retry(2, 1000) // Tentar novamente 2 vezes com delay de 1 segundo
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->post($this->apiUrl . '/rooms', [
                'name' => $roomName,
                'privacy' => 'public', // Public para permitir múltiplos participantes com tokens
                'properties' => [
                    'enable_screenshare' => true,
                    'enable_chat' => true,
                    'enable_knocking' => false, // Não precisa de knocking quando usar tokens
                    'enable_prejoin_ui' => false, // Desabilitar UI de pré-join para permitir join automático
                    'exp' => time() + (60 * 60 * 24), // Expira em 24 horas
                    'max_participants' => 10, // Aumentar limite para garantir que médico e paciente possam entrar
                    'enable_network_ui' => true,
                    'enable_people_ui' => true,
                    'enable_recording' => false, // Desabilitar gravação por padrão
                    'eject_at_room_exp' => false, // NÃO ejetar participantes quando a sala expirar - permite múltiplos participantes
                    'nbf' => time(), // Not before - permitir entrada imediata
                ],
            ]);
            
            if (!$response->successful()) {
                Log::error('Erro ao criar sala Daily.co', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                
                return response()->json([
                    'message' => 'Erro ao criar sala de videoconferência: ' . ($response->json()['error'] ?? $response->body()),
                    'error' => $response->json(),
                ], 500);
            }
            
            $room = $response->json();
            
            // Salvar nome da sala na consulta
            $consulta->update([
                'sala_videoconferencia' => $roomName,
            ]);
            
            return $this->generateTokens($roomName, $consulta, $request->user());
            
        } catch (\Exception $e) {
            Log::error('Erro ao criar sala Daily.co', [
                'consulta_id' => $consultaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Erro ao criar sala de videoconferência: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Gerar tokens de acesso para médico e paciente
     */
    private function generateTokens($roomName, $consulta, $user)
    {
        // Verificar se o usuário é o médico da consulta
        // O usuário pode ser médico se tiver medico_id ou se for admin/gestor acessando como médico
        $isMedico = false;
        if ($user) {
            // Verificar se o usuário tem medico_id e corresponde ao médico da consulta
            if (isset($user->medico_id) && $user->medico_id == $consulta->medico_id) {
                $isMedico = true;
            }
            // Se não tiver medico_id, assumir que é médico se estiver acessando a consulta (admin/gestor)
            // Por padrão, quando um admin/gestor acessa, ele age como médico
            elseif (!isset($user->medico_id)) {
                $isMedico = true; // Admin/gestor acessando como médico
            }
        }
        
        // Token para médico (owner)
        $medicoToken = $this->createToken($roomName, [
            'user_id' => $consulta->medico_id,
            'user_name' => $consulta->medico->nome ?? 'Médico',
            'is_owner' => true,
        ]);
        
        if (!$medicoToken) {
            throw new \Exception('Erro ao gerar token para o médico');
        }
        
        // Token para paciente (participant)
        $pacienteToken = $this->createToken($roomName, [
            'user_id' => $consulta->paciente_id,
            'user_name' => $consulta->paciente->nome ?? 'Paciente',
            'is_owner' => false,
        ]);
        
        if (!$pacienteToken) {
            throw new \Exception('Erro ao gerar token para o paciente');
        }
        
        $dailyDomain = env('DAILY_DOMAIN', 'clamatec.daily.co');
        
        return response()->json([
            'room' => [
                'name' => $roomName,
                'url' => 'https://' . $dailyDomain . '/' . $roomName,
            ],
            'current_user_token' => $isMedico ? $medicoToken : $pacienteToken,
            'tokens' => [
                'medico' => $medicoToken,
                'paciente' => $pacienteToken,
            ],
            'is_medico' => $isMedico,
        ]);
    }

    /**
     * Criar token de acesso Daily.co
     */
    private function createToken($roomName, $properties)
    {
        try {
            // Calcular expiração (2 horas a partir de agora)
            $exp = time() + (60 * 60 * 2);
            
            $response = Http::timeout(30) // Aumentar timeout para 30 segundos
                ->retry(2, 1000) // Tentar novamente 2 vezes com delay de 1 segundo
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->post($this->apiUrl . '/meeting-tokens', [
                    'properties' => [
                        'room_name' => $roomName,
                        'is_owner' => $properties['is_owner'] ?? false,
                        'user_name' => $properties['user_name'] ?? 'Usuário',
                        'user_id' => (string)($properties['user_id'] ?? ''),
                        'exp' => $exp, // Token expira em 2 horas - deve estar dentro de properties
                    ],
                ]);
            
            if (!$response->successful()) {
                Log::error('Erro ao criar token Daily.co', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'room_name' => $roomName,
                ]);
                throw new \Exception('Erro ao criar token: ' . ($response->json()['error'] ?? $response->body()));
            }
            
            $data = $response->json();
            return $data['token'] ?? null;
        } catch (\Exception $e) {
            Log::error('Exceção ao criar token Daily.co', [
                'error' => $e->getMessage(),
                'room_name' => $roomName,
            ]);
            throw $e;
        }
    }

    /**
     * Obter informações de uma sala
     */
    private function getRoom($roomName)
    {
        try {
            $response = Http::timeout(30) // Timeout de 30 segundos
                ->retry(2, 1000) // Tentar novamente 2 vezes com delay de 1 segundo
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                ])->get($this->apiUrl . '/rooms/' . $roomName);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            // Se a sala não existe (404), retornar null
            if ($response->status() === 404) {
                Log::info('Sala não encontrada no Daily.co', ['room_name' => $roomName]);
                return null;
            }
            
            // Para outros erros, logar e retornar null
            Log::warning('Erro ao verificar sala no Daily.co', [
                'room_name' => $roomName,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            
            return null;
        } catch (\Exception $e) {
            Log::error('Exceção ao verificar sala no Daily.co', [
                'room_name' => $roomName,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Deletar sala (quando consulta for cancelada)
     */
    public function deleteRoom(Request $request, $consultaId)
    {
        try {
            $consulta = Consulta::findOrFail($consultaId);
            
            if (!$consulta->sala_videoconferencia) {
                return response()->json(['message' => 'Sala não encontrada'], 404);
            }
            
            $response = Http::timeout(30) // Timeout de 30 segundos
                ->retry(2, 1000) // Tentar novamente 2 vezes com delay de 1 segundo
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                ])->delete($this->apiUrl . '/rooms/' . $consulta->sala_videoconferencia);
            
            if ($response->successful()) {
                $consulta->update(['sala_videoconferencia' => null]);
                
                return response()->json(['message' => 'Sala deletada com sucesso']);
            }
            
            return response()->json([
                'message' => 'Erro ao deletar sala',
                'error' => $response->json(),
            ], 500);
            
        } catch (\Exception $e) {
            Log::error('Erro ao deletar sala Daily.co', [
                'consulta_id' => $consultaId,
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'message' => 'Erro ao deletar sala',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obter token para paciente (rota pública)
     */
    public function getPatientToken(Request $request, $consultaId)
    {
        try {
            $this->checkConfiguration();
            
            $consulta = Consulta::with(['paciente', 'medico'])->findOrFail($consultaId);
            
            // Verificar se o paciente está autenticado ou validar por NIF
            $nif = $request->input('nif');
            
            if ($nif && $consulta->paciente && $consulta->paciente->nif !== $nif) {
                return response()->json([
                    'message' => 'NIF não corresponde à consulta',
                ], 403);
            }
            
            // Verificar se o paciente existe
            if (!$consulta->paciente) {
                return response()->json([
                    'message' => 'Paciente não encontrado para esta consulta',
                ], 404);
            }
            
            // Se a sala não existe, criar automaticamente
            if (!$consulta->sala_videoconferencia) {
                Log::info('Sala não existe, criando automaticamente para paciente', [
                    'consulta_id' => $consultaId,
                ]);
                
                // Criar sala usando o mesmo método do médico
                $roomName = 'consulta-' . $consultaId . '-' . time();
                
                $response = Http::timeout(30)
                    ->retry(2, 1000)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'Content-Type' => 'application/json',
                    ])->post($this->apiUrl . '/rooms', [
                    'name' => $roomName,
                    'privacy' => 'public',
                    'properties' => [
                        'enable_screenshare' => true,
                        'enable_chat' => true,
                        'enable_knocking' => false,
                        'enable_prejoin_ui' => false,
                        'exp' => time() + (60 * 60 * 24),
                        'max_participants' => 10,
                        'enable_network_ui' => true,
                        'enable_people_ui' => true,
                        'enable_recording' => false,
                        'eject_at_room_exp' => false,
                        'nbf' => time(),
                    ],
                ]);
                
                if (!$response->successful()) {
                    Log::error('Erro ao criar sala Daily.co para paciente', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    return response()->json([
                        'message' => 'Erro ao criar sala de videoconferência',
                    ], 500);
                }
                
                // Salvar nome da sala na consulta
                $consulta->update(['sala_videoconferencia' => $roomName]);
                $consulta->refresh();
            }
            
            $token = $this->createToken($consulta->sala_videoconferencia, [
                'user_id' => $consulta->paciente_id,
                'user_name' => $consulta->paciente->nome ?? 'Paciente',
                'is_owner' => false,
            ]);
            
            if (!$token) {
                Log::error('Token retornou null ao criar para paciente', [
                    'consulta_id' => $consultaId,
                    'sala' => $consulta->sala_videoconferencia,
                ]);
                return response()->json([
                    'message' => 'Erro ao gerar token',
                ], 500);
            }
            
            return response()->json([
                'room' => [
                    'name' => $consulta->sala_videoconferencia,
                    'url' => 'https://' . env('DAILY_DOMAIN', 'clamatec.daily.co') . '/' . $consulta->sala_videoconferencia,
                    'user_name' => $consulta->paciente->nome ?? 'Paciente',
                ],
                'token' => $token,
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Consulta não encontrada ao obter token paciente', [
                'consulta_id' => $consultaId,
            ]);
            return response()->json([
                'message' => 'Consulta não encontrada',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao obter token paciente', [
                'consulta_id' => $consultaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Erro ao obter token: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

