# 🚀 Upload Rápido para cPanel

## 📦 BACKEND

### Opção 1: Via Git (Mais Fácil) ✅

**No servidor (SSH):**

```bash
cd ~/public_html/api
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan route:clear
php artisan config:clear
php artisan route:cache
```

### Opção 2: Via FTP/cPanel

**Arquivos para upload:**

1. `backend/app/Http/Controllers/Api/PublicController.php`
   → `public_html/api/app/Http/Controllers/Api/PublicController.php`

2. `backend/app/Providers/AppServiceProvider.php`
   → `public_html/api/app/Providers/AppServiceProvider.php`

3. `backend/.htaccess`
   → `public_html/api/.htaccess`

**Depois, no servidor:**
```bash
cd ~/public_html/api
php artisan route:clear
php artisan config:clear
php artisan route:cache
```

---

## 📦 FRONTEND

**IMPORTANTE:** Faça upload de **TODA** a pasta `frontend/out/`

**Via FTP/cPanel File Manager:**

1. Delete **TODOS** os arquivos em `public_html/`
2. Faça upload de **TODA** a pasta `frontend/out/` para `public_html/`
3. Verifique que `.htaccess` foi enviado

**OU use o script:**
```bash
./scripts/preparar-upload.sh
```

---

## ✅ VERIFICAR

1. **Backend:** `https://clamatec.com/api/consulta-online/buscar` (POST) - deve funcionar
2. **Frontend:** `https://clamatec.com/consulta-online` - deve chamar `/api/consulta-online/buscar` (não `/api/public/...`)

---

**Siga os passos acima!** 🚀

