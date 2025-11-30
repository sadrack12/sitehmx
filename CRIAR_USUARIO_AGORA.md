# ✅ Criar Usuário de Teste AGORA

## 🎯 Método Rápido (Recomendado)

Execute este comando no servidor:

```bash
cd ~/public_html/api
php artisan db:seed --class=CriarUsuarioTesteSeeder
```

Este seeder verifica se o usuário já existe antes de criar, então não dará erro de duplicação.

---

## 🔑 Credenciais Criadas

- **Email:** `admin@sitehmx.com`
- **Senha:** `admin123`
- **Role:** `admin`

---

## 🔄 Se o Usuário Já Existe

Se você receber a mensagem "Usuário já existe!", você pode:

### Opção 1: Resetar a senha do usuário existente

```bash
cd ~/public_html/api
php artisan tinker
```

Depois execute:
```php
$user = \App\Models\User::where('email', 'admin@sitehmx.com')->first();
$user->password = bcrypt('admin123');
$user->save();
echo "✅ Senha resetada para: admin123";
exit
```

### Opção 2: Ver usuários existentes

```bash
cd ~/public_html/api
php artisan tinker
```

Depois execute:
```php
\App\Models\User::all(['id', 'name', 'email', 'role'])->toArray();
exit
```

---

## 📝 Usuários Criados pelo DatabaseSeeder

Quando você executou `php artisan db:seed`, foram criados:
- **Email:** `admin@sitehmx.com` | **Senha:** `password`
- **Email:** `gestor@sitehmx.com` | **Senha:** `password`

Se esses usuários já existiam, pode ter dado erro de duplicação. Use o método acima para resetar a senha ou criar novos.

---

## ✅ Teste o Login

1. Acesse: `https://clamatec.com/gestao/login`
2. Use as credenciais:
   - Email: `admin@sitehmx.com`
   - Senha: `admin123` (ou `password` se foi criado pelo DatabaseSeeder)

---

## 🚨 Qual Erro Apareceu?

Me diga qual erro específico você viu para eu ajudar melhor!

Possíveis erros:
- ❌ "Integrity constraint violation" → Usuário já existe
- ❌ "Class not found" → Seeder não encontrado
- ❌ Outro erro? → Me diga qual!

