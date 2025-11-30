# ✅ SOLUÇÃO: Erro 404 em `/api/login`

## 🚨 Problema Identificado

A URL está correta (`https://clamatec.com/api/login`), mas o Laravel não está recebendo a requisição.

**Causa:** Falta um `.htaccess` em `public_html/api/` que redireciona para `public/`.

---

## ✅ SOLUÇÃO: Criar .htaccess na Pasta api/

### No cPanel File Manager:

1. **Vá em `public_html/api/`**
2. **Crie um arquivo `.htaccess`** (se não existir)
3. **Cole este conteúdo:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

4. **Salve**
5. **Defina permissões:** `644`

---

## 🧪 Testar

### 1. Testar se `/api/` funciona:

Acesse no navegador:
```
https://clamatec.com/api/
```

**Deve aparecer:** `{"message":"Site HMX API"}` ou similar (não 404)

### 2. Testar login:

1. Limpe o localStorage: `localStorage.clear()` no Console
2. Acesse: `https://clamatec.com/gestao/login`
3. Tente fazer login

---

## 📋 Estrutura Final Esperada

```
public_html/
├── .htaccess (frontend - permite /api/ passar)
├── index.html (frontend)
├── gestao/
│   └── login.html
└── api/
    ├── .htaccess (NOVO! Redireciona para public/)
    ├── public/
    │   ├── .htaccess (Laravel)
    │   └── index.php
    ├── routes/
    │   └── api.php
    └── ...
```

---

## ✅ Arquivo Pronto

O arquivo foi criado em `backend/.htaccess`. 

**Você precisa fazer upload dele para `public_html/api/.htaccess` no servidor!**

---

## 🔍 Se Ainda Não Funcionar

Me envie:

1. **O que aparece quando acessa `https://clamatec.com/api/`?**
   - Mensagem do Laravel?
   - Erro 404?
   - Outro erro?

2. **Existe arquivo `.htaccess` em `public_html/api/`?**
   - Se sim, qual é o conteúdo?

3. **Qual é a estrutura exata no servidor?**

Com essas informações, resolvo! 🎯

