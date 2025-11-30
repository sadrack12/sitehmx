<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Servico;

class ServicoSeeder extends Seeder
{
    public function run(): void
    {
        // Serviços Especializados
        $servicosEspecializados = [
            [
                'title' => 'Neurocirurgia',
                'description' => 'Especialidade médica dedicada ao diagnóstico e tratamento cirúrgico de doenças do sistema nervoso central e periférico.',
                'tipo' => 'especializado',
                'published' => true,
                'order' => 1,
            ],
            [
                'title' => 'Ortopedia e Traumatologia',
                'description' => 'Especialidade médica que trata doenças e lesões do sistema musculoesquelético, incluindo ossos, articulações, músculos e ligamentos.',
                'tipo' => 'especializado',
                'published' => true,
                'order' => 2,
            ],
            [
                'title' => 'Cirurgia Maxilofacial',
                'description' => 'Especialidade médica e odontológica que trata doenças, lesões e deformidades da face, mandíbula, maxila e estruturas relacionadas.',
                'tipo' => 'especializado',
                'published' => true,
                'order' => 3,
            ],
        ];

        // Serviços de Apoio
        $servicosApoio = [
            [
                'title' => 'Imagiologia',
                'description' => 'Serviço de diagnóstico por imagem que oferece exames como radiografias, ultrassonografias, tomografias e ressonâncias magnéticas.',
                'tipo' => 'apoio',
                'published' => true,
                'order' => 1,
            ],
        ];

        // Adicionar serviços especializados
        foreach ($servicosEspecializados as $servico) {
            Servico::firstOrCreate(
                ['title' => $servico['title'], 'tipo' => $servico['tipo']],
                $servico
            );
        }

        // Adicionar serviços de apoio
        foreach ($servicosApoio as $servico) {
            Servico::firstOrCreate(
                ['title' => $servico['title'], 'tipo' => $servico['tipo']],
                $servico
            );
        }
    }
}

