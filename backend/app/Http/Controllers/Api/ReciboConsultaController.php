<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\PdfConfiguracao;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReciboConsultaController extends Controller
{
    /**
     * Gera o PDF do recibo de marcação de consulta
     */
    public function gerarRecibo($id)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);
            
            // Buscar configuração do PDF para o cabeçalho
            $configuracao = PdfConfiguracao::first();
            
            // Preparar logo para o PDF
            $logoBase64 = null;
            if ($configuracao && $configuracao->logo_path && $configuracao->mostrar_logo) {
                try {
                    $logoPath = storage_path('app/public/' . $configuracao->logo_path);
                    if (file_exists($logoPath)) {
                        $logoContent = file_get_contents($logoPath);
                        $logoBase64 = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . base64_encode($logoContent);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Erro ao carregar logo para PDF: ' . $e->getMessage());
                }
            }
            
            // Preparar dados para a view
            $data = [
                'consulta' => $consulta,
                'configuracao' => $configuracao,
                'logo_base64' => $logoBase64,
                'data_emissao' => Carbon::now()->format('d/m/Y H:i:s'),
            ];
            
            // Gerar PDF
            $pdf = Pdf::loadView('recibos.consulta', $data);
            
            // Nome do arquivo
            $nomeArquivo = 'recibo-consulta-' . $consulta->id . '-' . Carbon::now()->format('YmdHis') . '.pdf';
            
            return $pdf->download($nomeArquivo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar recibo',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }
    
    /**
     * Visualiza o recibo no navegador
     */
    public function visualizarRecibo($id)
    {
        try {
            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);
            
            // Buscar configuração do PDF para o cabeçalho
            $configuracao = PdfConfiguracao::first();
            
            // Preparar logo para o PDF
            $logoBase64 = null;
            if ($configuracao && $configuracao->logo_path && $configuracao->mostrar_logo) {
                try {
                    $logoPath = storage_path('app/public/' . $configuracao->logo_path);
                    if (file_exists($logoPath)) {
                        $logoContent = file_get_contents($logoPath);
                        $logoBase64 = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . base64_encode($logoContent);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Erro ao carregar logo para PDF: ' . $e->getMessage());
                }
            }
            
            // Preparar dados para a view
            $data = [
                'consulta' => $consulta,
                'configuracao' => $configuracao,
                'logo_base64' => $logoBase64,
                'data_emissao' => Carbon::now()->format('d/m/Y H:i:s'),
            ];
            
            // Gerar PDF
            $pdf = Pdf::loadView('recibos.consulta', $data);
            
            return $pdf->stream('recibo-consulta-' . $consulta->id . '.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao gerar recibo',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Gerar recibo público (validação por NIF)
     */
    public function gerarReciboPublico(Request $request, $id)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nif' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $consulta = Consulta::with(['paciente', 'medico', 'sala'])->findOrFail($id);

            // Validar que o NIF corresponde ao paciente da consulta
            if ($consulta->paciente->nif !== $request->nif) {
                return response()->json([
                    'message' => 'NIF não corresponde a esta consulta',
                ], 403);
            }

            // Verificar se a consulta foi realizada
            if ($consulta->status !== 'realizada') {
                return response()->json([
                    'message' => 'Recibo disponível apenas para consultas realizadas',
                ], 404);
            }

            // Buscar configuração do PDF para o cabeçalho
            $configuracao = PdfConfiguracao::first();
            
            // Preparar logo para o PDF
            $logoBase64 = null;
            if ($configuracao && $configuracao->logo_path && $configuracao->mostrar_logo) {
                try {
                    $logoPath = storage_path('app/public/' . $configuracao->logo_path);
                    if (file_exists($logoPath)) {
                        $logoContent = file_get_contents($logoPath);
                        $logoBase64 = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . base64_encode($logoContent);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Erro ao carregar logo para PDF: ' . $e->getMessage());
                }
            }
            
            // Preparar dados para a view
            $data = [
                'consulta' => $consulta,
                'configuracao' => $configuracao,
                'logo_base64' => $logoBase64,
                'data_emissao' => Carbon::now()->format('d/m/Y H:i:s'),
            ];
            
            // Gerar PDF
            $pdf = Pdf::loadView('recibos.consulta', $data);
            
            return $pdf->stream('recibo-consulta-' . $consulta->id . '.pdf');
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar recibo público: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao gerar recibo',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }
}

