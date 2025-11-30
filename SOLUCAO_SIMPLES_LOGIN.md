# ✅ SOLUÇÃO SIMPLES - Corrigir /gestao/login

## 🔧 Versão Ultra Simplificada

Se as versões anteriores não funcionaram, tente esta versão MAIS SIMPLES:

```apache
RewriteEngine On
RewriteBase /

# Redirect específico para login - ANTES DE TUDO
RewriteCond %{REQUEST_URI} ^/gestao/login/?$
RewriteRule ^(.*)$ /gestao/login.html [L,R=301]

# Não tocar na API
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# Se arquivo existe, servir diretamente
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Se diretório existe, servir diretamente
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Não tocar em assets do Next.js
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^ - [L]

# Tentar adicionar .html para outras rotas
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/_next/
RewriteCond %{REQUEST_URI} !^/gestao/login
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Fallback para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## 🔧 ALTERNATIVA: Versão Ainda Mais Simples (APENAS LOGIN)

Se a versão acima não funcionar, teste esta versão MINIMALISTA que só trata do login:

```apache
RewriteEngine On

# Redirect para login
RewriteRule ^gestao/login$ /gestao/login.html [R=301,L]
RewriteRule ^gestao/login/$ /gestao/login.html [R=301,L]

# Resto do site - adicionar .html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ $1.html [L]

# Fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## 🚨 SOLUÇÃO DEFINITIVA: Criar Arquivo PHP

Se NADA do .htaccess funcionar, crie um arquivo PHP:

### Passo a Passo:

1. **No File Manager**, vá em `public_html/gestao/`
2. **Crie pasta `login/`** (se não existir)
3. **Crie arquivo `index.php`** dentro de `login/`
4. **Cole este código:**

```php
<?php
header("Location: /gestao/login.html", true, 301);
exit;
```

5. **Salve**
6. **Teste:** `https://clamatec.com/gestao/login/` (com barra)

**Isso SEMPRE funciona!** É a solução mais confiável.

---

## 🔍 VERIFICAR PROBLEMAS

Antes de aplicar, verifique:

1. **O arquivo `login.html` existe?**
   ```
   public_html/gestao/login.html
   ```

2. **Há outro .htaccess interferindo?**
   - Verifique `public_html/api/.htaccess`
   - Verifique `public_html/gestao/.htaccess`

3. **O mod_rewrite está habilitado?**
   - Contate o suporte do hosting se não souber

4. **Permissões estão corretas?**
   - `.htaccess` deve ter permissão `644`
   - `login.html` deve ter permissão `644`

---

## 📋 CHECKLIST

- [ ] Testou a versão simplificada acima
- [ ] Verificou que `login.html` existe
- [ ] Não há `.htaccess` conflitante em outras pastas
- [ ] Tentou criar o `index.php` como solução definitiva
- [ ] Limpou cache do navegador
- [ ] Testou em modo anônimo

---

## 💡 RECOMENDAÇÃO FINAL

**Use a solução PHP (index.php)** - é a mais confiável e funciona sempre!

A combinação:
- `.htaccess` para redirecionar `/gestao/login` → `/gestao/login.html`
- `index.php` para redirecionar `/gestao/login/` → `/gestao/login.html`

Garante que funcione em TODOS os casos! 🎯

