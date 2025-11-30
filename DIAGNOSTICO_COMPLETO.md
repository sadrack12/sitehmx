# 🔍 Diagnóstico Completo - Problema /gestao/login

## ✅ O que sabemos:

- ✅ Arquivo `gestao/login.html` existe no servidor
- ✅ Acesso direto funciona: `https://clamatec.com/gestao/login.html`
- ❌ Rota sem `.html` não funciona: `https://clamatec.com/gestao/login`

**Conclusão:** O `.htaccess` não está redirecionando corretamente.

---

## 🔍 Possíveis Causas

1. **Outro `.htaccess` está interferindo**
   - Verifique se há `.htaccess` em outras pastas
   - Verifique se há `.htaccess` no `public_html/api/`

2. **O `.htaccess` não está sendo lido**
   - Verifique se o módulo `mod_rewrite` está habilitado
   - Verifique permissões do arquivo

3. **Ordem das regras está errada**
   - As regras podem estar sendo processadas na ordem errada

---

## ✅ Solução: Testar .htaccess Passo a Passo

### Teste 1: Verificar se .htaccess está sendo lido

Adicione uma linha de teste no `.htaccess`:

```apache
# Esta linha causa erro se o .htaccess estiver sendo lido
# Se der erro 500, o .htaccess está funcionando
# Se não der erro, o .htaccess não está sendo lido

RewriteEngine On
# Teste: Descomente a linha abaixo temporariamente
# InvalidDirective Test
```

Se você adicionar uma linha inválida e **não** der erro, significa que o `.htaccess` não está sendo lido.

---

## ✅ Solução Alternativa: Criar Redirect no index.html

Se o `.htaccess` não funcionar, podemos usar JavaScript no `index.html` para redirecionar:

```javascript
// No index.html, adicionar antes de fechar </body>
<script>
if (window.location.pathname === '/gestao/login') {
  window.location.href = '/gestao/login.html';
}
</script>
```

Mas isso não é ideal...

---

## ✅ Solução Melhor: Verificar Estrutura no Servidor

No cPanel, verifique:

1. **Há arquivo `.htaccess` em `public_html/`?**
   - Se não, crie um
   - Se sim, veja o conteúdo atual

2. **Há arquivo `.htaccess` em `public_html/api/`?**
   - Se sim, pode estar interferindo

3. **Qual é a estrutura exata?**
   ```
   public_html/
   ├── .htaccess  ← Está aqui?
   ├── index.html
   ├── gestao/
   │   └── login.html  ← Está aqui?
   └── api/
       └── .htaccess  ← Tem este? (pode interferir)
   ```

---

## 🔧 .htaccess Simplificado Máximo

Tente esta versão ULTRA simplificada:

```apache
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^gestao/login$ /gestao/login.html [L,R=301]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI}\.html -f
RewriteRule ^(.*)$ $1.html [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Note o `[L,R=301]` na regra específica do login - isso força um redirect.

---

## 📋 Checklist de Verificação

- [ ] Arquivo `.htaccess` existe em `public_html/`
- [ ] Permissões do `.htaccess` são `644`
- [ ] Não há `.htaccess` conflitante em `public_html/api/`
- [ ] Não há `.htaccess` em `public_html/gestao/`
- [ ] Arquivo `gestao/login.html` existe
- [ ] Testou a versão ULTRA simplificada acima
- [ ] Verificou logs de erro no cPanel

---

## 💡 Próximo Passo

Me envie:
1. O conteúdo atual do `.htaccess` no servidor
2. Se há outros arquivos `.htaccess` em outras pastas
3. O que aparece nos logs de erro do cPanel

Isso me ajudará a identificar o problema exato!

