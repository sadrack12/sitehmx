# 🚨 Solução Rápida: Erro 500 no .htaccess

## ❌ Problema

Erro 500 ao acessar qualquer arquivo HTML significa que o `.htaccess` tem um erro de sintaxe ou está usando módulos não disponíveis.

## ✅ Solução: Usar .htaccess Mínimo

### No cPanel File Manager:

1. **Vá até `public_html/`**
2. **Edite o arquivo `.htaccess`**
3. **SUBSTITUA TODO o conteúdo por este (versão MÍNIMA):**

```apache
RewriteEngine On

# Permitir acesso direto a arquivos e diretórios
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Não tocar na API
RewriteCond %{REQUEST_URI} ^/api/
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
```

4. **Salve o arquivo**
5. **Configure permissões: `644`**

---

## 🔍 Verificar Logs de Erro

Para identificar o problema exato:

1. No cPanel, vá em "Errors" ou "Error Log"
2. Veja a mensagem de erro completa
3. Isso dirá exatamente o que está errado

---

## ⚠️ Se ainda der erro 500

### Opção 1: Remover .htaccess completamente

1. **Renomeie `.htaccess` para `.htaccess.backup`**
2. **Teste acessar:**
   ```
   https://clamatec.com/gestao/login.html
   ```
   
   - Se funcionar: O problema é o `.htaccess`
   - Se não funcionar: O problema é outra coisa

3. **Se funcionou**, restaure com a versão mínima acima

### Opção 2: Verificar se arquivo está corrompido

1. No File Manager, abra `gestao/login.html`
2. Veja se o conteúdo está correto
3. Se estiver vazio ou corrompido, refaça upload

---

## ✅ Após Corrigir

Teste:
1. `https://clamatec.com/gestao/login.html` (deve funcionar)
2. `https://clamatec.com/gestao/login` (deve funcionar)

---

## 📝 Nota

A versão mínima remove:
- Configurações de cache
- Configurações de compressão
- Headers CORS
- Outras configurações avançadas

Mantém apenas o essencial para o roteamento funcionar.

