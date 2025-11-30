# 📁 Estrutura Correta dos Arquivos .htaccess

## ✅ Estrutura Esperada

```
public_html/
├── .htaccess (FRONTEND - permite /api/ passar)
├── index.html (frontend)
├── gestao/
│   └── login.html
└── api/
    ├── .htaccess (API - redireciona para public/)
    └── public/
        ├── .htaccess (LARAVEL - processa rotas)
        └── index.php
```

---

## 📋 Arquivos .htaccess Necessários

### 1. `public_html/.htaccess` (FRONTEND)

**Função:** Redirecionar rotas do Next.js e deixar `/api/` passar

**Conteúdo:**
```apache
RewriteEngine On
RewriteBase /

# Redirect específico para login
RewriteCond %{REQUEST_URI} ^/gestao/login/?$
RewriteRule ^(.*)$ /gestao/login.html [L,R=301]

# Não tocar na API - DEIXAR PASSAR PARA LARAVEL
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# Se arquivo existe, servir diretamente
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Se diretório existe, servir diretamente
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Não tocar em assets do Next.js
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^ - [L]

# Tentar adicionar .html para outras rotas
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/_next/
RewriteCond %{REQUEST_URI} !^/gestao/login
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Fallback para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

### 2. `public_html/api/.htaccess` (API - LARAVEL)

**Função:** Redirecionar requisições para a pasta `public/` do Laravel

**Conteúdo:**
```apache
<IfModule mod_rewrite.c>
    Options +FollowSymLinks -Indexes
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

### 3. `public_html/api/public/.htaccess` (LARAVEL)

**Função:** Processar rotas do Laravel

**Conteúdo:** (já existe - não mexer)
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## ✅ Está Correto!

Ter 3 arquivos `.htaccess` é **CORRETO** e necessário:

1. **`public_html/.htaccess`** → Frontend (Next.js)
2. **`public_html/api/.htaccess`** → Redireciona para Laravel
3. **`public_html/api/public/.htaccess`** → Laravel (já existe)

---

## 🔍 Verificar

No servidor, você deve ter:

- [ ] `public_html/.htaccess` (frontend)
- [ ] `public_html/api/.htaccess` (redireciona para public/)
- [ ] `public_html/api/public/.htaccess` (Laravel - já existe)

**Todos os 3 são necessários!** ✅

