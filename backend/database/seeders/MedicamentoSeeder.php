<?php

namespace Database\Seeders;

use App\Models\Medicamento;
use Illuminate\Database\Seeder;

class MedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $medicamentos = [
            [
                'nome' => 'Paracetamol',
                'principio_ativo' => 'Paracetamol',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Analgésico e antitérmico',
            ],
            [
                'nome' => 'Paracetamol 500mg',
                'principio_ativo' => 'Paracetamol',
                'apresentacao' => 'Comprimido 500mg',
                'descricao' => 'Analgésico e antitérmico',
            ],
            [
                'nome' => 'Ibuprofeno',
                'principio_ativo' => 'Ibuprofeno',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Anti-inflamatório não esteroidal',
            ],
            [
                'nome' => 'Ibuprofeno 400mg',
                'principio_ativo' => 'Ibuprofeno',
                'apresentacao' => 'Comprimido 400mg',
                'descricao' => 'Anti-inflamatório não esteroidal',
            ],
            [
                'nome' => 'Amoxicilina',
                'principio_ativo' => 'Amoxicilina',
                'apresentacao' => 'Cápsula',
                'descricao' => 'Antibiótico de amplo espectro',
            ],
            [
                'nome' => 'Amoxicilina 500mg',
                'principio_ativo' => 'Amoxicilina',
                'apresentacao' => 'Cápsula 500mg',
                'descricao' => 'Antibiótico de amplo espectro',
            ],
            [
                'nome' => 'Dipirona',
                'principio_ativo' => 'Dipirona Sódica',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Analgésico e antitérmico',
            ],
            [
                'nome' => 'Dipirona 500mg',
                'principio_ativo' => 'Dipirona Sódica',
                'apresentacao' => 'Comprimido 500mg',
                'descricao' => 'Analgésico e antitérmico',
            ],
            [
                'nome' => 'Omeprazol',
                'principio_ativo' => 'Omeprazol',
                'apresentacao' => 'Cápsula',
                'descricao' => 'Inibidor da bomba de prótons',
            ],
            [
                'nome' => 'Omeprazol 20mg',
                'principio_ativo' => 'Omeprazol',
                'apresentacao' => 'Cápsula 20mg',
                'descricao' => 'Inibidor da bomba de prótons',
            ],
            [
                'nome' => 'Azitromicina',
                'principio_ativo' => 'Azitromicina',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Antibiótico macrolídeo',
            ],
            [
                'nome' => 'Azitromicina 500mg',
                'principio_ativo' => 'Azitromicina',
                'apresentacao' => 'Comprimido 500mg',
                'descricao' => 'Antibiótico macrolídeo',
            ],
            [
                'nome' => 'Losartana',
                'principio_ativo' => 'Losartana Potássica',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Anti-hipertensivo',
            ],
            [
                'nome' => 'Losartana 50mg',
                'principio_ativo' => 'Losartana Potássica',
                'apresentacao' => 'Comprimido 50mg',
                'descricao' => 'Anti-hipertensivo',
            ],
            [
                'nome' => 'Metformina',
                'principio_ativo' => 'Metformina',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Antidiabético oral',
            ],
            [
                'nome' => 'Metformina 500mg',
                'principio_ativo' => 'Metformina',
                'apresentacao' => 'Comprimido 500mg',
                'descricao' => 'Antidiabético oral',
            ],
            [
                'nome' => 'Loratadina',
                'principio_ativo' => 'Loratadina',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Anti-histamínico',
            ],
            [
                'nome' => 'Loratadina 10mg',
                'principio_ativo' => 'Loratadina',
                'apresentacao' => 'Comprimido 10mg',
                'descricao' => 'Anti-histamínico',
            ],
            [
                'nome' => 'Sulfato Ferroso',
                'principio_ativo' => 'Sulfato Ferroso',
                'apresentacao' => 'Comprimido',
                'descricao' => 'Suplemento de ferro',
            ],
            [
                'nome' => 'Sulfato Ferroso 40mg',
                'principio_ativo' => 'Sulfato Ferroso',
                'apresentacao' => 'Comprimido 40mg',
                'descricao' => 'Suplemento de ferro',
            ],
        ];

        foreach ($medicamentos as $medicamento) {
            Medicamento::create($medicamento);
        }
    }
}
