# 🔧 Solução: Erro 404 no Backend

## ✅ Progresso

**Frontend está correto agora!** ✅
- Não está mais usando `/public/` nas URLs
- Está chamando: `/api/consulta-online/buscar` (correto)

**Problema atual:** Backend retorna 404 para `/api/consulta-online/buscar`

---

## 🔍 Verificar Backend

### No Servidor (SSH ou Terminal do cPanel):

1. **Vá em:** `~/public_html/api/`

2. **Verifique se a rota existe:**
   ```bash
   php artisan route:list | grep "consulta-online/buscar"
   ```

3. **Deve aparecer:**
   ```
   POST   api/consulta-online/buscar  ... ConsultaOnlineController@buscarPorNIF
   ```

4. **Se não aparecer:**
   - Limpe o cache do Laravel (veja abaixo)

---

## 🔧 SOLUÇÃO: Limpar Cache do Laravel

### No Servidor, execute:

```bash
cd ~/public_html/api

# Limpar todos os caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# Recriar caches
php artisan route:cache
php artisan config:cache
```

### Verificar Rotas Novamente:

```bash
php artisan route:list | grep "consulta-online"
```

**Deve mostrar:**
- `POST   api/consulta-online/buscar`

---

## 🔍 Verificar .htaccess do Backend

### No cPanel, verifique:

**Arquivo:** `public_html/api/.htaccess`

**Deve conter:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**E verifique também:**

**Arquivo:** `public_html/api/public/.htaccess`

**Deve conter:**
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 🧪 Teste

**Após limpar cache, teste:**

1. **Acesse:** `https://clamatec.com/api/consulta-online/buscar` (POST)
2. **Deve retornar:** JSON (não 404)

---

**Execute os comandos de limpar cache no servidor AGORA!** 🚀

