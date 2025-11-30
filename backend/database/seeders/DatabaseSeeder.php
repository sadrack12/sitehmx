<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usar updateOrCreate para evitar erro se usuário já existe
        User::updateOrCreate(
            ['email' => 'admin@sitehmx.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'gestor@sitehmx.com'],
            [
                'name' => 'Gestor',
                'password' => Hash::make('password'),
                'role' => 'gestor',
            ]
        );

        $this->call([
            MedicamentoSeeder::class,
            ExameSeeder::class,
            ServicoSeeder::class,
        ]);
    }
}

