# 🚨 SOLUÇÃO: Erro 404 em `/api/login`

## ⚠️ Problema

A URL `https://clamatec.com/api/login` está correta, mas retorna 404 porque o servidor não sabe redirecionar para o Laravel.

---

## ✅ SOLUÇÃO: Criar Arquivo `.htaccess` no Servidor

### Você precisa criar um arquivo no servidor:

**Localização:** `public_html/api/.htaccess`

### Conteúdo do arquivo:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

## 📝 Passo a Passo no cPanel

1. **Acesse cPanel → File Manager**
2. **Vá até `public_html/api/`**
3. **Clique em "New File"** ou "Novo Arquivo"
4. **Nome do arquivo:** `.htaccess` (com o ponto no início!)
5. **Clique duas vezes no arquivo** para editar
6. **Cole o conteúdo acima**
7. **Salve**

---

## 🧪 Teste Imediato

Depois de criar o arquivo:

1. **Acesse no navegador:**
   ```
   https://clamatec.com/api/
   ```
   
   **✅ Deve aparecer:** Mensagem do Laravel (ex: `{"message":"Site HMX API"}`)
   
   **❌ Se aparecer 404:** O arquivo não está no lugar certo

2. **Teste o login novamente**

---

## ✅ Arquivo Local

O arquivo já existe em `backend/.htaccess` no seu computador.

**Você pode fazer upload dele para `public_html/api/.htaccess` no servidor!**

---

## 🔍 Verificar

Depois de criar o arquivo, verifique:

- [ ] Arquivo `.htaccess` existe em `public_html/api/`
- [ ] Conteúdo está correto
- [ ] `https://clamatec.com/api/` mostra mensagem do Laravel
- [ ] Login funciona

---

**Crie o arquivo AGORA e me diga o resultado!** 🚀

