<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ConsultaOnlineController extends Controller
{
    /**
     * Iniciar consulta online (médico)
     */
    public function iniciarConsulta(Request $request, $consultaId)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico'])->findOrFail($consultaId);

            // Verificar se a consulta pode ser iniciada
            if ($consulta->status !== 'confirmada' && $consulta->status !== 'agendada') {
                return response()->json([
                    'message' => 'Apenas consultas confirmadas ou agendadas podem ser iniciadas',
                ], 422);
            }

            // Gerar sala de videoconferência única
            $salaId = 'consulta-' . $consulta->id . '-' . Str::random(8);
            
            // Gerar link com nome do médico para entrar como moderador
            $nomeMedico = $consulta->medico ? ($consulta->medico->nome ?? 'Médico') : 'Médico';
            $linkVideoconferencia = $this->gerarLinkVideoconferencia($salaId, $nomeMedico);

            // Atualizar consulta
            $consulta->update([
                'consulta_online' => true,
                'sala_videoconferencia' => $salaId,
                'link_videoconferencia' => $linkVideoconferencia,
                'inicio_consulta_online' => now(),
                'status' => 'realizada', // Marcar como em andamento
            ]);

            return response()->json([
                'message' => 'Consulta online iniciada com sucesso',
                'consulta' => $consulta->fresh(['paciente', 'medico']),
                'link_videoconferencia' => $linkVideoconferencia,
                'sala_id' => $salaId,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao iniciar consulta online: ' . $e->getMessage(), [
                'consulta_id' => $consultaId,
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Erro ao iniciar consulta online: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Finalizar consulta online
     */
    public function finalizarConsulta(Request $request, $consultaId)
    {
        $consulta = Consulta::findOrFail($consultaId);

        if (!$consulta->consulta_online) {
            return response()->json([
                'message' => 'Esta consulta não é uma consulta online',
            ], 422);
        }

        $consulta->update([
            'fim_consulta_online' => now(),
            'status' => 'realizada',
        ]);

        return response()->json([
            'message' => 'Consulta online finalizada com sucesso',
            'consulta' => $consulta->fresh(['paciente', 'medico']),
        ]);
    }

    /**
     * Obter link da consulta online (paciente)
     */
    public function obterLinkConsulta($consultaId)
    {
        $consulta = Consulta::with(['paciente', 'medico'])->findOrFail($consultaId);

        if (!$consulta->consulta_online) {
            return response()->json([
                'message' => 'Esta consulta não é uma consulta online',
            ], 422);
        }

        if (!$consulta->link_videoconferencia || !$consulta->sala_videoconferencia) {
            return response()->json([
                'message' => 'A consulta online ainda não foi iniciada pelo médico',
            ], 422);
        }

        // Gerar link para paciente com nome do paciente
        $nomePaciente = $consulta->paciente->nome ?? 'Paciente';
        $linkPaciente = $this->gerarLinkPaciente($consulta->sala_videoconferencia, $nomePaciente);

        return response()->json([
            'consulta' => $consulta,
            'link_videoconferencia' => $linkPaciente,
            'sala_id' => $consulta->sala_videoconferencia,
        ]);
    }
    
    /**
     * Gerar link para paciente entrar na videoconferência
     */
    private function gerarLinkPaciente($salaId, $nomePaciente = 'Paciente')
    {
        $jitsiDomain = env('JITSI_DOMAIN', 'meet.jit.si');
        $nomePacienteEncoded = urlencode($nomePaciente);
        
        // Link simplificado para paciente (URL reduzida)
        return "https://{$jitsiDomain}/{$salaId}?userInfo.displayName={$nomePacienteEncoded}";
    }

    /**
     * Buscar consulta online por NIF do paciente
     */
    public function buscarPorNIF(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nif' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $consultas = Consulta::with(['paciente', 'medico'])
            ->whereHas('paciente', function($query) use ($request) {
                $query->where('nif', $request->nif);
            })
            ->where('consulta_online', true)
            ->whereIn('status', ['agendada', 'confirmada', 'realizada'])
            ->whereDate('data_consulta', '>=', now()->toDateString())
            ->orderBy('data_consulta', 'asc')
            ->get();

        return response()->json([
            'consultas' => $consultas,
        ]);
    }

    /**
     * Gerar link de videoconferência
     * Usando Jitsi Meet (gratuito e open source)
     * O médico entra como moderador automaticamente
     */
    private function gerarLinkVideoconferencia($salaId, $nomeMedico = 'Médico')
    {
        // Usar Jitsi Meet - pode ser hospedado próprio ou usar o público
        $jitsiDomain = env('JITSI_DOMAIN', 'meet.jit.si');
        
        // Codificar nome do médico para URL
        $nomeMedicoEncoded = urlencode($nomeMedico);
        
        // Parâmetros para configurar a sala:
        // - config.prejoinPageEnabled=false: desabilita página de pré-join (entra direto na sala)
        // - config.enableWelcomePage=false: desabilita página de boas-vindas
        // - config.requireDisplayName=false: não exige nome para entrar
        // - config.startWithAudioMuted=false: áudio ativado por padrão
        // - config.startWithVideoMuted=false: vídeo ativado por padrão
        // - userInfo.displayName: nome do médico para aparecer na sala
        // - config.startAudioOnly=false: não iniciar apenas com áudio
        // - jitsi_meet_external_api_v2: permite usar API externa
        // - interfaceConfig.SHOW_JITSI_WATERMARK=false: remove marca d'água (se permitido)
        // - interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false: remove marca d'água para convidados
        
        // Usar link direto do Jitsi Meet
        // IMPORTANTE: No Jitsi Meet público (meet.jit.si), o primeiro usuário sempre precisa
        // clicar em "Start meeting" ou "Log-in" para iniciar a reunião. Isso é uma limitação
        // do serviço público. Para evitar isso completamente, seria necessário hospedar um
        // servidor Jitsi próprio ou usar autenticação JWT.
        
        // Parâmetros otimizados para entrada direta (URL simplificada para evitar problemas de tamanho)
        $nomeMedicoEncoded = urlencode($nomeMedico);
        // Usar apenas parâmetros essenciais para reduzir o tamanho da URL
        return "https://{$jitsiDomain}/{$salaId}?userInfo.displayName={$nomeMedicoEncoded}";
    }
}

