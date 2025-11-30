# 🔧 Corrigir: /gestao/login mostra página principal

## ❌ Problema

Ao acessar `https://clamatec.com/gestao/login`, ao invés de aparecer a página de login, está aparecendo a página principal (`index.html`).

**Causa:** O `.htaccess` está redirecionando todas as rotas para `index.html` ao invés de tentar carregar o arquivo HTML específico.

---

## ✅ Solução

### Atualizar o `.htaccess` no servidor

No cPanel File Manager:

1. **Vá até `public_html/`**
2. **Ative "Show Hidden Files"**
3. **Edite o arquivo `.htaccess`**
4. **Substitua TODO o conteúdo por este:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Permitir acesso direto a arquivos e diretórios existentes (não reescrever)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Não reescrever requisições para a API (backend Laravel)
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]

  # Não reescrever assets do Next.js
  RewriteCond %{REQUEST_URI} ^/_next/
  RewriteRule ^ - [L]

  # Tentar adicionar .html à URL se o arquivo existir
  # Exemplo: /gestao/login -> /gestao/login.html
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]

  # Se não encontrou arquivo .html, redirecionar para index.html (SPA fallback)
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

5. **Salve o arquivo**
6. **Limpe o cache do navegador** (Ctrl+Shift+R ou Cmd+Shift+R)

---

## 🔍 Como Funciona Agora

A nova configuração do `.htaccess` funciona assim:

1. **Primeiro:** Se o arquivo ou diretório existir diretamente, serve normalmente
2. **Segundo:** Se a requisição for para `/api/` ou `/_next/`, não reescreve (deixa passar)
3. **Terceiro:** Tenta adicionar `.html` à URL se o arquivo existir
   - `/gestao/login` → verifica se `gestao/login.html` existe → serve o arquivo
4. **Último:** Se nada funcionar, redireciona para `index.html` (fallback)

---

## ✅ Testar

Depois de atualizar o `.htaccess`:

1. **Limpe o cache do navegador:**
   - Chrome/Edge: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5 ou Cmd+Shift+R

2. **Acesse:**
   ```
   https://clamatec.com/gestao/login
   ```

3. **Deve aparecer a página de login!** 🎉

---

## 🔍 Verificar se o Arquivo Existe

No cPanel File Manager, verifique se o arquivo existe:

```
public_html/gestao/login.html
```

**Se não existir**, você precisa refazer o upload da pasta `out/` completa.

---

## 📋 Checklist

- [ ] `.htaccess` atualizado com o novo conteúdo
- [ ] Arquivo `gestao/login.html` existe em `public_html/`
- [ ] Cache do navegador limpo
- [ ] Testou acessar `https://clamatec.com/gestao/login`
- [ ] Página de login aparece corretamente

---

## 🚨 Se Ainda Não Funcionar

### Teste 1: Acessar diretamente o arquivo HTML

Tente acessar:
```
https://clamatec.com/gestao/login.html
```

- **Se funcionar:** O problema é só o `.htaccess`
- **Se não funcionar:** O arquivo não foi feito upload ou está em lugar errado

### Teste 2: Verificar estrutura

No File Manager, confirme:
```
public_html/
├── gestao/
│   └── login.html  ← Deve existir aqui!
```

**Se não estiver lá:**
- Os arquivos podem estar em `public_html/out/gestao/login.html`
- Você precisa mover todos os arquivos de `out/` para `public_html/`

---

## ✅ Após Corrigir

Você deve conseguir:
- ✅ Acessar `https://clamatec.com/gestao/login` → Ver página de login
- ✅ Acessar `https://clamatec.com/` → Ver página principal
- ✅ Navegar entre as páginas normalmente

---

## 💡 Diferença da Configuração Anterior

**Antes:**
- Redirecionava tudo para `index.html` imediatamente

**Agora:**
- Tenta primeiro encontrar o arquivo HTML específico
- Só redireciona para `index.html` se não encontrar nada

Isso permite que o Next.js estático funcione corretamente com rotas específicas!

