# 🚨 Solução URGENTE: /gestao/login mostra página principal

## ❌ Problema Atual

Quando você acessa `https://clamatec.com/gestao/login`, está aparecendo a página principal (`index.html`) ao invés da página de login.

## ✅ Solução: Atualizar .htaccess com Regra Específica

### No cPanel File Manager:

1. **Vá até `public_html/`**
2. **Edite o arquivo `.htaccess`**
3. **SUBSTITUA TODO o conteúdo por este:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # PERMITIR acesso direto a arquivos e diretórios existentes
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # NÃO tocar em requisições para API
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]

  # NÃO tocar em assets do Next.js
  RewriteCond %{REQUEST_URI} ^/_next/
  RewriteRule ^ - [L]

  # REGRA ESPECÍFICA PARA /gestao/login (ANTES de qualquer outra regra)
  RewriteCond %{REQUEST_URI} ^/gestao/login/?$
  RewriteCond %{DOCUMENT_ROOT}/gestao/login.html -f
  RewriteRule ^(.*)$ /gestao/login.html [L]

  # Para outras rotas em subpastas: tentar adicionar .html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Último recurso: redirecionar para index.html apenas se não encontrou nada
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

4. **Salve o arquivo**
5. **Limpe o cache do navegador** (Ctrl+Shift+R ou Cmd+Shift+R)

---

## 🔑 Diferença Importante

A regra específica para login está **ANTES** das outras regras:

```apache
# REGRA ESPECÍFICA PARA /gestao/login (ANTES de qualquer outra regra)
RewriteCond %{REQUEST_URI} ^/gestao/login/?$
RewriteCond %{DOCUMENT_ROOT}/gestao/login.html -f
RewriteRule ^(.*)$ /gestao/login.html [L]
```

Isso garante que `/gestao/login` seja processado primeiro, antes que outras regras redirecionem para `index.html`.

---

## 🔍 Verificar se o Arquivo Existe

**IMPORTANTE:** Antes de tudo, verifique se o arquivo existe no servidor:

No cPanel File Manager:
1. Vá até `public_html/gestao/`
2. Confirme que `login.html` existe lá
3. Verifique o tamanho do arquivo (deve ter uns 11KB)

**Se o arquivo NÃO existir:**
- Você precisa fazer upload do arquivo `gestao/login.html` para `public_html/gestao/`

---

## ✅ Depois de Atualizar

1. **Teste acessar diretamente:**
   ```
   https://clamatec.com/gestao/login.html
   ```
   - Se funcionar: o arquivo existe, só precisa do `.htaccess`
   - Se não funcionar: o arquivo não foi feito upload

2. **Teste a rota:**
   ```
   https://clamatec.com/gestao/login
   ```
   - Deve mostrar a página de login agora!

---

## 🚨 Se Ainda Não Funcionar

### Opção 1: Criar .htaccess específico na pasta gestao/

1. No File Manager, vá até `public_html/gestao/`
2. Crie um arquivo `.htaccess` com:
   ```apache
   RewriteEngine On
   RewriteRule ^login/?$ login.html [L]
   ```

### Opção 2: Verificar se há outro .htaccess interferindo

1. Verifique se existe `.htaccess` em `public_html/gestao/`
2. Se existir, delete ou renomeie temporariamente

### Opção 3: Testar via SSH

Se tiver acesso SSH:

```bash
cd ~/public_html
# Verificar se arquivo existe
ls -la gestao/login.html

# Testar acesso direto
curl -I http://localhost/gestao/login.html
```

---

## 📋 Checklist

- [ ] Arquivo `gestao/login.html` existe em `public_html/`
- [ ] `.htaccess` foi atualizado com a nova regra específica
- [ ] Cache do navegador foi limpo
- [ ] Testou acessar `https://clamatec.com/gestao/login.html` diretamente
- [ ] Testou acessar `https://clamatec.com/gestao/login`

---

## 💡 Por Que a Regra Específica?

Colocar a regra específica **ANTES** das outras garante que `/gestao/login` seja processado primeiro, antes que qualquer outra regra redirecione para `index.html`.

A ordem das regras no `.htaccess` é importante! A primeira regra que "bater" será executada.

