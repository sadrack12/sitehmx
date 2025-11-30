# 🔧 Recriar .htaccess

## ⚠️ Problema

O arquivo `.htaccess` foi deletado ou não está visível no `public_html/`.

---

## ✅ SOLUÇÃO

**Arquivo recriado localmente:** `frontend/out/.htaccess`

---

## 🚀 APLICAR NO SERVIDOR

### Via cPanel File Manager:

1. **Acesse:** cPanel → File Manager
2. **Vá em:** `public_html/`
3. **Clique em:** "New File"
4. **Nome:** `.htaccess`
5. **Cole o conteúdo abaixo:**

```apache
RewriteEngine On
RewriteBase /

# REGRA ESPECÍFICA PARA LOGIN (PRIMEIRA - MÁXIMA PRIORIDADE)
RewriteRule ^gestao/login/?$ /gestao/login.html [L,R=301]

# Não tocar na API
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

6. **Salve o arquivo**

### Via FTP/SFTP:

1. **Faça upload de:** `frontend/out/.htaccess`
2. **Para:** `public_html/.htaccess`

---

## ⚠️ IMPORTANTE

**Se o arquivo não aparecer no File Manager:**

1. **Ative "Show Hidden Files"** no File Manager
2. **OU use FTP/SFTP** para fazer upload

---

## ✅ Verificar

**Após criar o arquivo, teste:**

1. **Acesse:** `https://clamatec.com/gestao/login`
2. **Deve funcionar corretamente**

---

**Crie o arquivo `.htaccess` no servidor AGORA!** 🚀

