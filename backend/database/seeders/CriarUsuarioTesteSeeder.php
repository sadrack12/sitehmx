<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CriarUsuarioTesteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar se o usuário já existe
        $email = 'admin@sitehmx.com';
        
        if (User::where('email', $email)->exists()) {
            echo "⚠️  Usuário com email {$email} já existe!\n";
            return;
        }

        // Criar usuário admin de teste
        $user = User::create([
            'name' => 'Administrador',
            'email' => $email,
            'password' => Hash::make('admin123'), // Senha padrão: admin123
            'role' => 'admin',
        ]);

        echo "✅ Usuário de teste criado com sucesso!\n";
        echo "📧 Email: {$user->email}\n";
        echo "🔑 Senha: admin123\n";
        echo "👤 Role: {$user->role}\n";
        echo "\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n";
    }
}

