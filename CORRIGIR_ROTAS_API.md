# 🔧 Corrigir Configuração de Rotas da API

## 🔍 Problema Identificado

As rotas estão sendo registradas com prefixo `api/`, mas você está acessando via `/api/public/`, causando conflito.

---

## ✅ Solução: Remover Prefixo Duplicado

Como você já está acessando via `/api/public/`, não precisa do prefixo `api/` adicional nas rotas.

### Opção 1: Remover Prefixo do AppServiceProvider (Recomendado)

Edite o arquivo `app/Providers/AppServiceProvider.php` no servidor:

```bash
cd ~/public_html/api
nano app/Providers/AppServiceProvider.php
```

**Altere de:**
```php
Route::prefix('api')->group(function () {
    if (file_exists(base_path('routes/api.php'))) {
        require base_path('routes/api.php');
    }
});
```

**Para:**
```php
if (file_exists(base_path('routes/api.php'))) {
    require base_path('routes/api.php');
}
```

**Salve:** `Ctrl+X`, `Y`, `Enter`

**Depois:**
```bash
php artisan route:clear
php artisan route:cache
```

---

## 🧪 Testar Depois da Correção

As URLs corretas serão:

```
https://clamatec.com/api/public/noticias
https://clamatec.com/api/public/eventos
https://clamatec.com/api/public/corpo-diretivo
```

---

## 📋 Passo a Passo Completo

```bash
cd ~/public_html/api

# 1. Editar AppServiceProvider
nano app/Providers/AppServiceProvider.php

# 2. Remover a linha Route::prefix('api')->group(function () {
# 3. Remover o fechamento })
# 4. Deixar apenas o require direto

# 5. Salvar (Ctrl+X, Y, Enter)

# 6. Limpar e recriar cache
php artisan route:clear
php artisan config:clear
php artisan route:cache

# 7. Verificar rotas
php artisan route:list | grep public | head -5
```

---

**Edite o AppServiceProvider para remover o prefixo 'api'!** ✅

