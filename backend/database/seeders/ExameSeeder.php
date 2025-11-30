<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exame;

class ExameSeeder extends Seeder
{
    public function run(): void
    {
        $exames = [
            // Exames de Sangue - Hematologia
            [
                'codigo' => 'HEM001',
                'nome' => 'Hemograma Completo',
                'descricao' => 'Avaliação completa das células sanguíneas (hemácias, leucócitos e plaquetas)',
                'tipo' => 'laboratorio',
                'valor' => 25.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 4 horas. Pode beber água.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            [
                'codigo' => 'HEM002',
                'nome' => 'Coagulograma',
                'descricao' => 'Avaliação da coagulação sanguínea',
                'tipo' => 'laboratorio',
                'valor' => 35.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 4 horas.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            
            // Exames Bioquímicos
            [
                'codigo' => 'BIO001',
                'nome' => 'Glicemia de Jejum',
                'descricao' => 'Dosagem de glicose no sangue em jejum',
                'tipo' => 'laboratorio',
                'valor' => 15.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 8 a 12 horas.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO002',
                'nome' => 'Hemoglobina Glicada (HbA1c)',
                'descricao' => 'Avaliação do controle glicêmico dos últimos 3 meses',
                'tipo' => 'laboratorio',
                'valor' => 40.00,
                'prazo_resultado' => 2,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO003',
                'nome' => 'Colesterol Total e Frações',
                'descricao' => 'Dosagem de colesterol total, HDL, LDL e triglicerídeos',
                'tipo' => 'laboratorio',
                'valor' => 30.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 12 horas.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO004',
                'nome' => 'Creatinina',
                'descricao' => 'Avaliação da função renal',
                'tipo' => 'laboratorio',
                'valor' => 12.00,
                'prazo_resultado' => 1,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO005',
                'nome' => 'Ureia',
                'descricao' => 'Avaliação da função renal',
                'tipo' => 'laboratorio',
                'valor' => 12.00,
                'prazo_resultado' => 1,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO006',
                'nome' => 'TGO (AST)',
                'descricao' => 'Transaminase glutâmico-oxalacética - avaliação hepática',
                'tipo' => 'laboratorio',
                'valor' => 15.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 4 horas.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO007',
                'nome' => 'TGP (ALT)',
                'descricao' => 'Transaminase glutâmico-pirúvica - avaliação hepática',
                'tipo' => 'laboratorio',
                'valor' => 15.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 4 horas.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            [
                'codigo' => 'BIO008',
                'nome' => 'Bilirrubina Total e Frações',
                'descricao' => 'Avaliação hepática e biliar',
                'tipo' => 'laboratorio',
                'valor' => 18.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 4 horas.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            
            // Exames Hormonais
            [
                'codigo' => 'HOR001',
                'nome' => 'TSH',
                'descricao' => 'Hormônio estimulante da tireoide',
                'tipo' => 'laboratorio',
                'valor' => 35.00,
                'prazo_resultado' => 2,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'HOR002',
                'nome' => 'T4 Livre',
                'descricao' => 'Tiroxina livre - avaliação da tireoide',
                'tipo' => 'laboratorio',
                'valor' => 40.00,
                'prazo_resultado' => 2,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'HOR003',
                'nome' => 'T3 Livre',
                'descricao' => 'Triiodotironina livre - avaliação da tireoide',
                'tipo' => 'laboratorio',
                'valor' => 40.00,
                'prazo_resultado' => 2,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            
            // Exames de Urina
            [
                'codigo' => 'URI001',
                'nome' => 'Urina Tipo I (EAS)',
                'descricao' => 'Exame de urina completo',
                'tipo' => 'laboratorio',
                'valor' => 15.00,
                'prazo_resultado' => 1,
                'preparo' => 'Coletar primeira urina da manhã. Higienizar antes da coleta.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'URI002',
                'nome' => 'Urocultura',
                'descricao' => 'Cultura de urina para identificação de bactérias',
                'tipo' => 'laboratorio',
                'valor' => 30.00,
                'prazo_resultado' => 3,
                'preparo' => 'Coletar jato médio da primeira urina da manhã. Higienizar antes da coleta.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            
            // Exames de Imagem
            [
                'codigo' => 'IMG001',
                'nome' => 'Raio-X de Tórax',
                'descricao' => 'Radiografia do tórax em PA e perfil',
                'tipo' => 'imagem',
                'valor' => 50.00,
                'prazo_resultado' => 1,
                'preparo' => 'Remover objetos metálicos da região do tórax.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'IMG002',
                'nome' => 'Ultrassonografia Abdominal',
                'descricao' => 'Ultrassom completo do abdome',
                'tipo' => 'imagem',
                'valor' => 80.00,
                'prazo_resultado' => 1,
                'preparo' => 'Jejum de 6 horas. Beber 1 litro de água 1 hora antes do exame.',
                'requer_jejum' => true,
                'ativo' => true,
            ],
            [
                'codigo' => 'IMG003',
                'nome' => 'Ultrassonografia de Tireoide',
                'descricao' => 'Avaliação da glândula tireoide',
                'tipo' => 'imagem',
                'valor' => 60.00,
                'prazo_resultado' => 1,
                'preparo' => 'Não requer preparo.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'IMG004',
                'nome' => 'Eletrocardiograma (ECG)',
                'descricao' => 'Registro da atividade elétrica do coração',
                'tipo' => 'clinico',
                'valor' => 35.00,
                'prazo_resultado' => 1,
                'preparo' => 'Não requer preparo.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            
            // Outros Exames
            [
                'codigo' => 'OUT001',
                'nome' => 'Teste de Gravidez (Beta-HCG)',
                'descricao' => 'Dosagem do hormônio da gravidez',
                'tipo' => 'laboratorio',
                'valor' => 25.00,
                'prazo_resultado' => 1,
                'preparo' => 'Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
            [
                'codigo' => 'OUT002',
                'nome' => 'PSA Total',
                'descricao' => 'Antígeno prostático específico - rastreamento de câncer de próstata',
                'tipo' => 'laboratorio',
                'valor' => 45.00,
                'prazo_resultado' => 2,
                'preparo' => 'Não realizar atividade sexual 48 horas antes. Não requer jejum.',
                'requer_jejum' => false,
                'ativo' => true,
            ],
        ];

        foreach ($exames as $exame) {
            Exame::firstOrCreate(
                ['codigo' => $exame['codigo']],
                $exame
            );
        }
    }
}
