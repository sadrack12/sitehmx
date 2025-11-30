<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\Medico;
use App\Models\SalaConsulta;
use Carbon\Carbon;

class ConsultasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar dados existentes
        $pacientes = Paciente::all();
        $medicos = Medico::all();
        $salas = SalaConsulta::where('disponivel', true)->get();

        if ($pacientes->isEmpty() || $medicos->isEmpty()) {
            $this->command->warn('É necessário ter pacientes e médicos cadastrados antes de criar consultas.');
            return;
        }

        $tiposConsulta = [
            'Consulta Geral',
            'Consulta de Especialidade',
            'Retorno',
            'Avaliação',
        ];

        $statuses = ['agendada', 'confirmada', 'realizada', 'cancelada'];
        $statusWeights = [
            'agendada' => 30,
            'confirmada' => 25,
            'realizada' => 35,
            'cancelada' => 10,
        ];

        $consultas = [];
        $hoje = Carbon::today();
        
        // Criar 40 consultas
        for ($i = 0; $i < 40; $i++) {
            // Selecionar paciente aleatório
            $paciente = $pacientes->random();
            
            // Selecionar médico aleatório
            $medico = $medicos->random();
            
            // Selecionar sala aleatória (se houver salas disponíveis)
            $sala = $salas->isNotEmpty() ? $salas->random() : null;
            
            // Gerar data aleatória (30 dias atrás até 60 dias à frente)
            $diasOffset = rand(-30, 60);
            $dataConsulta = $hoje->copy()->addDays($diasOffset);
            
            // Gerar hora aleatória (8h às 17h)
            $horaConsulta = Carbon::createFromTime(rand(8, 17), rand(0, 59), 0);
            
            // Selecionar status baseado nos pesos
            $status = $this->weightedRandom($statusWeights);
            
            // Se a consulta é realizada ou cancelada, deve ser no passado
            if (in_array($status, ['realizada', 'cancelada']) && $dataConsulta->isFuture()) {
                $dataConsulta = $hoje->copy()->subDays(rand(1, 30));
            }
            
            // Se a consulta é agendada ou confirmada, deve ser no futuro
            if (in_array($status, ['agendada', 'confirmada']) && $dataConsulta->isPast()) {
                $dataConsulta = $hoje->copy()->addDays(rand(1, 60));
            }
            
            // Determinar se foi agendada online (30% de chance)
            $agendadaOnline = rand(1, 100) <= 30;
            
            // Tipo de consulta baseado no status
            $tipoConsulta = $status === 'realizada' 
                ? $tiposConsulta[array_rand($tiposConsulta)]
                : ($agendadaOnline ? 'Consulta de Especialidade' : $tiposConsulta[array_rand($tiposConsulta)]);
            
            $consultas[] = [
                'paciente_id' => $paciente->id,
                'medico_id' => $medico->id,
                'sala_id' => $sala ? $sala->id : null,
                'data_consulta' => $dataConsulta->format('Y-m-d'),
                'hora_consulta' => $horaConsulta->format('H:i:s'),
                'tipo_consulta' => $tipoConsulta,
                'status' => $status,
                'agendada_online' => $agendadaOnline,
                'observacoes' => $this->gerarObservacoes($status),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Inserir todas as consultas
        Consulta::insert($consultas);
        
        $this->command->info('40 consultas criadas com sucesso!');
    }

    /**
     * Seleção aleatória baseada em pesos
     */
    private function weightedRandom(array $weights): string
    {
        $total = array_sum($weights);
        $random = rand(1, $total);
        $current = 0;
        
        foreach ($weights as $key => $weight) {
            $current += $weight;
            if ($random <= $current) {
                return $key;
            }
        }
        
        return array_key_first($weights);
    }

    /**
     * Gerar observações baseadas no status
     */
    private function gerarObservacoes(string $status): ?string
    {
        $observacoes = [
            'agendada' => [
                'Consulta agendada com sucesso.',
                'Paciente solicitou preferência por manhã.',
                'Primeira consulta com este médico.',
            ],
            'confirmada' => [
                'Consulta confirmada pelo paciente.',
                'Paciente confirmou presença.',
                'Confirmação recebida via telefone.',
            ],
            'realizada' => [
                'Consulta realizada com sucesso.',
                'Paciente compareceu e foi atendido.',
                'Exame físico realizado, paciente orientado.',
                'Prescrição médica fornecida.',
            ],
            'cancelada' => [
                'Consulta cancelada pelo paciente.',
                'Paciente não compareceu.',
                'Cancelamento solicitado com antecedência.',
            ],
        ];

        $opcoes = $observacoes[$status] ?? [null];
        return $opcoes[array_rand($opcoes)];
    }
}
