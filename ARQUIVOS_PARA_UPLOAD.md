# 📤 Arquivos para Upload no Servidor

## 🎯 Dois Arquivos .htaccess Necessários

### 1. Frontend: `public_html/.htaccess`

**Localização local:** `frontend/out/.htaccess`

**Conteúdo:**
```apache
RewriteEngine On
RewriteBase /

# Redirect específico para login - ANTES DE TUDO
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

### 2. API Laravel: `public_html/api/.htaccess`

**Localização local:** `backend/.htaccess`

**Conteúdo:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

## 📋 Passo a Passo

### 1. Upload do Frontend

No cPanel File Manager:
- Vá em `public_html/`
- Faça upload de `frontend/out/.htaccess`
- Ou copie e cole o conteúdo acima

### 2. Upload da API

No cPanel File Manager:
- Vá em `public_html/api/`
- Crie arquivo `.htaccess`
- Cole o conteúdo acima (da API)
- Salve

---

## ✅ Depois do Upload

1. **Teste:** `https://clamatec.com/api/`
   - Deve aparecer mensagem do Laravel

2. **Teste:** `https://clamatec.com/gestao/login`
   - Deve aparecer página de login

3. **Tente fazer login**

---

## 🚨 Se Não Funcionar

Me diga o que aparece quando acessa `https://clamatec.com/api/` no navegador.

**Os dois arquivos estão prontos! Faça upload e teste!** 🚀

