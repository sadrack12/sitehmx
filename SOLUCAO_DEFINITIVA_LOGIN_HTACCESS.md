# ✅ Solução DEFINITIVA: .htaccess para /gestao/login

## ⚠️ IMPORTANTE: Ordem das Regras

A ordem no `.htaccess` é CRUCIAL! As regras são processadas de cima para baixo.

---

## ✅ Solução: .htaccess com Regra de Login PRIMEIRO

### No cPanel, edite `public_html/.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# ========================================
# REGRA ESPECÍFICA PARA LOGIN (MÁXIMA PRIORIDADE)
# ========================================
RewriteRule ^gestao/login/?$ /gestao/login.html [L]

# ========================================
# NÃO TOCAR EM API (deixa Laravel lidar)
# ========================================
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# ========================================
# SE ARQUIVO EXISTE, SERVIR DIRETAMENTE
# ========================================
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# ========================================
# SE DIRETÓRIO EXISTE, SERVIR DIRETAMENTE
# ========================================
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# ========================================
# NÃO TOCAR EM ASSETS DO NEXT.JS
# ========================================
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^ - [L]

# ========================================
# TENTAR ADICIONAR .html PARA OUTRAS ROTAS
# ========================================
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/_next/
RewriteCond %{REQUEST_URI}\.html -f
RewriteRule ^(.*)$ $1.html [L]

# ========================================
# FALLBACK: index.html
# ========================================
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## 🔑 Por Que Esta Versão Funciona

1. **Regra do login está PRIMEIRA** - processa ANTES de qualquer outra coisa
2. **Usa `[L]` sem redirect** - serve o arquivo diretamente (mais rápido)
3. **API não é tocada** - deixa Laravel funcionar
4. **Ordem correta** - processa na sequência lógica

---

## ✅ Passos

1. **Copie TODO o conteúdo acima**
2. **Cole no `.htaccess` em `public_html/`** (substitua tudo)
3. **Salve**
4. **Limpe cache do navegador**
5. **Teste:** `https://clamatec.com/gestao/login`

---

## 🚨 Se Ainda Não Funcionar

Pode ser que o `.htaccess` do Laravel (em `public_html/api/`) esteja interferindo.

**Me envie:**
1. Conteúdo do `.htaccess` em `public_html/`
2. Se existe `.htaccess` em `public_html/api/`
3. Estrutura exata de pastas no servidor

Com isso, posso criar uma solução ainda mais específica!

