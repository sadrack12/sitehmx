# ⚡ INSTALAÇÃO RÁPIDA - Corrigir Login

## ✅ ARQUIVO PRONTO!

O arquivo `.htaccess` já está corrigido em `frontend/out/.htaccess`.

---

## 📤 PASSO ÚNICO: Upload do .htaccess

**No cPanel:**

1. Vá em **File Manager** → `public_html/`
2. **Edite** o arquivo `.htaccess`
3. **COPIE E COLE** este conteúdo:

```apache
RewriteEngine On

# REGRA ESPECÍFICA PARA LOGIN (PRIMEIRA - MÁXIMA PRIORIDADE)
RewriteRule ^gestao/login/?$ /gestao/login.html [L]

# NÃO TOCAR EM API
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# SE ARQUIVO EXISTE, SERVIR
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# SE DIRETÓRIO EXISTE, SERVIR
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# NÃO TOCAR EM ASSETS
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^ - [L]

# TENTAR ADICIONAR .html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/_next/
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
RewriteRule ^(.*)$ $1.html [L]

# FALLBACK
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

4. **Salve** (Ctrl+S)
5. **Limpe cache** do navegador (Ctrl+Shift+R)
6. **Teste:** `https://clamatec.com/gestao/login`

---

## ✅ PRONTO!

Agora `/gestao/login` deve funcionar! 🎉

---

## 📋 Se Não Funcionar

Veja o arquivo `SOLUCAO_FINAL_LOGIN.md` para mais opções!

