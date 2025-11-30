# 🚨 URGENTE: Criar .htaccess na Pasta api/

## ⚠️ Problema

O erro `404 (Not Found)` em `/api/login` acontece porque **falta um arquivo `.htaccess`** em `public_html/api/` que redireciona as requisições para a pasta `public/` do Laravel.

---

## ✅ SOLUÇÃO: Criar Arquivo .htaccess

### No cPanel File Manager:

1. **Vá em `public_html/api/`**
2. **Crie um novo arquivo** chamado `.htaccess`
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

## 🧪 Testar Imediatamente

Depois de criar o arquivo:

1. **Acesse no navegador:**
   ```
   https://clamatec.com/api/
   ```
   
   **✅ Deve aparecer:** `{"message":"Site HMX API"}` ou mensagem do Laravel  
   **❌ Se aparecer 404:** O arquivo não está no lugar certo ou há outro problema

2. **Tente fazer login novamente**

---

## 📋 Estrutura Esperada

```
public_html/
├── .htaccess (frontend)
├── index.html
└── api/
    ├── .htaccess (NOVO - você precisa criar!)
    ├── public/
    │   ├── .htaccess (Laravel - já existe)
    │   └── index.php
    └── routes/
        └── api.php
```

---

## 📝 Passo a Passo Detalhado no cPanel

1. **Acesse cPanel → File Manager**
2. **Navegue até `public_html/api/`**
3. **Clique em "New File"** (ou "Novo Arquivo")
4. **Nome:** `.htaccess` (com o ponto no início!)
5. **Clique duas vezes no arquivo** para editar
6. **Cole o conteúdo acima**
7. **Salve**
8. **Se pedir permissões, defina como `644`**

---

## ✅ Arquivo Pronto Localmente

O arquivo já foi criado em `backend/.htaccess` no seu computador.

**Você precisa fazer upload dele para `public_html/api/.htaccess` no servidor!**

---

## 🔍 Se Ainda Não Funcionar

Me diga:

1. **O que aparece quando acessa `https://clamatec.com/api/`?**
   - Mensagem do Laravel?
   - 404?
   - Outro erro?

2. **O arquivo `.htaccess` foi criado em `public_html/api/`?**
   - Verifique se existe
   - Qual é o conteúdo?

**Crie o arquivo AGORA e me diga o resultado!** 🚀

