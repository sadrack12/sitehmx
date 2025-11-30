<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use App\Models\Evento;
use App\Models\HeroSlide;
use App\Models\CorpoDiretivo;
use App\Models\MensagemDirector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicController extends Controller
{
    // Notícias públicas
    public function noticias()
    {
        $noticias = Noticia::published()
            ->ordered()
            ->get();
        
        return response()->json($noticias);
    }

    // Eventos públicos
    public function eventos()
    {
        $eventos = Evento::published()
            ->ordered()
            ->get();
        
        return response()->json($eventos);
    }

    // Hero Slides públicos
    public function heroSlides()
    {
        $slides = HeroSlide::published()
            ->ordered()
            ->get();
        
        return response()->json($slides);
    }

    // Corpo Diretivo público
    public function corpoDiretivo()
    {
        $membros = CorpoDiretivo::published()
            ->with('children')
            ->ordered()
            ->get();
        
        return response()->json($membros);
    }

    // Mensagem do Director público
    public function mensagemDirector()
    {
        $mensagem = MensagemDirector::published()->first();
        
        return response()->json($mensagem);
    }

    // Especialidades públicas (apenas ativas)
    public function especialidades()
    {
        try {
            // Buscar especialidades ativas
            $especialidades = \App\Models\Especialidade::where('ativa', 1)
                ->orderBy('nome')
                ->get();
            
            return response()->json(['data' => $especialidades]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar especialidades: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Retornar array vazio em caso de erro para não quebrar o frontend
            return response()->json(['data' => []], 200);
        }
    }

    /**
     * Verificar documentos disponíveis para uma consulta (validação por NIF)
     */
    public function verificarDocumentos(Request $request, $consultaId)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nif' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $consulta = \App\Models\Consulta::with(['paciente', 'medico', 'solicitacoesExames.exame'])
                ->findOrFail($consultaId);

            // Validar que o NIF corresponde ao paciente da consulta
            if ($consulta->paciente->nif !== $request->nif) {
                return response()->json([
                    'message' => 'NIF não corresponde a esta consulta',
                ], 403);
            }

            // Verificar quais documentos estão disponíveis
            $documentos = [];

            // Prescrição (se existir)
            if (!empty($consulta->prescricao)) {
                $documentos[] = [
                    'tipo' => 'prescricao',
                    'nome' => 'Prescrição Médica',
                    'disponivel' => true,
                    'url' => "/api/consultas/{$consultaId}/prescricao?nif=" . urlencode($request->nif),
                ];
            }

            // Requisição de Exames (se existir)
            if ($consulta->solicitacoesExames && $consulta->solicitacoesExames->count() > 0) {
                $documentos[] = [
                    'tipo' => 'requisicao-exames',
                    'nome' => 'Requisição de Exames',
                    'disponivel' => true,
                    'url' => "/api/consultas/{$consultaId}/requisicao-exames?nif=" . urlencode($request->nif),
                    'quantidade' => $consulta->solicitacoesExames->count(),
                ];
            }

            // Recibo (sempre disponível se consulta foi realizada)
            if ($consulta->status === 'realizada') {
                $documentos[] = [
                    'tipo' => 'recibo',
                    'nome' => 'Recibo de Consulta',
                    'disponivel' => true,
                    'url' => "/api/consultas/{$consultaId}/recibo?nif=" . urlencode($request->nif),
                ];
            }

            return response()->json([
                'validado' => true,
                'documentos' => $documentos,
                'consulta' => [
                    'id' => $consulta->id,
                    'data_consulta' => $consulta->data_consulta,
                    'status' => $consulta->status,
                    'consulta_online' => $consulta->consulta_online,
                    'link_videoconferencia' => $consulta->link_videoconferencia,
                    'sala_videoconferencia' => $consulta->sala_videoconferencia,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao verificar documentos: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao verificar documentos',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor',
            ], 500);
        }
    }
}

