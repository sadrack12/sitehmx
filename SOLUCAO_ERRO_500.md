# 🚨 Solução: Erro 500 Internal Server Error

## ❌ Problema

Ao acessar `https://clamatec.com/gestao/login.html` você está vendo:
```
Internal Server Error
The server encountered an internal error or misconfiguration
```

**Causa:** Erro no arquivo `.htaccess` ou conflito de configuração.

---

## ✅ Solução: Simplificar o .htaccess

O `.htaccess` pode estar com sintaxe incorreta ou usando módulos não disponíveis.

### Opção 1: Usar .htaccess Simplificado (RECOMENDADO)

No cPanel File Manager:

1. **Vá até `public_html/`**
2. **Edite o arquivo `.htaccess`**
3. **SUBSTITUA TODO o conteúdo por este (versão simplificada):**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Permitir acesso direto a arquivos existentes
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Permitir acesso direto a diretórios
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Não tocar na API
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]
  
  # Não tocar nos assets
  RewriteCond %{REQUEST_URI} ^/_next/
  RewriteRule ^ - [L]
  
  # Tentar adicionar .html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{REQUEST_URI}\.html -f
  RewriteRule ^(.*)$ $1.html [L]
  
  # Fallback para index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

4. **Salve o arquivo**
5. **Teste novamente**

---

### Opção 2: Remover .htaccess Temporariamente (Para Teste)

Para verificar se o problema é o `.htaccess`:

1. **Renomeie o arquivo `.htaccess` para `.htaccess.backup`**

2. **Teste acessar:**
   ```
   https://clamatec.com/gestao/login.html
   ```
   
   - Se funcionar: O problema é o `.htaccess`
   - Se ainda der erro: O problema é outra coisa (permissões, arquivo corrompido, etc.)

3. **Se funcionou**, restaure o `.htaccess` com a versão simplificada acima

---

### Opção 3: Verificar Logs de Erro

No cPanel:

1. Vá em "Errors" ou "Error Log"
2. Veja qual é o erro exato relacionado ao `.htaccess`
3. Isso ajudará a identificar o problema específico

---

## 🔍 Verificações Importantes

### 1. Verificar se o arquivo existe e não está corrompido

No File Manager:
- Vá até `public_html/gestao/login.html`
- Verifique se o arquivo abre corretamente
- Tamanho: aproximadamente 11KB

### 2. Verificar Permissões

Todos os arquivos HTML devem ter permissão `644`:
```bash
chmod 644 gestao/login.html
```

### 3. Verificar se há .htaccess dentro de gestao/

Se você criou um `.htaccess` dentro de `public_html/gestao/`, pode estar causando conflito:

1. Renomeie temporariamente: `gestao/.htaccess` → `gestao/.htaccess.backup`
2. Teste novamente

---

## 📋 Passos para Resolver

1. **Backup do .htaccess atual:**
   - Renomeie `public_html/.htaccess` para `.htaccess.old`

2. **Crie novo .htaccess simplificado:**
   - Use o conteúdo da Opção 1 acima

3. **Remova .htaccess de subpastas:**
   - Se existir `public_html/gestao/.htaccess`, delete ou renomeie

4. **Teste acesso direto:**
   ```
   https://clamatec.com/gestao/login.html
   ```

5. **Se funcionar, teste a rota:**
   ```
   https://clamatec.com/gestao/login
   ```

---

## ⚠️ Possíveis Causas do Erro 500

1. **Sintaxe incorreta no .htaccess**
   - Solução: Use a versão simplificada acima

2. **Módulo mod_rewrite não habilitado**
   - Normalmente está habilitado no cPanel, mas pode verificar com suporte

3. **Conflito com outro .htaccess**
   - Verifique se há `.htaccess` em subpastas

4. **Permissões incorretas**
   - `.htaccess` deve ser `644`
   - Arquivos HTML devem ser `644`

5. **Uso de módulos não disponíveis**
   - Evite usar `mod_headers` ou `mod_deflate` se não estiverem habilitados

---

## ✅ .htaccess Mínimo e Funcional

Se nada funcionar, use esta versão MÍNIMA:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI}\.html -f
RewriteRule ^(.*)$ $1.html [L]
```

Isso apenas adiciona `.html` às rotas, sem outras configurações.

---

## 🎯 Próximos Passos

1. Simplifique o `.htaccess` (Opção 1)
2. Remova qualquer `.htaccess` de subpastas
3. Teste acesso direto ao arquivo HTML
4. Se ainda der erro 500, verifique os logs de erro no cPanel

