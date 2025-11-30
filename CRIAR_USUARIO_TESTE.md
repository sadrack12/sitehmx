# 👤 Criar Usuário de Teste no Servidor

## 🎯 Objetivo

Criar um usuário administrativo para acessar o painel de gestão do sistema.

---

## ✅ Método 1: Usar o Seeder (Recomendado)

### No servidor via SSH:

```bash
cd ~/public_html/api
php artisan db:seed --class=CriarUsuarioTesteSeeder
```

**Credenciais criadas:**
- 📧 Email: `admin@sitehmx.com`
- 🔑 Senha: `admin123`
- 👤 Role: `admin`

---

## ✅ Método 2: Usar o Tinker (Mais Flexível)

### No servidor via SSH:

```bash
cd ~/public_html/api
php artisan tinker
```

Depois, dentro do tinker, execute:

```php
$user = \App\Models\User::create([
    'name' => 'Administrador',
    'email' => 'admin@sitehmx.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin'
]);
echo "Usuário criado: " . $user->email;
exit
```

---

## ✅ Método 3: Via Interface Web (Se disponível)

Se você tiver acesso ao frontend, pode tentar criar via interface se houver essa funcionalidade.

---

## ✅ Método 4: Script PHP Direto

Se precisar criar via arquivo PHP temporário:

### No servidor, crie o arquivo:

```bash
cd ~/public_html/api
nano criar-usuario.php
```

Cole este código:

```php
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'admin@sitehmx.com';
$password = 'admin123';

// Verificar se já existe
if (User::where('email', $email)->exists()) {
    echo "Usuário já existe!\n";
    exit;
}

// Criar usuário
$user = User::create([
    'name' => 'Administrador',
    'email' => $email,
    'password' => Hash::make($password),
    'role' => 'admin',
]);

echo "✅ Usuário criado!\n";
echo "Email: {$user->email}\n";
echo "Senha: {$password}\n";

// Deletar arquivo após uso (segurança)
unlink(__FILE__);
```

Execute:
```bash
php criar-usuario.php
```

---

## 📝 Criar Usuários com Diferentes Roles

### Admin (Acesso total):
```php
User::create([
    'name' => 'Administrador',
    'email' => 'admin@sitehmx.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin'
]);
```

### Gestor:
```php
User::create([
    'name' => 'Gestor',
    'email' => 'gestor@sitehmx.com',
    'password' => bcrypt('gestor123'),
    'role' => 'gestor'
]);
```

### Atendente:
```php
User::create([
    'name' => 'Atendente',
    'email' => 'atendente@sitehmx.com',
    'password' => bcrypt('atendente123'),
    'role' => 'atendente'
]);
```

### Médico:
```php
User::create([
    'name' => 'Dr. João Silva',
    'email' => 'medico@sitehmx.com',
    'password' => bcrypt('medico123'),
    'role' => 'medico',
    'medico_id' => 1 // ID do médico na tabela medicos (opcional)
]);
```

---

## 🔐 Fazer Login

1. Acesse o frontend: `https://clamatec.com/gestao/login`

2. Use as credenciais criadas:
   - Email: `admin@sitehmx.com`
   - Senha: `admin123`

3. **IMPORTANTE:** Altere a senha após o primeiro login!

---

## 🔄 Alterar Senha de um Usuário Existente

### Via Tinker:

```bash
php artisan tinker
```

```php
$user = \App\Models\User::where('email', 'admin@sitehmx.com')->first();
$user->password = bcrypt('nova_senha_123');
$user->save();
echo "Senha alterada!";
exit
```

---

## 🗑️ Deletar Usuário (se necessário)

### Via Tinker:

```bash
php artisan tinker
```

```php
$user = \App\Models\User::where('email', 'admin@sitehmx.com')->first();
$user->delete();
echo "Usuário deletado!";
exit
```

---

## 📋 Checklist

- [ ] Acessou o servidor via SSH
- [ ] Navegou até `~/public_html/api`
- [ ] Executou o seeder ou tinker
- [ ] Usuário foi criado com sucesso
- [ ] Fez login no frontend
- [ ] Alterou a senha padrão

---

## 🎯 Método Mais Rápido (Copiar e Colar)

Execute direto no servidor:

```bash
cd ~/public_html/api && php artisan tinker --execute="
\$user = \App\Models\User::firstOrCreate(
    ['email' => 'admin@sitehmx.com'],
    [
        'name' => 'Administrador',
        'password' => bcrypt('admin123'),
        'role' => 'admin'
    ]
);
echo '✅ Usuário: ' . \$user->email . ' | Senha: admin123';
"
```

---

## ✅ Pronto!

Após criar o usuário, você poderá acessar:
- **URL:** `https://clamatec.com/gestao/login`
- **Email:** `admin@sitehmx.com`
- **Senha:** `admin123`

**Não esqueça de alterar a senha!** 🔒

