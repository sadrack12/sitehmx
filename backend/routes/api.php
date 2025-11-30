<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConsultaController;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\MedicoController as ApiMedicoController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Admin\NoticiaController;
use App\Http\Controllers\Admin\EventoController;
use App\Http\Controllers\Admin\ServicoController;
use App\Http\Controllers\Admin\ValorController;
use App\Http\Controllers\Admin\ParceiroController;
use App\Http\Controllers\Admin\CorpoDiretivoController;
use App\Http\Controllers\Admin\HeroSlideController;
use App\Http\Controllers\Admin\MensagemDirectorController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\MedicoController as AdminMedicoController;
use App\Http\Controllers\Admin\MedicoHorarioController;
use App\Http\Controllers\Admin\EspecialidadeController;
use App\Http\Controllers\Admin\SalaConsultaController;
use App\Http\Controllers\Admin\ExameController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\LaboratorioController;
use App\Http\Controllers\Api\MedicoDisponibilidadeController;
use App\Http\Controllers\Api\EspecialidadeDisponibilidadeController;
use App\Http\Controllers\Api\PublicAgendamentoController;
use App\Http\Controllers\Api\PdfConfiguracaoController;
use App\Http\Controllers\Api\ReciboConsultaController;
use App\Http\Controllers\Api\DocumentoMedicoController;
use App\Http\Controllers\Api\MedicamentoController;
use App\Http\Controllers\Api\RelatorioController;
use App\Http\Controllers\Api\ConsultaOnlineController;
use App\Http\Controllers\Api\WebRTCSignalingController;
use App\Http\Controllers\Api\DailyController;
use Illuminate\Support\Facades\Route;

