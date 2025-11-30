# ✅ Correção: Erro 404 em `/gestao/dashboard`

## 🚨 Problema

O erro `GET https://clamatec.com/gestao/dashboard 404 (Not Found)` acontece porque o arquivo `.htaccess` está faltando ou não está redirecionando corretamente.

---

## ✅ SOLUÇÃO

O arquivo `.htaccess` foi recriado em `frontend/out/.htaccess`.

### Você precisa fazer upload do arquivo:

1. **Vá em cPanel → File Manager**
2. **Navegue até:** `public_html/`
3. **Faça upload** do arquivo `frontend/out/.htaccess`
4. **Substitua** o arquivo existente (se houver)

---

## 📋 Conteúdo do Arquivo

O arquivo `.htaccess` deve conter:

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

# Tentar adicionar .html para outras rotas (incluindo gestao/)
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

## 🧪 Testar

Depois do upload:

1. **Acesse:** `https://clamatec.com/gestao/dashboard`
   - ✅ Deve carregar a página do dashboard
   - ❌ Se ainda der 404, verifique se o arquivo foi enviado para o lugar certo

2. **Acesse:** `https://clamatec.com/gestao/login`
   - ✅ Deve funcionar

---

## 📤 Localização do Arquivo

**No seu computador:**
- `frontend/out/.htaccess` (já criado)

**No servidor:**
- `public_html/.htaccess` (você precisa fazer upload)

---

**Faça upload do arquivo e teste!** 🚀

