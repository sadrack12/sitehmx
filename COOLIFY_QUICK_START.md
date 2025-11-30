# ⚡ Coolify Quick Start

## 🚀 Deploy Rápido em 5 Passos

### 1. Criar Aplicação Backend

No Coolify:
- **Nome:** `sitehmx-backend`
- **Tipo:** Dockerfile
- **Repositório:** `https://github.com/sadrack12/sitehmx.git`
- **Branch:** `main`
- **Dockerfile Path:** `backend/Dockerfile`
- **Porta:** `8000`

**Variáveis de Ambiente:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.seudominio.com
DB_HOST=mysql
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=senha_segura
FRONTEND_URL=https://seudominio.com
DAILY_API_KEY=sua_chave
```

---

### 2. Criar Banco MySQL

No Coolify:
- **Tipo:** MySQL
- **Nome:** `sitehmx-mysql`
- **Versão:** 8.0

Conectar ao backend usando o host interno do MySQL.

---

### 3. Criar Aplicação Frontend

No Coolify:
- **Nome:** `sitehmx-frontend`
- **Tipo:** Dockerfile
- **Repositório:** `https://github.com/sadrack12/sitehmx.git`
- **Branch:** `main`
- **Dockerfile Path:** `frontend/Dockerfile.production`
- **Porta:** `80` (ou 3000)

**Variáveis de Ambiente:**
```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
```

---

### 4. Configurar Domínios

- **Backend:** `api.seudominio.com`
- **Frontend:** `seudominio.com`

O Coolify configura SSL automaticamente.

---

### 5. Executar Migrations

Após o deploy, executar no terminal do Coolify:

```bash
php artisan migrate --force
php artisan db:seed
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

---

## ✅ Verificar

- Backend: `https://api.seudominio.com/api/noticias`
- Frontend: `https://seudominio.com`

---

**Pronto! Aplicação no ar!** 🎉

