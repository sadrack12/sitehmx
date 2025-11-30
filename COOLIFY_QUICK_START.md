# ⚡ Coolify Quick Start

## 🚀 Deploy Rápido em 5 Passos

### 1. Criar Aplicação Backend

No Coolify:
- **Nome:** `sitehmx-backend`
- **Tipo:** Dockerfile
- **Repositório:** `https://github.com/sadrack12/sitehmx.git`
- **Branch:** `main`
- **Dockerfile Context:** `backend`
- **Dockerfile Path:** `Dockerfile.production` ⚠️ (relativo ao context, sem `backend/`)
- **Porta:** `8000`

**Variáveis de Ambiente:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hospitalgeraldomoxico.com
DB_HOST=mysql
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=senha_segura
FRONTEND_URL=https://hospitalgeraldomoxico.com
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
- **Dockerfile Context:** `frontend`
- **Dockerfile Path:** `Dockerfile.production` ⚠️ (relativo ao context, sem `frontend/`)
- **Porta:** `80`

**Variáveis de Ambiente:**
```env
NEXT_PUBLIC_API_URL=https://hospitalgeraldomoxico.com/api
```

---

### 4. Configurar Domínio

**⚠️ IMPORTANTE:** Configure apenas o Frontend com domínio público.

- **Frontend:** `hospitalgeraldomoxico.com`
  - Backend ficará acessível via proxy reverso em `/api`
  
**No Coolify:**
- Frontend recebe o domínio: `hospitalgeraldomoxico.com`
- Backend NÃO recebe domínio público (acesso apenas interno)
- Configure proxy reverso no Coolify para rotear `/api` → backend

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

- Frontend: `https://hospitalgeraldomoxico.com`
- API: `https://hospitalgeraldomoxico.com/api/noticias`

---

**Pronto! Aplicação no ar!** 🎉

