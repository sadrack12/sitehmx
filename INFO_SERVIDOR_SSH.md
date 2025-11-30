# 🔐 Informações de Conexão SSH

## 📋 Dados do Servidor

**Host:** `50.6.35.67`  
**Usuário:** `ebvutbmy`  
**Comando SSH:** `ssh ebvutbmy@50.6.35.67`

---

## 🚀 Comandos Úteis

### Conectar ao servidor:

```bash
ssh ebvutbmy@50.6.35.67
```

### Diretórios importantes:

```bash
# Backend Laravel
cd ~/public_html/api

# Frontend (Next.js build)
cd ~/public_html

# Verificar estrutura
ls -la ~/public_html
ls -la ~/public_html/api
```

---

## 📦 Comandos Rápidos

### Backend - Limpar Cache:

```bash
cd ~/public_html/api
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan route:cache
php artisan config:cache
```

### Backend - Verificar Rotas:

```bash
cd ~/public_html/api
php artisan route:list | grep "consulta-online"
php artisan route:list | grep "noticias"
```

### Backend - Verificar Git:

```bash
cd ~/public_html/api
git status
git remote -v
```

---

## 🔧 Troubleshooting

### Se Git não funcionar (timeout no GitHub):

Fazer upload manual via FTP/cPanel dos arquivos:
- `backend/app/Http/Controllers/Api/PublicController.php`
- `backend/app/Providers/AppServiceProvider.php`
- `backend/.htaccess`

### Verificar Permissões:

```bash
chmod -R 755 ~/public_html/api
chmod -R 644 ~/public_html/api/.htaccess
chmod -R 755 ~/public_html/api/storage
chmod -R 755 ~/public_html/api/bootstrap/cache
```

---

**Guarde estas informações para referência futura!** 🔐

