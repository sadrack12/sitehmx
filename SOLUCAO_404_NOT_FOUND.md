# 🔧 Solução: Erro 404 "Not Found" no cPanel

## ❌ Problema

Você está vendo:
```
Not Found
The requested URL was not found on this server.
Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request.
```

**Causa:** O servidor não está encontrando os arquivos ou o `.htaccess` não está funcionando corretamente.

---

## ✅ Solução Passo a Passo

### Passo 1: Verificar Estrutura de Arquivos no Servidor

No cPanel File Manager, verifique se os arquivos estão assim:

```
public_html/
├── .htaccess          ← DEVE existir!
├── index.html         ← DEVE existir!
├── 404.html
├── gestao/
│   ├── login.html     ← DEVE existir!
│   ├── dashboard.html
│   └── ...
├── _next/            ← Pasta com assets
│   └── static/
└── outros arquivos...
```

### Passo 2: Verificar se o .htaccess está no lugar certo

**IMPORTANTE:** O arquivo `.htaccess` deve estar em `public_html/` (raiz), não dentro de subpastas!

1. No File Manager, vá até `public_html/`
2. Ative "Show Hidden Files" nas configurações
3. Verifique se o arquivo `.htaccess` está lá

### Passo 3: Atualizar o .htaccess

**Substitua o conteúdo do `.htaccess` em `public_html/` por este:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Permitir acesso direto a arquivos e diretórios existentes
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Para rotas do Next.js, tentar encontrar o arquivo HTML correspondente
  # Exemplo: /gestao/login -> /gestao/login.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteRule ^(.+)$ $1.html [L]

  # Se não encontrou o arquivo .html, redirecionar para index.html
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

### Passo 4: Verificar Permissões

O arquivo `.htaccess` deve ter permissões `644`:

1. Clique com botão direito no `.htaccess`
2. Selecione "Change Permissions"
3. Configure para `644` (ou marque: Read+Write para proprietário, Read para outros)

### Passo 5: Testar Acesso Direto aos Arquivos

Teste acessar diretamente os arquivos HTML:

1. **Página inicial:**
   ```
   https://clamatec.com/index.html
   ```

2. **Página de login:**
   ```
   https://clamatec.com/gestao/login.html
   ```

Se esses funcionarem, o problema é apenas o `.htaccess`. Se não funcionarem, os arquivos não foram feitos upload corretamente.

---

## 🔍 Diagnóstico

### Teste 1: Arquivo existe?

No File Manager, verifique se existe:
- `public_html/gestao/login.html`

### Teste 2: Acessar diretamente

Tente acessar:
```
https://clamatec.com/gestao/login.html
```

**Se funcionar:** O problema é o `.htaccess`  
**Se não funcionar:** Os arquivos não foram feitos upload corretamente

### Teste 3: Verificar logs de erro

No cPanel:
1. Vá em "Errors" ou "Error Log"
2. Veja se há erros relacionados ao `.htaccess` ou arquivos não encontrados

---

## 🚨 Problemas Comuns

### 1. Arquivos estão dentro de uma subpasta

**Errado:**
```
public_html/
└── out/
    ├── index.html
    └── gestao/
```

**Correto:**
```
public_html/
├── index.html
└── gestao/
```

**Solução:** Mova todos os arquivos de `out/` para `public_html/`

### 2. .htaccess está na pasta errada

**Errado:** `public_html/out/.htaccess`  
**Correto:** `public_html/.htaccess`

### 3. Arquivos não foram feitos upload

**Solução:** Refazer upload completo da pasta `out/`

### 4. Permissões incorretas

**Solução:**
```bash
chmod 644 .htaccess
chmod 644 *.html
chmod 755 gestao/
```

---

## 📋 Checklist de Verificação

- [ ] Arquivo `.htaccess` existe em `public_html/`
- [ ] Conteúdo do `.htaccess` está correto (copiado acima)
- [ ] Permissões do `.htaccess` são `644`
- [ ] Arquivo `index.html` existe em `public_html/`
- [ ] Arquivo `gestao/login.html` existe
- [ ] Todos os arquivos de `out/` foram movidos para `public_html/`
- [ ] Pasta `_next/` existe em `public_html/`
- [ ] Testou acessar `https://clamatec.com/index.html` (deve funcionar)
- [ ] Testou acessar `https://clamatec.com/gestao/login.html` (deve funcionar)

---

## 🔄 Refazer Upload Completo (Se necessário)

Se nada funcionar, refaça o upload completo:

1. **No seu computador, compacte a pasta `out/`:**
   ```bash
   cd frontend
   zip -r frontend-build.zip out/
   ```

2. **No cPanel:**
   - Delete tudo dentro de `public_html/` (exceto `.htaccess` se quiser manter)
   - Faça upload do `frontend-build.zip`
   - Extraia o arquivo
   - **IMPORTANTE:** Mova todos os arquivos de `out/` para `public_html/`
   - Delete a pasta vazia `out/`
   - Atualize o `.htaccess` com o conteúdo acima

3. **Configure permissões:**
   - `.htaccess`: `644`
   - Arquivos HTML: `644`
   - Pastas: `755`

---

## ✅ Após Corrigir

Teste acessar:
- `https://clamatec.com/` (página inicial)
- `https://clamatec.com/gestao/login` (login)

Ambos devem funcionar!

---

## 💡 Dica Extra

Se ainda não funcionar, pode ser que o módulo `mod_rewrite` não esteja habilitado. Entre em contato com o suporte do hosting para verificar.