// Agrupar todas as rotas com prefixo 'api' para funcionar no Docker
Route::prefix('api')->group(function () {
    // Rotas públicas
    Route::get('/noticias', [PublicController::class, 'noticias']);
    Route::get('/eventos', [PublicController::class, 'eventos']);
    Route::get('/hero-slides', [PublicController::class, 'heroSlides']);
    Route::get('/corpo-diretivo', [PublicController::class, 'corpoDiretivo']);
    Route::get('/mensagem-director', [PublicController::class, 'mensagemDirector']);

    // Rotas públicas para agendamento
    Route::get('/especialidades', [PublicController::class, 'especialidades']);
    Route::get('/medicos', [ApiMedicoController::class, 'index']);
    Route::get('/medico-disponibilidade', [MedicoDisponibilidadeController::class, 'disponibilidade']);
    Route::get('/especialidade-disponibilidade', [EspecialidadeDisponibilidadeController::class, 'disponibilidade']);
    Route::post('/buscar-paciente', [PublicAgendamentoController::class, 'buscarPaciente']);
    Route::post('/criar-paciente', [PublicAgendamentoController::class, 'criarPaciente']);
    Route::post('/verificar-consulta-existente', [PublicAgendamentoController::class, 'verificarConsultaExistente']);
    Route::post('/agendar', [PublicAgendamentoController::class, 'agendar']);

    // Rotas públicas para consultas online
    Route::get('/consulta-online/{id}', [ConsultaOnlineController::class, 'obterLinkConsulta']);
    Route::post('/consulta-online/buscar', [ConsultaOnlineController::class, 'buscarPorNIF']);

    // Daily.co - Token para paciente (público)
    Route::get('/daily/{consultaId}/token', [DailyController::class, 'getPatientToken']);

    // Documentos públicos (validação por NIF)
    Route::get('/consultas/{id}/documentos', [PublicController::class, 'verificarDocumentos']);
    Route::get('/consultas/{id}/prescricao', [DocumentoMedicoController::class, 'gerarPrescricaoPublica']);
    Route::get('/consultas/{id}/requisicao-exames', [DocumentoMedicoController::class, 'gerarRequisicaoExamePorConsultaPublica']);
    Route::get('/consultas/{id}/recibo', [ReciboConsultaController::class, 'gerarReciboPublico']);

    // WebRTC Signaling (público para paciente)
    Route::get('webrtc/{roomId}/oferta', [WebRTCSignalingController::class, 'getOffer']);
    Route::post('webrtc/{roomId}/resposta', [WebRTCSignalingController::class, 'sendAnswer']);
    Route::post('webrtc/{roomId}/candidato', [WebRTCSignalingController::class, 'sendCandidate']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::apiResource('consultas', ConsultaController::class);
    Route::delete('consultas/multiple', [ConsultaController::class, 'destroyMultiple']);
    Route::delete('consultas/all', [ConsultaController::class, 'destroyAll'])->middleware('admin');
    Route::get('consultas/{id}/recibo', [ReciboConsultaController::class, 'gerarRecibo']);
    Route::get('consultas/{id}/recibo/visualizar', [ReciboConsultaController::class, 'visualizarRecibo']);
    
    // Consultas Online
    Route::post('consultas/{id}/iniciar-online', [ConsultaOnlineController::class, 'iniciarConsulta']);
    Route::post('consultas/{id}/finalizar-online', [ConsultaOnlineController::class, 'finalizarConsulta']);
    
    // Daily.co - Gerenciamento de salas (médico - requer autenticação)
    Route::get('daily/consulta/{consultaId}/room', [DailyController::class, 'createOrGetRoom']);
    Route::delete('daily/consulta/{consultaId}/room', [DailyController::class, 'deleteRoom']);
    
    // WebRTC Signaling (médico - requer autenticação)
    Route::post('webrtc/{roomId}/oferta', [WebRTCSignalingController::class, 'sendOffer']);
    Route::get('webrtc/{roomId}/resposta', [WebRTCSignalingController::class, 'getAnswer']);
    
    // Documentos Médicos
    Route::get('consultas/{id}/prescricao', [DocumentoMedicoController::class, 'gerarPrescricao']);
    Route::post('consultas/{id}/atestado', [DocumentoMedicoController::class, 'gerarAtestado']);
    Route::get('consultas/{id}/relatorio', [DocumentoMedicoController::class, 'gerarRelatorioConsulta']);
    Route::get('consultas/{id}/comprovante', [DocumentoMedicoController::class, 'gerarComprovanteAtendimento']);
    
    // Documentos de Exames
    Route::get('consultas/{id}/requisicao-exames', [DocumentoMedicoController::class, 'gerarRequisicaoExamePorConsulta']);
    Route::get('solicitacoes-exames/{id}/requisicao', [DocumentoMedicoController::class, 'gerarRequisicaoExame']);
    Route::post('solicitacoes-exames/requisicao-massa', [DocumentoMedicoController::class, 'gerarRequisicaoExameMassa']);
    Route::get('solicitacoes-exames/{id}/resultado', [DocumentoMedicoController::class, 'gerarResultadoExame']);
    Route::apiResource('pacientes', PacienteController::class);
    Route::get('/medicos', [ApiMedicoController::class, 'index']);
    Route::get('/medico-disponibilidade', [MedicoDisponibilidadeController::class, 'disponibilidade']);
    
    // Medicamentos
    Route::get('/medicamentos', [MedicamentoController::class, 'index']);
    
    // Relatórios
    Route::get('/relatorios/consultas-periodo', [RelatorioController::class, 'consultasPorPeriodo']);
    Route::get('/relatorios/exames-solicitados', [RelatorioController::class, 'examesSolicitados']);
    Route::get('/relatorios/estatistico-geral', [RelatorioController::class, 'estatisticoGeral']);
    Route::get('/relatorios/produtividade-medica', [RelatorioController::class, 'produtividadeMedica']);
    });

    // Rotas administrativas - requerem autenticação e permissão de admin
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    
    // Notícias
    Route::apiResource('noticias', NoticiaController::class);
    
    // Eventos
    Route::apiResource('eventos', EventoController::class);
    
    // Serviços
    Route::apiResource('servicos', ServicoController::class);
    
    // Valores
    Route::apiResource('valores', ValorController::class);
    
    // Parceiros
    Route::apiResource('parceiros', ParceiroController::class);
    
    // Corpo Diretivo
    Route::apiResource('corpo-diretivo', CorpoDiretivoController::class);
    
    // Hero Slides
    Route::apiResource('hero-slides', HeroSlideController::class);
    
    // Mensagem do Director
    Route::apiResource('mensagem-director', MensagemDirectorController::class);
    
    // Médicos
    Route::apiResource('medicos', AdminMedicoController::class);
    
    // Horários dos Médicos
    Route::get('medico-horarios', [MedicoHorarioController::class, 'index']);
    Route::post('medico-horarios', [MedicoHorarioController::class, 'store']);
    Route::post('medico-horarios/bulk', [MedicoHorarioController::class, 'bulkUpdate']);
    Route::put('medico-horarios/{id}', [MedicoHorarioController::class, 'update']);
    Route::delete('medico-horarios/{id}', [MedicoHorarioController::class, 'destroy']);
    
    // Configurações
    Route::apiResource('especialidades', EspecialidadeController::class);
    Route::apiResource('salas-consultas', SalaConsultaController::class);
    Route::apiResource('exames', ExameController::class);
    
    // Configurações do Cabeçalho PDF
    Route::get('pdf-configuracao', [PdfConfiguracaoController::class, 'show']);
    Route::put('pdf-configuracao', [PdfConfiguracaoController::class, 'update']);
    Route::post('pdf-configuracao/logo', [PdfConfiguracaoController::class, 'uploadLogo']);
    Route::delete('pdf-configuracao/logo', [PdfConfiguracaoController::class, 'removeLogo']);
    
    // Laboratório
    Route::apiResource('laboratorio', LaboratorioController::class);
    Route::get('/laboratorio/{id}/download', [LaboratorioController::class, 'downloadArquivo']);
    
    // Usuários
    Route::apiResource('users', UserController::class);
    });
});

