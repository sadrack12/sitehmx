# 🚀 SOLUÇÃO RÁPIDA: Corrigir /gestao/login

## ✅ Arquivo Pronto

O arquivo `.htaccess` já está atualizado em `frontend/out/.htaccess`!

## 📤 Próximo Passo

**Faça upload do arquivo `.htaccess` atualizado para o servidor:**

1. **No cPanel File Manager**, vá em `public_html/`
2. **Edite o arquivo `.htaccess`**
3. **SUBSTITUA** por este conteúdo:

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

4. **Salve**
5. **Limpe cache do navegador**
6. **Teste:** `https://clamatec.com/gestao/login`

---

## 🔑 Mudança Importante

A regra do login agora usa caminho **absoluto** (`/gestao/login.html`) em vez de relativo.

---

## 📝 Se Não Funcionar

Veja o arquivo `SOLUCAO_FINAL_LOGIN.md` para soluções alternativas!

