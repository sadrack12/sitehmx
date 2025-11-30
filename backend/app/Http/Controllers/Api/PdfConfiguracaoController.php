<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PdfConfiguracao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PdfConfiguracaoController extends Controller
{
    /**
     * Retorna a configuração atual do cabeçalho PDF
     */
    public function show()
    {
        try {
            $configuracao = PdfConfiguracao::first();
            
            if (!$configuracao) {
                $configuracao = PdfConfiguracao::create([
                    'nome_instituicao' => 'Hospital Geral do Moxico',
                    'endereco' => 'Luena, Moxico, Angola',
                    'telefone' => '+244 XXX XXX XXX',
                    'email' => 'info@hospitalmoxico.gov.ao',
                    'mostrar_logo' => true,
                    'mostrar_endereco' => true,
                    'mostrar_contato' => true,
                ]);
            }
            
            $response = [
                'id' => $configuracao->id,
                'nome_instituicao' => $configuracao->nome_instituicao ?? 'Hospital Geral do Moxico',
                'a_republica' => $configuracao->a_republica !== null ? (string)$configuracao->a_republica : '',
                'o_ministerio' => $configuracao->o_ministerio !== null ? (string)$configuracao->o_ministerio : '',
                'o_governo' => $configuracao->o_governo !== null ? (string)$configuracao->o_governo : '',
                'endereco' => $configuracao->endereco !== null ? (string)$configuracao->endereco : '',
                'telefone' => $configuracao->telefone !== null ? (string)$configuracao->telefone : '',
                'email' => $configuracao->email !== null ? (string)$configuracao->email : '',
                'logo_path' => $configuracao->logo_path,
                'texto_cabecalho' => $configuracao->texto_cabecalho !== null ? (string)$configuracao->texto_cabecalho : '',
                'rodape_texto' => $configuracao->rodape_texto !== null ? (string)$configuracao->rodape_texto : '',
                'mostrar_logo' => $configuracao->mostrar_logo !== null ? (bool)$configuracao->mostrar_logo : true,
                'mostrar_endereco' => $configuracao->mostrar_endereco !== null ? (bool)$configuracao->mostrar_endereco : true,
                'mostrar_contato' => $configuracao->mostrar_contato !== null ? (bool)$configuracao->mostrar_contato : true,
            ];
            
            if ($configuracao->logo_path) {
                try {
                    $url = Storage::disk('public')->url($configuracao->logo_path);
                    // Garantir que a URL seja relativa para o frontend construir corretamente
                    if (!str_starts_with($url, 'http')) {
                        $url = '/storage/' . ltrim($configuracao->logo_path, '/');
                    }
                    $response['logo_url'] = $url;
                } catch (\Exception $e) {
                    $response['logo_url'] = '/storage/' . ltrim($configuracao->logo_path, '/');
                }
            } else {
                $response['logo_url'] = null;
            }
            
            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar configuração PDF: ' . $e->getMessage());
            return response()->json([
                'id' => 0,
                'nome_instituicao' => 'Hospital Geral do Moxico',
                'a_republica' => '',
                'o_ministerio' => '',
                'o_governo' => '',
                'endereco' => 'Luena, Moxico, Angola',
                'telefone' => '+244 XXX XXX XXX',
                'email' => 'info@hospitalmoxico.gov.ao',
                'logo_path' => null,
                'logo_url' => null,
                'texto_cabecalho' => '',
                'rodape_texto' => '',
                'mostrar_logo' => true,
                'mostrar_endereco' => true,
                'mostrar_contato' => true,
            ], 200);
        }
    }

    /**
     * Atualiza a configuração do cabeçalho PDF
     */
    public function update(Request $request)
    {
        try {
            // Sempre processar como JSON
            $data = $request->json()->all();
            
            // Garantir que nome_instituicao sempre tenha um valor
            if (empty($data['nome_instituicao']) || trim($data['nome_instituicao']) === '') {
                $data['nome_instituicao'] = 'Hospital Geral do Moxico';
            }
            
            $validator = Validator::make($data, [
                'nome_instituicao' => 'required|string|max:255',
                'a_republica' => 'nullable|string|max:255',
                'o_ministerio' => 'nullable|string|max:255',
                'o_governo' => 'nullable|string|max:255',
                'endereco' => 'nullable|string',
                'telefone' => 'nullable|string|max:50',
                'email' => 'nullable|email|max:255',
                'texto_cabecalho' => 'nullable|string',
                'rodape_texto' => 'nullable|string',
                'mostrar_logo' => 'nullable|boolean',
                'mostrar_endereco' => 'nullable|boolean',
                'mostrar_contato' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $configuracao = PdfConfiguracao::first();
            
            if (!$configuracao) {
                $configuracao = new PdfConfiguracao();
            }

            // Atualizar campos
            $configuracao->nome_instituicao = $data['nome_instituicao'];
            $configuracao->a_republica = isset($data['a_republica']) && trim($data['a_republica']) !== '' ? trim($data['a_republica']) : null;
            $configuracao->o_ministerio = isset($data['o_ministerio']) && trim($data['o_ministerio']) !== '' ? trim($data['o_ministerio']) : null;
            $configuracao->o_governo = isset($data['o_governo']) && trim($data['o_governo']) !== '' ? trim($data['o_governo']) : null;
            $configuracao->endereco = isset($data['endereco']) && trim($data['endereco']) !== '' ? trim($data['endereco']) : null;
            $configuracao->telefone = isset($data['telefone']) && trim($data['telefone']) !== '' ? trim($data['telefone']) : null;
            $configuracao->email = isset($data['email']) && trim($data['email']) !== '' ? trim($data['email']) : null;
            $configuracao->texto_cabecalho = isset($data['texto_cabecalho']) && trim($data['texto_cabecalho']) !== '' ? trim($data['texto_cabecalho']) : null;
            $configuracao->rodape_texto = isset($data['rodape_texto']) && trim($data['rodape_texto']) !== '' ? trim($data['rodape_texto']) : null;
            $configuracao->mostrar_logo = isset($data['mostrar_logo']) ? (bool)$data['mostrar_logo'] : true;
            $configuracao->mostrar_endereco = isset($data['mostrar_endereco']) ? (bool)$data['mostrar_endereco'] : true;
            $configuracao->mostrar_contato = isset($data['mostrar_contato']) ? (bool)$data['mostrar_contato'] : true;
            
            $configuracao->save();

            $response = [
                'id' => $configuracao->id,
                'nome_instituicao' => $configuracao->nome_instituicao,
                'a_republica' => $configuracao->a_republica !== null ? (string)$configuracao->a_republica : '',
                'o_ministerio' => $configuracao->o_ministerio !== null ? (string)$configuracao->o_ministerio : '',
                'o_governo' => $configuracao->o_governo !== null ? (string)$configuracao->o_governo : '',
                'endereco' => $configuracao->endereco !== null ? (string)$configuracao->endereco : '',
                'telefone' => $configuracao->telefone !== null ? (string)$configuracao->telefone : '',
                'email' => $configuracao->email !== null ? (string)$configuracao->email : '',
                'logo_path' => $configuracao->logo_path,
                'texto_cabecalho' => $configuracao->texto_cabecalho !== null ? (string)$configuracao->texto_cabecalho : '',
                'rodape_texto' => $configuracao->rodape_texto !== null ? (string)$configuracao->rodape_texto : '',
                'mostrar_logo' => (bool)$configuracao->mostrar_logo,
                'mostrar_endereco' => (bool)$configuracao->mostrar_endereco,
                'mostrar_contato' => (bool)$configuracao->mostrar_contato,
            ];
            
            if ($configuracao->logo_path) {
                try {
                    $url = Storage::disk('public')->url($configuracao->logo_path);
                    // Garantir que a URL seja relativa para o frontend construir corretamente
                    if (!str_starts_with($url, 'http')) {
                        $url = '/storage/' . ltrim($configuracao->logo_path, '/');
                    }
                    $response['logo_url'] = $url;
                } catch (\Exception $e) {
                    $response['logo_url'] = '/storage/' . ltrim($configuracao->logo_path, '/');
                }
            } else {
                $response['logo_url'] = null;
            }

            return response()->json([
                'message' => 'Configuração atualizada com sucesso!',
                'configuracao' => $response,
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar configuração PDF: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao atualizar configuração',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Faz upload da logo
     */
    public function uploadLogo(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'logo_file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $configuracao = PdfConfiguracao::first();
            
            if (!$configuracao) {
                $configuracao = PdfConfiguracao::create([
                    'nome_instituicao' => 'Hospital Geral do Moxico',
                    'mostrar_logo' => true,
                    'mostrar_endereco' => true,
                    'mostrar_contato' => true,
                ]);
            }

            // Deletar logo antiga se existir
            if ($configuracao->logo_path && Storage::disk('public')->exists($configuracao->logo_path)) {
                Storage::disk('public')->delete($configuracao->logo_path);
            }

            // Salvar nova logo
            $logoPath = $request->file('logo_file')->store('pdf-logos', 'public');
            $configuracao->logo_path = $logoPath;
            $configuracao->save();

            try {
                $logoUrl = Storage::disk('public')->url($logoPath);
                // Garantir que a URL seja relativa
                if (!str_starts_with($logoUrl, 'http')) {
                    $logoUrl = '/storage/' . ltrim($logoPath, '/');
                }
            } catch (\Exception $e) {
                $logoUrl = '/storage/' . ltrim($logoPath, '/');
            }

            return response()->json([
                'message' => 'Logo enviada com sucesso!',
                'logo_path' => $logoPath,
                'logo_url' => $logoUrl,
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao fazer upload do logo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao fazer upload do logo',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Remove a logo
     */
    public function removeLogo()
    {
        try {
            $configuracao = PdfConfiguracao::first();
            
            if ($configuracao && $configuracao->logo_path) {
                if (Storage::disk('public')->exists($configuracao->logo_path)) {
                    Storage::disk('public')->delete($configuracao->logo_path);
                }
                $configuracao->logo_path = null;
                $configuracao->save();
            }

            return response()->json([
                'message' => 'Logo removida com sucesso!',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao remover logo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao remover logo',
                'error' => config('app.debug') ? $e->getMessage() : 'Erro interno do servidor'
            ], 500);
        }
    }
}
