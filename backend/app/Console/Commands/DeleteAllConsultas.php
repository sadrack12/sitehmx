<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Consulta;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeleteAllConsultas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'consultas:delete-all {--force : Forçar exclusão sem confirmação}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletar todas as consultas do sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $total = Consulta::count();
        
        if ($total === 0) {
            $this->info('Não há consultas para deletar.');
            return 0;
        }

        if (!$this->option('force')) {
            if (!$this->confirm("Tem certeza que deseja deletar TODAS as {$total} consultas? Esta ação é irreversível!")) {
                $this->info('Operação cancelada.');
                return 0;
            }
        }

        $this->info("Deletando {$total} consulta(s)...");

        // Deletar salas de videoconferência primeiro
        $consultasComSala = Consulta::whereNotNull('sala_videoconferencia')->get();
        $dailyApiKey = env('DAILY_API_KEY');
        $deletedRooms = 0;
        
        if ($dailyApiKey && $consultasComSala->count() > 0) {
            $this->info("Deletando salas Daily.co...");
            $bar = $this->output->createProgressBar($consultasComSala->count());
            $bar->start();
            
            foreach ($consultasComSala as $consulta) {
                try {
                    if ($consulta->sala_videoconferencia) {
                        Http::withHeaders([
                            'Authorization' => 'Bearer ' . $dailyApiKey,
                        ])->delete('https://api.daily.co/v1/rooms/' . $consulta->sala_videoconferencia);
                        $deletedRooms++;
                    }
                } catch (\Exception $e) {
                    // Ignorar erro - não é crítico
                    Log::warning('Erro ao deletar sala Daily.co: ' . $e->getMessage());
                }
                $bar->advance();
            }
            
            $bar->finish();
            $this->newLine();
            $this->info("{$deletedRooms} sala(s) Daily.co deletada(s).");
        }

        // Deletar todas as consultas
        $deleted = Consulta::query()->delete();

        $this->newLine();
        $this->info("✅ {$deleted} consulta(s) deletada(s) com sucesso!");

        return 0;
    }
}

