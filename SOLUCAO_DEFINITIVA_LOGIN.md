# ✅ Solução Definitiva: Rota /gestao/login

## 🔍 Diagnóstico

- ✅ `/galeria` funciona (está na raiz: `galeria.html`)
- ❌ `/gestao/login` não funciona (está em subpasta: `gestao/login.html`)

**Problema:** O `.htaccess` não está tratando corretamente rotas em subpastas.

---

## ✅ Solução Definitiva

### Atualizar o `.htaccess` no servidor

No cPanel File Manager, edite `public_html/.htaccess` e cole este conteúdo completo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Permitir acesso direto a arquivos existentes (não reescrever)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  # Permitir acesso direto a diretórios existentes (não reescrever)
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # NÃO reescrever requisições para a API (backend Laravel)
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]

  # NÃO reescrever assets do Next.js
  RewriteCond %{REQUEST_URI} ^/_next/
  RewriteRule ^ - [L]

  # Para rotas em subpastas: tentar adicionar .html
  # Exemplo: /gestao/login -> /gestao/login.html
  # Funciona para qualquer nível de subpasta
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Fallback: se não encontrou .html, redirecionar para index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Configurações de segurança
Options -Indexes

# Permitir acesso a arquivos estáticos
<FilesMatch "\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|txt|map)$">
  Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Configurações de compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# CORS para API (se necessário)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

---

## 🔑 Diferença Importante

A linha chave é:

```apache
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
RewriteRule ^(.*)$ $1.html [L]
```

Isso verifica se o arquivo HTML existe no caminho completo antes de tentar servir.

---

## ✅ Depois de Atualizar

1. **Salve o arquivo `.htaccess`**
2. **Limpe o cache do navegador** (Ctrl+Shift+R ou Cmd+Shift+R)
3. **Teste:**
   ```
   https://clamatec.com/gestao/login
   ```

Deve funcionar agora! 🎉

---

## 📋 Verificação

Confirme que:
- [ ] Arquivo `gestao/login.html` existe em `public_html/`
- [ ] `.htaccess` foi atualizado com o novo conteúdo
- [ ] Cache do navegador foi limpo
- [ ] Testou a rota `/gestao/login`

---

## 🎯 Por que funciona agora?

1. **Verifica arquivo existente:** `%{DOCUMENT_ROOT}%{REQUEST_URI}.html -f`
2. **Funciona para qualquer subpasta:** `/gestao/login`, `/sobre/organigrama`, etc.
3. **Não interfere com API:** `/api/` passa direto
4. **Não interfere com assets:** `/_next/` passa direto

