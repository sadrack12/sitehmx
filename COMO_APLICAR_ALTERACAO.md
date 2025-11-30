# 📤 Como Aplicar a Alteração

## ✅ Arquivo que Precisa ser Atualizado

`backend/app/Providers/AppServiceProvider.php`

---

## 📋 Método 1: Via cPanel File Manager (Mais Fácil)

### Passo 1: Encontrar o Arquivo

1. **Acesse o cPanel**
2. **Vá em "File Manager"** (ou "Gerenciador de Arquivos")
3. **Navegue até:** `public_html/api/app/Providers/`
4. **Encontre o arquivo:** `AppServiceProvider.php`

### Passo 2: Editar o Arquivo

1. **Clique com botão direito** em `AppServiceProvider.php`
2. **Clique em "Edit"** (ou "Editar")
3. **Substitua o conteúdo** pelo conteúdo corrigido abaixo:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadRoutes();
    }

    protected function loadRoutes(): void
    {
        // Carregar rotas da API com prefixo 'api'
        Route::prefix('api')->group(function () {
            if (file_exists(base_path('routes/api.php'))) {
                require base_path('routes/api.php');
            }
        });
        
        if (file_exists(base_path('routes/web.php'))) {
            require base_path('routes/web.php');
        }
    }
}
```

4. **Salve o arquivo**

---

## 📋 Método 2: Via Upload do Arquivo

### Passo 1: Baixar o Arquivo do Seu Computador

O arquivo já está corrigido em:
`/Users/sadraquemassala/sitehmx/backend/app/Providers/AppServiceProvider.php`

### Passo 2: Fazer Upload

1. **No cPanel, vá em "File Manager"**
2. **Navegue até:** `public_html/api/app/Providers/`
3. **Clique em "Upload"**
4. **Selecione o arquivo:** `AppServiceProvider.php` do seu computador
5. **Sobrescreva o arquivo existente**

---

## 🔧 Passo 3: Limpar Cache do Laravel

### Via Terminal do cPanel:

1. **Acesse "Terminal" no cPanel** (ou use SSH)
2. **Execute os comandos:**

```bash
cd ~/public_html/api
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### Via File Manager (alternativa):

Se não tiver acesso ao Terminal, você pode criar um arquivo temporário:

1. **Crie um arquivo** `limpar-cache.php` em `public_html/api/`
2. **Cole este conteúdo:**

```php
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('route:clear');
$kernel->call('config:clear');
$kernel->call('cache:clear');
echo "Cache limpo com sucesso!";
```

3. **Acesse no navegador:** `https://clamatec.com/api/limpar-cache.php`
4. **Delete o arquivo** depois de usar (por segurança)

---

## 🧪 Passo 4: Testar

1. **Acesse:** `https://clamatec.com/api/noticias`
   - ✅ Deve retornar JSON com notícias
   - ❌ Se ainda der 404, me diga o erro

2. **Teste o login:**
   - Acesse: `https://clamatec.com/gestao/login`
   - Tente fazer login

---

## 📝 Checklist

- [ ] Arquivo `AppServiceProvider.php` atualizado no servidor
- [ ] Cache do Laravel limpo
- [ ] Testado `/api/noticias` (deve funcionar)
- [ ] Testado login (deve funcionar)

---

**Siga os passos e me diga se funcionou!** 🚀

