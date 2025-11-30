# 🚨 SOLUÇÃO: Erro 403 Forbidden

## ⚠️ Problema

O erro 403 Forbidden significa que o servidor está bloqueando o acesso à pasta `api/`.

---

## ✅ SOLUÇÕES

### Solução 1: Verificar Permissões dos Arquivos

No cPanel File Manager:

1. **Vá em `public_html/api/`**
2. **Clique com botão direito no arquivo `.htaccess`** (se existir)
3. **Vá em "Change Permissions"** (ou "Alterar Permissões")
4. **Defina:** `644`
5. **Aplique**

Também verifique a pasta:
- **Pasta `api/`:** `755`
- **Pasta `api/public/`:** `755`
- **Arquivo `api/public/.htaccess`:** `644`
- **Arquivo `api/public/index.php`:** `644`

---

### Solução 2: Verificar Conteúdo do .htaccess

O `.htaccess` em `public_html/api/` deve ter **APENAS**:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**NÃO adicione nada mais!** Se houver outras regras, remova-as.

---

### Solução 3: Verificar se a Pasta public/ Existe

Certifique-se de que a estrutura está correta:

```
public_html/
└── api/
    ├── .htaccess
    └── public/
        ├── .htaccess
        └── index.php
```

---

### Solução 4: Adicionar Options FollowSymLinks

Se o erro 403 persistir, modifique o `.htaccess` em `public_html/api/`:

```apache
<IfModule mod_rewrite.c>
    Options +FollowSymLinks
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

### Solução 5: Verificar .htaccess do Frontend

O `.htaccess` em `public_html/` (frontend) **NÃO deve bloquear** `/api/`.

Verifique se ele tem uma regra para deixar `/api/` passar:

```apache
# Não tocar na API - DEIXAR PASSAR PARA LARAVEL
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]
```

---

## 🔍 Verificações no Servidor

Execute no servidor (via SSH ou Terminal do cPanel):

```bash
cd ~/public_html/api
ls -la

# Verificar permissões
stat .htaccess
stat public/.htaccess
stat public/index.php
```

---

## 📋 Checklist

- [ ] `.htaccess` em `api/` existe e tem permissão `644`
- [ ] Conteúdo do `.htaccess` está correto
- [ ] Pasta `public/` existe em `api/`
- [ ] `public/index.php` existe e tem permissão `644`
- [ ] `.htaccess` do frontend não bloqueia `/api/`

---

## 🧪 Testar

1. **Acesse:** `https://clamatec.com/api/`
   - Se funcionar: Deve aparecer mensagem do Laravel
   - Se ainda der 403: Verifique as permissões

2. **Teste login**

---

**Verifique as permissões e me diga o resultado!** 🚀

