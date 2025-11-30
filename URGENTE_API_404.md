# 🚨 URGENTE: Corrigir Erro 404 em `/api/login`

## ✅ SOLUÇÃO IMEDIATA

O problema é que **falta um `.htaccess` em `public_html/api/`** que redireciona as requisições para a pasta `public/` do Laravel.

---

## 📝 PASSO A PASSO

### No cPanel File Manager:

1. **Vá em `public_html/api/`**
2. **Crie arquivo `.htaccess`** (ou edite se já existir)
3. **Cole EXATAMENTE este conteúdo:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

4. **Salve o arquivo**
5. **Defina permissões:** `644`

---

## 🧪 TESTAR IMEDIATAMENTE

### 1. Teste se a API está funcionando:

No navegador, acesse:
```
https://clamatec.com/api/
```

**✅ Deve aparecer:** `{"message":"Site HMX API"}` ou mensagem do Laravel  
**❌ Se aparecer 404:** O `.htaccess` não está funcionando ou a estrutura está errada

### 2. Teste o login:

1. Limpe o localStorage: Abra Console (F12) e execute `localStorage.clear()`
2. Recarregue a página
3. Tente fazer login

---

## 🔍 Se Ainda Não Funcionar

Me envie:

1. **O que aparece quando acessa `https://clamatec.com/api/`?**
2. **Qual é a estrutura de pastas no servidor?**
   - Execute: `ls -la ~/public_html/api/`
3. **Existe arquivo `.htaccess` em `public_html/api/`?**
   - Se sim, qual é o conteúdo?

---

## ✅ Arquivo Criado Localmente

O arquivo `.htaccess` já foi criado em `backend/.htaccess` no seu computador.

**Você precisa fazer upload dele para `public_html/api/.htaccess` no servidor!**

---

**Crie o arquivo no servidor AGORA e me diga o resultado!** 🚀

