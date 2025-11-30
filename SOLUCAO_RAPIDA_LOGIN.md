# 🚀 SOLUÇÃO RÁPIDA: Corrigir Login que Parou de Funcionar

## ⚡ Execute Estes Comandos no Servidor

Copie e cole tudo de uma vez:

```bash
cd ~/public_html/api && \
php artisan tinker --execute="
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// 1. Deletar usuários duplicados (manter apenas o primeiro de cada email)
\$emails = ['admin@sitehmx.com', 'gestor@sitehmx.com'];
foreach (\$emails as \$email) {
    \$duplicados = User::where('email', \$email)->get();
    if (\$duplicados->count() > 1) {
        \$primeiro = \$duplicados->first();
        User::where('email', \$email)->where('id', '!=', \$primeiro->id)->delete();
        echo '✅ Usuários duplicados deletados para: ' . \$email . PHP_EOL;
    }
}

// 2. Garantir que o admin existe com senha conhecida
\$admin = User::firstOrCreate(
    ['email' => 'admin@sitehmx.com'],
    [
        'name' => 'Administrador',
        'password' => Hash::make('admin123'),
        'role' => 'admin'
    ]
);

// Se já existe, resetar senha
if (!\$admin->wasRecentlyCreated) {
    \$admin->password = Hash::make('admin123');
    \$admin->name = 'Administrador';
    \$admin->role = 'admin';
    \$admin->save();
    echo '✅ Senha do admin resetada' . PHP_EOL;
} else {
    echo '✅ Admin criado' . PHP_EOL;
}

// 3. Garantir que o gestor existe
\$gestor = User::firstOrCreate(
    ['email' => 'gestor@sitehmx.com'],
    [
        'name' => 'Gestor',
        'password' => Hash::make('admin123'),
        'role' => 'gestor'
    ]
);

if (!\$gestor->wasRecentlyCreated) {
    \$gestor->password = Hash::make('admin123');
    \$gestor->save();
    echo '✅ Senha do gestor resetada' . PHP_EOL;
}

echo PHP_EOL . '📋 CREDENCIAIS:' . PHP_EOL;
echo 'Admin: admin@sitehmx.com / admin123' . PHP_EOL;
echo 'Gestor: gestor@sitehmx.com / admin123' . PHP_EOL;
" && \
php artisan cache:clear && \
php artisan config:clear && \
php artisan route:clear && \
php artisan config:cache && \
php artisan route:cache && \
echo "✅ Tudo corrigido!"
```

---

## 🔑 Credenciais para Login

Após executar o comando acima, use:

### Admin (acesso total):
- **Email:** `admin@sitehmx.com`
- **Senha:** `admin123`

### Gestor:
- **Email:** `gestor@sitehmx.com`
- **Senha:** `admin123`

---

## 🧪 Testar o Login

1. **Acesse:** `https://clamatec.com/gestao/login`
2. **Use as credenciais acima**
3. **Se não funcionar**, me diga qual erro aparece

---

## 🔍 Se Ainda Não Funcionar

### Verificar Logs

```bash
cd ~/public_html/api
tail -n 100 storage/logs/laravel.log | grep -i "login\|error\|exception"
```

### Testar API Diretamente

```bash
curl -X POST https://clamatec.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sitehmx.com","password":"admin123"}' \
  -v
```

Me envie o resultado para eu ver o erro específico!

---

## ✅ O Que Este Script Faz

1. ✅ Remove usuários duplicados (deixa apenas um de cada email)
2. ✅ Cria ou atualiza o usuário admin com senha `admin123`
3. ✅ Cria ou atualiza o usuário gestor com senha `admin123`
4. ✅ Limpa todos os caches do Laravel
5. ✅ Recria os caches necessários

**Isso deve resolver o problema!** 🎯

