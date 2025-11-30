# 🔍 Diagnóstico: Erro 404 em `/api/login`

## 🚨 Problema

O erro mostra que a URL está correta: `https://clamatec.com/api/login`, mas retorna 404.

**Isso significa:** O Laravel não está recebendo a requisição.

---

## 🔍 Verificações no Servidor

Execute estes comandos e me envie os resultados:

### 1. Verificar Estrutura de Pastas

```bash
cd ~/public_html
pwd
ls -la | grep -E "^d|api|\.htaccess"
```

### 2. Verificar se API está acessível

```bash
# Testar se /api/ responde
curl -I https://clamatec.com/api/

# Ou testar rota pública
curl https://clamatec.com/api/noticias
```

### 3. Verificar Estrutura do Laravel

```bash
cd ~/public_html/api
ls -la | head -15

# Verificar se public/ existe
ls -la public/ | head -10
```

### 4. Verificar .htaccess Principal

```bash
cat ~/public_html/.htaccess
```

### 5. Verificar .htaccess do Laravel

```bash
cat ~/public_html/api/public/.htaccess
```

### 6. Testar Rota no Laravel

```bash
cd ~/public_html/api
php artisan route:list | grep login
```

---

## ✅ Estrutura Esperada

O Laravel **DEVE** estar assim:

```
public_html/
├── .htaccess (frontend - não interfere com /api/)
├── index.html (frontend)
└── api/
    ├── app/
    ├── routes/
    │   └── api.php (com Route::post('/login', ...))
    └── public/
        ├── .htaccess (Laravel)
        └── index.php
```

E o **DocumentRoot do Laravel** deve apontar para `public_html/api/public/` ou o `.htaccess` deve redirecionar corretamente.

---

## 🔧 Possível Solução: .htaccess na Pasta api/

Pode ser necessário criar um `.htaccess` em `public_html/api/` que redireciona para `public/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

## 📋 Me Envie

1. ✅ Resultado de `ls -la ~/public_html/`
2. ✅ Resultado de `ls -la ~/public_html/api/`
3. ✅ Conteúdo de `~/.htaccess` em `public_html/`
4. ✅ O que aparece quando acessa `https://clamatec.com/api/` no navegador

Com essas informações, resolvo o problema! 🎯

