# ✅ Criar .htaccess na Pasta api/

## 🎯 Problema

O Laravel está em `public_html/api/`, mas quando você acessa `/api/login`, o servidor não sabe que deve redirecionar para `api/public/index.php`.

## ✅ Solução

Criar um arquivo `.htaccess` em `public_html/api/` que redireciona tudo para `public/`.

---

## 📝 Passo a Passo no cPanel

1. **No File Manager**, vá em `public_html/api/`
2. **Crie um arquivo chamado `.htaccess`**
3. **Cole este conteúdo:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

4. **Salve o arquivo**
5. **Defina permissões:** `644`

---

## 🧪 Testar

Depois de criar o arquivo:

1. **Acesse:** `https://clamatec.com/api/`
   - Deve aparecer: `{"message":"Site HMX API"}` ou similar

2. **Tente fazer login novamente**

---

## 📋 Estrutura Final

```
public_html/
├── .htaccess (frontend)
├── index.html
└── api/
    ├── .htaccess (NOVO - redireciona para public/)
    ├── public/
    │   ├── .htaccess (Laravel)
    │   └── index.php
    └── routes/
        └── api.php
```

---

## ✅ Isso Deve Resolver!

Crie o arquivo e me diga se funcionou! 🎯

