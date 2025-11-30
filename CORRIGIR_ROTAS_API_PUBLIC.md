# 🔧 Corrigir Rotas: Remover Prefixo /public/

## 🔍 Problema Identificado

- Rota registrada: `public/noticias`
- Você acessa: `https://clamatec.com/api/public/noticias`
- Laravel recebe: `/noticias` (não `/public/noticias`)
- Resultado: 404 ❌

**Solução:** Remover o prefixo `/public/` das rotas, já que você já acessa via `/api/public/`.

---

## ✅ SOLUÇÃO: Editar routes/api.php

No servidor, edite o arquivo:

```bash
cd ~/public_html/api
nano routes/api.php
```

**ALTERE todas as rotas que começam com `/public/`:**

### Rotas para Alterar:

**DE:**
```php
Route::get('/public/noticias', [PublicController::class, 'noticias']);
Route::get('/public/eventos', [PublicController::class, 'eventos']);
Route::get('/public/hero-slides', [PublicController::class, 'heroSlides']);
Route::get('/public/corpo-diretivo', [PublicController::class, 'corpoDiretivo']);
Route::get('/public/mensagem-director', [PublicController::class, 'mensagemDirector']);
Route::get('/public/especialidades', [PublicController::class, 'especialidades']);
Route::post('/public/buscar-paciente', ...);
Route::post('/public/criar-paciente', ...);
Route::post('/public/verificar-consulta-existente', ...);
Route::post('/public/agendar', ...);
Route::get('/public/consulta-online/{id}', ...);
Route::post('/public/consulta-online/buscar', ...);
Route::get('/public/daily/{consultaId}/token', ...);
Route::get('/public/consultas/{id}/documentos', ...);
Route::get('/public/consultas/{id}/prescricao', ...);
Route::get('/public/consultas/{id}/requisicao-exames', ...);
Route::get('/public/consultas/{id}/recibo', ...);
```

**PARA:**
```php
Route::get('/noticias', [PublicController::class, 'noticias']);
Route::get('/eventos', [PublicController::class, 'eventos']);
Route::get('/hero-slides', [PublicController::class, 'heroSlides']);
Route::get('/corpo-diretivo', [PublicController::class, 'corpoDiretivo']);
Route::get('/mensagem-director', [PublicController::class, 'mensagemDirector']);
Route::get('/especialidades', [PublicController::class, 'especialidades']);
Route::post('/buscar-paciente', ...);
Route::post('/criar-paciente', ...);
Route::post('/verificar-consulta-existente', ...);
Route::post('/agendar', ...);
Route::get('/consulta-online/{id}', ...);
Route::post('/consulta-online/buscar', ...);
Route::get('/daily/{consultaId}/token', ...);
Route::get('/consultas/{id}/documentos', ...);
Route::get('/consultas/{id}/prescricao', ...);
Route::get('/consultas/{id}/requisicao-exames', ...);
Route::get('/consultas/{id}/recibo', ...);
```

**Basicamente:** Remova `/public/` de todas as rotas públicas.

**Salve:** `Ctrl+X`, `Y`, `Enter`

**Depois:**
```bash
php artisan route:clear
php artisan route:cache
```

**Teste:**
```
https://clamatec.com/api/public/noticias
```

---

**Remova `/public/` de todas as rotas em routes/api.php!** ✅

