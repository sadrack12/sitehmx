<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WebRTCSignalingController extends Controller
{
    /**
     * Criar sala de sinalização para uma consulta
     */
    public function criarSala(Request $request, $consultaId)
    {
        $consulta = Consulta::with(['paciente', 'medico'])->findOrFail($consultaId);
        
        if (!$consulta->consulta_online) {
            return response()->json([
                'message' => 'Esta consulta não é uma consulta online',
            ], 422);
        }

        // Criar ID único para a sala
        $salaId = 'webrtc-consulta-' . $consulta->id;
        
        // Armazenar informações da sala (usando cache/Redis ou banco)
        // Por enquanto, retornamos apenas o ID da sala
        // Em produção, você pode usar Redis ou criar uma tabela para gerenciar salas
        
        return response()->json([
            'sala_id' => $salaId,
            'consulta' => $consulta,
            'message' => 'Sala de sinalização criada',
        ]);
    }

    /**
     * Enviar oferta SDP (médico inicia chamada)
     */
    public function sendOffer(Request $request, $roomId)
    {
        $validator = \Validator::make($request->all(), [
            'offer' => 'required|array',
            'consulta_id' => 'sometimes|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Armazenar oferta temporariamente usando Cache (expira em 5 minutos)
        $chave = "webrtc:{$roomId}:offer";
        
        // Garantir que a oferta está no formato correto
        $offer = $request->offer;
        if (!is_array($offer) || !isset($offer['type']) || !isset($offer['sdp'])) {
            Log::error("Oferta com formato inválido recebida", ['offer' => $offer]);
            return response()->json([
                'errors' => ['offer' => 'Formato de oferta inválido. Deve conter type e sdp.'],
            ], 422);
        }
        
        // Validar formato básico do SDP
        if (!is_string($offer['sdp']) || !str_contains($offer['sdp'], 'v=0') || !str_contains($offer['sdp'], 'm=')) {
            Log::error("SDP inválido recebido", ['sdp_preview' => substr($offer['sdp'] ?? '', 0, 200)]);
            return response()->json([
                'errors' => ['offer' => 'SDP inválido. Formato incorreto.'],
            ], 422);
        }
        
        Cache::put($chave, $offer, 300);
        
        Log::info("Oferta WebRTC recebida para sala: {$roomId}", [
            'type' => $offer['type'],
            'sdp_length' => strlen($offer['sdp']),
            'sdp_preview' => substr($offer['sdp'], 0, 100)
        ]);
        
        return response()->json([
            'message' => 'Oferta recebida',
            'room_id' => $roomId,
        ]);
    }

    /**
     * Enviar resposta SDP (paciente responde)
     */
    public function sendAnswer(Request $request, $roomId)
    {
        $validator = \Validator::make($request->all(), [
            'answer' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Armazenar resposta temporariamente usando Cache (expira em 5 minutos)
        $chave = "webrtc:{$roomId}:answer";
        Cache::put($chave, $request->answer, 300);
        
        Log::info("Resposta WebRTC recebida para sala: {$roomId}");
        
        return response()->json([
            'message' => 'Resposta recebida',
            'room_id' => $roomId,
        ]);
    }
    
    /**
     * Obter resposta (para médico)
     */
    public function getAnswer($roomId)
    {
        // Buscar resposta armazenada
        $chave = "webrtc:{$roomId}:answer";
        $answer = Cache::get($chave);
        
        return response()->json([
            'answer' => $answer,
            'message' => $answer ? 'Resposta disponível' : 'Aguardando paciente conectar',
        ]);
    }

    /**
     * Obter oferta (para paciente)
     */
    public function getOffer($roomId)
    {
        // Buscar oferta armazenada
        $chave = "webrtc:{$roomId}:offer";
        $offer = Cache::get($chave);
        
        Log::info("Buscando oferta para sala: {$roomId}", [
            'offer_exists' => !is_null($offer),
            'offer_type' => gettype($offer),
        ]);
        
        // Garantir que a oferta está no formato correto
        if ($offer && is_array($offer)) {
            // Verificar se tem type e sdp
            if (!isset($offer['type']) || !isset($offer['sdp'])) {
                Log::warning("Oferta com formato inválido", ['offer' => $offer]);
                return response()->json([
                    'offer' => null,
                    'message' => 'Oferta com formato inválido',
                ]);
            }
            
            // Validar e limpar SDP
            $sdp = $offer['sdp'];
            if (!is_string($sdp)) {
                Log::error("SDP não é string", ['sdp_type' => gettype($sdp)]);
                return response()->json([
                    'offer' => null,
                    'message' => 'SDP com tipo inválido',
                ]);
            }
            
            // Limpar SDP (remover caracteres de controle inválidos)
            $sdp = trim($sdp);
            $sdp = preg_replace('/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/', '', $sdp);
            
            // Validar formato básico
            if (!str_contains($sdp, 'v=0') || !str_contains($sdp, 'm=')) {
                Log::error("SDP inválido - não contém linhas básicas", [
                    'sdp_preview' => substr($sdp, 0, 200)
                ]);
                return response()->json([
                    'offer' => null,
                    'message' => 'SDP com formato inválido',
                ]);
            }
            
            // Retornar oferta limpa
            $cleanedOffer = [
                'type' => $offer['type'],
                'sdp' => $sdp,
            ];
            
            Log::info("Oferta limpa retornada", [
                'type' => $cleanedOffer['type'],
                'sdp_length' => strlen($cleanedOffer['sdp']),
                'sdp_preview' => substr($cleanedOffer['sdp'], 0, 100)
            ]);
            
            return response()->json([
                'offer' => $cleanedOffer,
                'message' => 'Oferta disponível',
            ]);
        }
        
        return response()->json([
            'offer' => null,
            'message' => 'Aguardando médico iniciar chamada',
        ]);
    }

    /**
     * Enviar ICE candidate
     */
    public function sendCandidate(Request $request, $roomId)
    {
        $validator = \Validator::make($request->all(), [
            'candidate' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Armazenar ICE candidates em uma lista (máximo 50 candidates)
        $chave = "webrtc:{$roomId}:candidates";
        $candidates = Cache::get($chave, []);
        $candidates[] = $request->candidate;
        
        // Manter apenas os últimos 50 candidates
        if (count($candidates) > 50) {
            $candidates = array_slice($candidates, -50);
        }
        
        Cache::put($chave, $candidates, 300);
        
        return response()->json([
            'message' => 'ICE candidate recebido',
        ]);
    }
}

