# ✅ Checklist: Upload para cPanel

## 📋 ANTES DE FAZER UPLOAD

- [ ] Build do frontend foi feito (`npm run build`)
- [ ] Backend está corrigido localmente
- [ ] Git está atualizado (se usar Git)

---

## 🚀 BACKEND - Upload para `public_html/api/`

### Opção 1: Via Git (Recomendado) ✅

**No servidor (SSH):**

```bash
cd ~/public_html/api
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan route:clear
php artisan config:clear
php artisan route:cache
```

### Opção 2: Via FTP/cPanel File Manager

- [ ] Upload: `backend/app/Http/Controllers/Api/PublicController.php`
  - → Para: `public_html/api/app/Http/Controllers/Api/PublicController.php`

- [ ] Upload: `backend/app/Providers/AppServiceProvider.php`
  - → Para: `public_html/api/app/Providers/AppServiceProvider.php`

- [ ] Upload: `backend/.htaccess`
  - → Para: `public_html/api/.htaccess`

- [ ] No servidor, executar:
  ```bash
  cd ~/public_html/api
  php artisan route:clear
  php artisan config:clear
  php artisan route:cache
  ```

---

## 🚀 FRONTEND - Upload para `public_html/`

- [ ] **TODA a pasta `frontend/out/`**
  - → Para: `public_html/`
  - **Substitua TODOS os arquivos existentes!**

- [ ] Verificar que `.htaccess` foi enviado
  - → Para: `public_html/.htaccess`

---

## ✅ VERIFICAÇÕES APÓS UPLOAD

### Backend:

- [ ] Testar: `https://clamatec.com/api/consultas/2/documentos?nif=500000000`
  - Deve retornar JSON com URLs `/api/...` (não `/public/...`)

- [ ] Testar: `https://clamatec.com/api/consulta-online/buscar` (POST)
  - Deve funcionar (não 404)

### Frontend:

- [ ] Acessar: `https://clamatec.com/consulta-online`
- [ ] Abrir Console (F12)
- [ ] Digitar NIF e buscar
- [ ] Verificar que chama: `POST https://clamatec.com/api/consulta-online/buscar`
- [ ] **NÃO deve chamar:** `POST https://clamatec.com/api/public/consulta-online/buscar`

- [ ] Limpar cache do navegador (F12 → Application → Clear site data)

---

## 🔧 COMANDOS ÚTEIS

### Limpar Cache do Laravel:

```bash
cd ~/public_html/api
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan route:cache
php artisan config:cache
```

### Verificar Permissões:

```bash
chmod -R 755 ~/public_html/api
chmod -R 644 ~/public_html/api/.htaccess
chmod -R 755 ~/public_html/api/storage
chmod -R 755 ~/public_html/api/bootstrap/cache
```

---

**Siga este checklist para fazer upload completo!** 🚀

