# 🔧 Solução: Erro 404 no cPanel - Rotas Next.js

## ❌ Problema

Você está vendo erro 404 ao acessar:
- `https://clamatec.com/gestao/login`
- Outras rotas do Next.js

**Causa:** O servidor Apache não está configurado corretamente para servir as páginas estáticas do Next.js.

---

## ✅ Solução Passo a Passo

### Passo 1: Verificar Estrutura de Arquivos

No cPanel File Manager, verifique se os arquivos estão assim:

```
public_html/
├── index.html
├── gestao/
│   ├── login.html  ← Deve existir!
│   ├── dashboard.html
│   └── ...
├── _next/
└── .htaccess  ← IMPORTANTE!
```

### Passo 2: Criar/Atualizar o arquivo `.htaccess`

**No cPanel File Manager:**

1. Navegue até `public_html/`
2. Clique em "New File"
3. Nome: `.htaccess`
4. Cole este conteúdo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirecionar requisições para arquivos que não existem para index.html
  # Isso permite que o Next.js gerencie o roteamento no cliente
  
  # Se o arquivo ou diretório não existir, redirecionar para index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Permitir acesso a arquivos estáticos
<FilesMatch "\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|txt)$">
  Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Configurações de segurança
<IfModule mod_headers.c>
  # Permitir CORS para API (se necessário)
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Prevenir listagem de diretórios
Options -Indexes

# Configurações de compressão (se mod_deflate estiver disponível)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

5. Salve o arquivo

### Passo 3: Verificar Permissões

O arquivo `.htaccess` deve ter permissões `644`:

```bash
chmod 644 .htaccess
```

### Passo 4: Testar

1. Acesse: `https://clamatec.com/gestao/login`
2. Deve carregar a página de login!

---

## 🔍 Verificações Adicionais

### Verificar se os arquivos foram feitos upload corretamente

No cPanel File Manager, verifique:

1. **Arquivo existe?**
   - `public_html/gestao/login.html` deve existir

2. **Estrutura correta?**
   - Todos os arquivos de `frontend/out/` devem estar em `public_html/`
   - A pasta `_next/` deve existir em `public_html/_next/`

### Se ainda não funcionar

#### Opção 1: Verificar se mod_rewrite está habilitado

No cPanel, verifique se o módulo `mod_rewrite` está habilitado. Geralmente está por padrão.

#### Opção 2: Testar diretamente o arquivo HTML

Tente acessar diretamente:
```
https://clamatec.com/gestao/login.html
```

Se funcionar, o problema é apenas o `.htaccess`.

#### Opção 3: Verificar logs de erro

No cPanel:
1. Vá em "Errors" ou "Error Log"
2. Veja se há erros relacionados ao `.htaccess`

---

## 📝 Estrutura Correta dos Arquivos

Após o upload, a estrutura deve ser:

```
public_html/
├── .htaccess          ← Arquivo de configuração Apache
├── index.html         ← Página inicial
├── 404.html           ← Página de erro
├── gestao/
│   ├── login.html     ← Página de login
│   ├── dashboard.html
│   ├── consultas.html
│   └── ...
├── _next/            ← Assets do Next.js
│   ├── static/
│   └── ...
└── outros arquivos...
```

---

## ⚠️ Problemas Comuns

### 1. "403 Forbidden" ao acessar `.htaccess`

- Verifique as permissões do arquivo
- Certifique-se que o arquivo começa com ponto (`.htaccess`)

### 2. Páginas carregam mas assets não (CSS/JS não funcionam)

- Verifique se a pasta `_next/` foi feita upload
- Verifique se os caminhos estão corretos no HTML

### 3. Rotas funcionam mas dão erro ao navegar

- Isso é normal com Next.js estático
- O roteamento é gerenciado pelo JavaScript no cliente
- Certifique-se que todos os arquivos JS foram feitos upload

---

## 🚀 Upload do `.htaccess` via FTP

Se preferir fazer upload via FTP:

1. **Crie o arquivo localmente:**
   ```bash
   # O arquivo já foi criado em: frontend/out/.htaccess
   ```

2. **Faça upload para `public_html/.htaccess`**

3. **Verifique as permissões:** `644`

---

## ✅ Checklist Final

- [ ] Arquivo `.htaccess` criado em `public_html/`
- [ ] Conteúdo do `.htaccess` está correto
- [ ] Permissões do arquivo: `644`
- [ ] Arquivo `gestao/login.html` existe
- [ ] Pasta `_next/` existe e tem conteúdo
- [ ] Testou acessar `https://clamatec.com/gestao/login`
- [ ] Página carrega corretamente

---

## 🎯 Próximo Passo

Depois que o `.htaccess` estiver configurado:

1. Acesse: `https://clamatec.com/gestao/login`
2. Faça login com o usuário que você criou
3. Teste outras rotas do sistema

---

## 📞 Se ainda não funcionar

1. Verifique os logs de erro do cPanel
2. Teste acessar diretamente: `https://clamatec.com/gestao/login.html`
3. Verifique se o `mod_rewrite` está habilitado no servidor
4. Entre em contato com o suporte do hosting se necessário

