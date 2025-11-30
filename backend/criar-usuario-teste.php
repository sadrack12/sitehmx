<?php

/**
 * Script para criar usuário de teste
 * Execute: php criar-usuario-teste.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "🔧 Criando usuário de teste...\n\n";

$email = 'admin@sitehmx.com';
$password = 'admin123';

// Verificar se já existe
if (User::where('email', $email)->exists()) {
    echo "⚠️  Usuário com email '{$email}' já existe!\n\n";
    
    $update = readline("Deseja atualizar a senha para '{$password}'? (s/n): ");
    
    if (strtolower($update) === 's') {
        $user = User::where('email', $email)->first();
        $user->password = Hash::make($password);
        $user->save();
        echo "✅ Senha atualizada!\n";
    } else {
        echo "❌ Operação cancelada.\n";
        exit;
    }
} else {
    // Criar usuário
    $user = User::create([
        'name' => 'Administrador',
        'email' => $email,
        'password' => Hash::make($password),
        'role' => 'admin',
    ]);
    
    echo "✅ Usuário criado com sucesso!\n";
}

echo "\n";
echo "📋 Credenciais de Acesso:\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "📧 Email: {$email}\n";
echo "🔑 Senha: {$password}\n";
echo "👤 Role: admin\n";
echo "🌐 URL de Login: https://clamatec.com/gestao/login\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "\n";
echo "⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n";
echo "\n";

