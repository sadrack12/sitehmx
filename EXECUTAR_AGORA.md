# ⚡ EXECUTAR AGORA - Corrigir Login

## 🚨 Problema Identificado

O `DatabaseSeeder` usava `User::create()` que dá erro se o usuário já existe. Isso pode ter deixado o banco inconsistente.

## ✅ SOLUÇÃO IMEDIATA

Execute este comando COMPLETO no servidor (copie tudo):

```bash
cd ~/public_html/api && php artisan tinker --execute="
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Deletar duplicados
\$emails = ['admin@sitehmx.com', 'gestor@sitehmx.com'];
foreach (\$emails as \$email) {
    \$users = User::where('email', \$email)->get();
    if (\$users->count() > 1) {
        \$primeiro = \$users->first();
        User::where('email', \$email)->where('id', '!=', \$primeiro->id)->delete();
        echo '✅ Duplicados removidos: ' . \$email . PHP_EOL;
    }
}

// Garantir admin existe com senha conhecida
\$admin = User::updateOrCreate(
    ['email' => 'admin@sitehmx.com'],
    [
        'name' => 'Administrador',
        'password' => Hash::make('admin123'),
        'role' => 'admin'
    ]
);
echo '✅ Admin OK: ' . \$admin->email . PHP_EOL;

// Garantir gestor existe
\$gestor = User::updateOrCreate(
    ['email' => 'gestor@sitehmx.com'],
    [
        'name' => 'Gestor',
        'password' => Hash::make('admin123'),
        'role' => 'gestor'
    ]
);
echo '✅ Gestor OK: ' . \$gestor->email . PHP_EOL;

echo PHP_EOL . '🔑 CREDENCIAIS:' . PHP_EOL;
echo 'Admin: admin@sitehmx.com / admin123' . PHP_EOL;
echo 'Gestor: gestor@sitehmx.com / admin123' . PHP_EOL;
" && php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan config:cache && php artisan route:cache && echo "✅ PRONTO!"
```

---

## 🔑 Depois, faça login com:

- **Email:** `admin@sitehmx.com`
- **Senha:** `admin123`

---

## 📝 O que este comando faz:

1. ✅ Remove usuários duplicados
2. ✅ Garante que admin existe com senha `admin123`
3. ✅ Garante que gestor existe com senha `admin123`
4. ✅ Limpa e recria caches

**Execute agora e me diga se funcionou!** 🎯

