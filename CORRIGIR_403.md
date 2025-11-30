# ✅ Correção Rápida: Erro 403 Forbidden

## 🚨 Problema

Erro 403 significa que o servidor está bloqueando acesso à pasta `api/`.

---

## ✅ SOLUÇÃO RÁPIDA

### 1. Verificar Permissões

No cPanel File Manager:

1. **Vá em `public_html/api/`**
2. **Clique com botão direito em `.htaccess`** → "Change Permissions"
3. **Defina:** `644`
4. **Clique em "Change Permissions"** na pasta `api/`
5. **Defina:** `755`

### 2. Verificar Conteúdo do .htaccess

O arquivo `public_html/api/.htaccess` deve ter:

```apache
<IfModule mod_rewrite.c>
    Options +FollowSymLinks
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### 3. Verificar se public/ Existe

Certifique-se que existe:
- `public_html/api/public/`
- `public_html/api/public/index.php`

---

## 🧪 Testar

Acesse: `https://clamatec.com/api/`

**✅ Deve aparecer:** Mensagem do Laravel  
**❌ Se ainda der 403:** Me diga e veremos outras soluções

---

**Verifique as permissões AGORA!** 🚀

