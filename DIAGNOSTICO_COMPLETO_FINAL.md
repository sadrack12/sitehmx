# 🔍 Diagnóstico Completo - Solução para /gestao/login

## ✅ O que sabemos:

- ✅ `https://clamatec.com/gestao/login.html` **FUNCIONA**
- ❌ `https://clamatec.com/gestao/login` **NÃO FUNCIONA** (mostra página principal)

**Conclusão:** O `.htaccess` não está redirecionando `/gestao/login` para `login.html`.

---

## 🔧 Soluções Possíveis

### Solução 1: .htaccess Corrigido (RECOMENDADO)

#### No cPanel File Manager:

1. Vá em `public_html/.htaccess`
2. **SUBSTITUA TODO o conteúdo** por:

```apache
RewriteEngine On
RewriteBase /

# REGRA ESPECÍFICA PARA LOGIN (DEVE ESTAR PRIMEIRO!)
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
RewriteCond %{REQUEST_URI}\.html -f
RewriteRule ^(.*)$ $1.html [L]

# FALLBACK
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

3. **Salve**
4. **Limpe cache do navegador** (Ctrl+Shift+R ou Cmd+Shift+R)

---

### Solução 2: Criar Arquivo index.php (Se .htaccess não funcionar)

Se o `.htaccess` não funcionar, podemos criar um arquivo PHP que faz o redirect:

#### No cPanel File Manager:

1. **Crie pasta:** `public_html/gestao/login/` (se não existir)
2. **Crie arquivo:** `public_html/gestao/login/index.php`

Com este conteúdo:

```php
<?php
header("Location: /gestao/login.html", true, 301);
exit;
```

3. **Salve**

**Nota:** Isso funciona, mas não é ideal porque cria um arquivo extra.

---

### Solução 3: Usar JavaScript no index.html

Se nada funcionar, podemos adicionar JavaScript no `index.html` que redireciona:

No arquivo `public_html/index.html`, adicione antes de `</body>`:

```html
<script>
// Redirect para login se necessário
if (window.location.pathname === '/gestao/login') {
  window.location.href = '/gestao/login.html';
}
</script>
```

Mas isso também não é ideal...

---

## 🔍 Diagnóstico: Verificar o Que Está Acontecendo

### Passo 1: Verificar .htaccess no Servidor

No cPanel File Manager:

1. Vá em `public_html/`
2. Ative "Show Hidden Files" (para ver `.htaccess`)
3. **Me envie o conteúdo completo do `.htaccess`**

### Passo 2: Verificar Estrutura de Pastas

No cPanel File Manager:

1. Vá em `public_html/gestao/`
2. **Me confirme:**
   - ✅ Existe arquivo `login.html`?
   - ❓ Existe pasta `login/`?

### Passo 3: Verificar se há Outros .htaccess

Verifique se existem arquivos `.htaccess` em:
- `public_html/api/` (pode interferir)
- `public_html/gestao/` (não deve existir)

### Passo 4: Verificar Logs de Erro

No cPanel:

1. Vá em "Errors" ou "Error Log"
2. Acesse `https://clamatec.com/gestao/login`
3. Veja se aparece algum erro
4. **Me envie o erro** (se houver)

---

## 🚨 Possíveis Causas

1. **`.htaccess` não está sendo lido**
   - Verifique se `mod_rewrite` está habilitado (contate suporte)
   - Verifique permissões do arquivo (deve ser 644)

2. **Outro `.htaccess` está interferindo**
   - Verifique se há `.htaccess` em `public_html/api/`
   - Verifique se há `.htaccess` em outras pastas

3. **Ordem das regras está errada**
   - A regra do login DEVE estar PRIMEIRA
   - Use a versão do "Solução 1" acima

4. **Cache do navegador**
   - Limpe o cache (Ctrl+Shift+R)
   - Teste em modo anônimo

---

## ✅ Checklist Final

- [ ] Aplicou a versão do `.htaccess` do "Solução 1"
- [ ] Verificou que não há `.htaccess` conflitante
- [ ] Verificou que `login.html` existe em `gestao/`
- [ ] Limpou cache do navegador
- [ ] Testou em modo anônimo
- [ ] Verificou logs de erro

---

## 📋 Informações que Preciso

Para resolver definitivamente, me envie:

1. ✅ **Conteúdo atual do `.htaccess` em `public_html/`**
2. ✅ **Se existe `.htaccess` em `public_html/api/`** (e seu conteúdo)
3. ✅ **Estrutura de pastas:** lista de arquivos em `public_html/gestao/`
4. ✅ **Logs de erro** (se houver)
5. ✅ **O que aparece quando acessa `/gestao/login`** (screenshot ou descrição)

Com essas informações, posso criar uma solução precisa! 🎯

---

## 💡 Próximo Passo

**Tente a Solução 1 primeiro.** Se não funcionar, me envie as informações acima para eu criar uma solução mais específica!

