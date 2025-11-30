<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use App\Models\Evento;
use App\Models\Servico;
use App\Models\Valor;
use App\Models\Parceiro;
use App\Models\CorpoDiretivo;
use App\Models\HeroSlide;
use App\Models\MensagemDirector;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\Medico;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $hoje = Carbon::today();
        $mesAtual = Carbon::now()->startOfMonth();
        $mesAnterior = Carbon::now()->subMonth()->startOfMonth();
        $fimMesAnterior = Carbon::now()->subMonth()->endOfMonth();

        // Estatísticas de Consultas
        $consultasHoje = Consulta::whereDate('data_consulta', $hoje)->count();
        $consultasMesAtual = Consulta::whereBetween('data_consulta', [$mesAtual, Carbon::now()->endOfMonth()])->count();
        $consultasMesAnterior = Consulta::whereBetween('data_consulta', [$mesAnterior, $fimMesAnterior])->count();
        $consultasPorStatus = Consulta::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Consultas dos últimos 6 meses
        $consultasUltimosMeses = [];
        for ($i = 5; $i >= 0; $i--) {
            $mes = Carbon::now()->subMonths($i);
            $inicioMes = $mes->copy()->startOfMonth();
            $fimMes = $mes->copy()->endOfMonth();
            $consultasUltimosMeses[] = [
                'mes' => $mes->format('M/Y'),
                'total' => Consulta::whereBetween('data_consulta', [$inicioMes, $fimMes])->count(),
            ];
        }

        // Estatísticas de Pacientes
        $totalPacientes = Paciente::count();
        $pacientesMesAtual = Paciente::whereBetween('created_at', [$mesAtual, Carbon::now()])->count();

        // Estatísticas de Médicos
        $totalMedicos = Medico::count();
        $medicosAtivos = Medico::whereHas('horarios', function($q) use ($hoje) {
            $q->where('data', '>=', $hoje)->where('disponivel', true);
        })->count();

        // Estatísticas de Exames (removido - módulo deletado)

        return response()->json([
            'stats' => [
                'noticias' => Noticia::count(),
                'eventos' => Evento::count(),
                'servicos' => Servico::count(),
                'valores' => Valor::count(),
                'parceiros' => Parceiro::count(),
                'corpo_diretivo' => CorpoDiretivo::count(),
                'hero_slides' => HeroSlide::count(),
                'mensagem_director' => MensagemDirector::where('published', true)->count(),
            ],
            'consultas' => [
                'hoje' => $consultasHoje,
                'mes_atual' => $consultasMesAtual,
                'mes_anterior' => $consultasMesAnterior,
                'por_status' => $consultasPorStatus,
                'ultimos_meses' => $consultasUltimosMeses,
            ],
            'pacientes' => [
                'total' => $totalPacientes,
                'novos_mes' => $pacientesMesAtual,
            ],
            'medicos' => [
                'total' => $totalMedicos,
                'ativos' => $medicosAtivos,
            ],
            'menu' => [
                [
                    'title' => 'Notícias',
                    'icon' => 'newspaper',
                    'route' => '/admin/noticias',
                    'count' => Noticia::count(),
                ],
                [
                    'title' => 'Eventos',
                    'icon' => 'calendar',
                    'route' => '/admin/eventos',
                    'count' => Evento::count(),
                ],
                [
                    'title' => 'Serviços',
                    'icon' => 'briefcase',
                    'route' => '/admin/servicos',
                    'count' => Servico::count(),
                ],
                [
                    'title' => 'Valores',
                    'icon' => 'heart',
                    'route' => '/admin/valores',
                    'count' => Valor::count(),
                ],
                [
                    'title' => 'Parceiros',
                    'icon' => 'users',
                    'route' => '/admin/parceiros',
                    'count' => Parceiro::count(),
                ],
                [
                    'title' => 'Corpo Diretivo',
                    'icon' => 'user-circle',
                    'route' => '/admin/corpo-diretivo',
                    'count' => CorpoDiretivo::count(),
                ],
                [
                    'title' => 'Hero Slides',
                    'icon' => 'image',
                    'route' => '/admin/hero-slides',
                    'count' => HeroSlide::count(),
                ],
                [
                    'title' => 'Mensagem do Director',
                    'icon' => 'message-square',
                    'route' => '/admin/mensagem-director',
                    'count' => MensagemDirector::where('published', true)->count(),
                ],
            ],
        ]);
    }
}

