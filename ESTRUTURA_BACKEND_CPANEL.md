# 🔧 Ajustar Estrutura do Backend no cPanel

## 📍 Estrutura Atual Detectada

Você está em: `/home1/ebvutbmy/public_html/api/backend/`

Isso significa que o Laravel está em uma subpasta `backend/` dentro de `api/`.

## ✅ Estruturas Possíveis

### Opção A: Laravel Diretamente em `api/` (Recomendado)

```
public_html/
└── api/
    ├── app/
    ├── config/
    ├── public/     ← Entry point aqui
    ├── composer.json
    └── ...
```

**Vantagem:** Mais simples, API acessível em `/api/public/`

### Opção B: Laravel em `api/backend/` (Sua situação atual)

```
public_html/
└── api/
    └── backend/
        ├── app/
        ├── config/
        ├── public/     ← Entry point aqui
        ├── composer.json
        └── ...
```

**Vantagem:** Mantém organização, mas requer configuração extra

---

## 🔧 SOLUÇÃO: Corrigir Estrutura

### Opção 1: Mover Arquivos para `api/` (Mais Simples)

Se você quer simplificar, mova os arquivos um nível acima:

```bash
# No servidor
cd ~/public_html/api/backend

# Mover tudo para um nível acima
mv app bootstrap config database public routes storage resources artisan composer.json composer.lock .. 2>/dev/null || true

# Voltar para api/
cd ~/public_html/api

# Remover pasta backend vazia (se estiver vazia)
rmdir backend 2>/dev/null || echo "Pasta backend ainda tem arquivos"
```

Depois continue em `~/public_html/api/`:

```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev --no-scripts
```

### Opção 2: Manter em `backend/` e Ajustar Configuração

Se preferir manter a estrutura atual, você precisa configurar o acesso corretamente:

**Estrutura mantida:**
```
public_html/api/backend/public/  ← Acesso deve ser aqui
```

**Configurar subdomínio ou redirecionamento:**

1. **Criar subdomínio:**
   - cPanel → Subdomains
   - Criar: `api.seudominio.com`
   - Document Root: `public_html/api/backend/public`

2. **Ou configurar redirecionamento no `.htaccess` de `public_html/api/`:**

```apache
# Redirecionar /api/* para /api/backend/public/*
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api/backend/public/
RewriteRule ^api/(.*)$ /api/backend/public/$1 [L]
```

---

## 🎯 RECOMENDAÇÃO: Opção 1 (Mover Arquivos)

É mais simples e evita problemas de configuração. Execute:

```bash
# 1. Ir para onde está o Laravel
cd ~/public_html/api/backend

# 2. Mover arquivos para um nível acima
mv app bootstrap config database public resources routes storage artisan composer.json composer.lock ~/public_html/api/

# 3. Verificar se moveu
cd ~/public_html/api
ls -la

# 4. Deve ver: app/, config/, public/, composer.json, etc.

# 5. Agora instalar dependências
composer install --optimize-autoloader --no-dev --no-scripts
composer dump-autoload --optimize
```

---

## 📋 Checklist de Estrutura

Verifique se após mover você tem:

```
~/public_html/api/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/          ← Entry point
│   ├── index.php
│   └── .htaccess
├── routes/
├── storage/
├── artisan
├── composer.json
└── .env (você criará)
```

---

## ⚙️ Depois de Corrigir a Estrutura

1. **Instalar dependências:**
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev --no-scripts
   composer dump-autoload --optimize
   ```

2. **Configurar .env:**
   ```bash
   cp .env.example .env  # Se existir
   # Ou criar manualmente
   ```

3. **Configurar permissões:**
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

4. **Executar migrações:**
   ```bash
   php artisan migrate --force
   ```

---

## 🚀 Próximos Passos

1. Escolha uma opção acima
2. Execute os comandos
3. Continue com a instalação do Composer
4. Configure o acesso à API

---

**Recomendo a Opção 1 (mover arquivos) para simplificar!** ✅

