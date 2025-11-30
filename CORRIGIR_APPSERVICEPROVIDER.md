# 🔧 Corrigir AppServiceProvider

## ⚠️ Problema Identificado

O `AppServiceProvider` está adicionando o prefixo `api` às rotas, mas:
- A URL já tem `/api/` (https://clamatec.com/api/)
- O `.htaccess` redireciona para `public/`, então o Laravel recebe a requisição sem `/api/`
- O prefixo adicional cria conflito

---

## ✅ SOLUÇÃO

**Arquivo modificado:** `backend/app/Providers/AppServiceProvider.php`

**Mudança:** Removido o `Route::prefix('api')` porque a URL já inclui `/api/`.

---

## 🚀 APLICAR NO SERVIDOR

### Opção 1: Via cPanel File Manager

1. **Vá em:** `public_html/api/app/Providers/AppServiceProvider.php`
2. **Edite o arquivo**
3. **Substitua a função `loadRoutes()` pelo código corrigido**

### Opção 2: Via FTP/SFTP

1. **Faça upload de:** `backend/app/Providers/AppServiceProvider.php`
2. **Para:** `public_html/api/app/Providers/AppServiceProvider.php`

---

## 🔧 Limpar Cache Após Modificar

**No servidor, execute:**

```bash
cd ~/public_html/api
php artisan route:clear
php artisan config:clear
php artisan route:cache
```

---

## ✅ Verificar

**Após aplicar, verifique:**

```bash
php artisan route:list | grep "consulta-online/buscar"
```

**Deve aparecer:**
```
POST   consulta-online/buscar  ... ConsultaOnlineController@buscarPorNIF
```

**NÃO deve ter:** `api/consulta-online/buscar` (com prefixo duplo)

---

**Aplique a correção no servidor AGORA!** 🚀

