# 🚀 Deploy no Coolify - Resumo Rápido

## 📋 Arquivos Criados

### ✅ Guias:
- `DEPLOY_COOLIFY.md` - Guia completo e detalhado
- `COOLIFY_QUICK_START.md` - Início rápido em 5 passos
- `COOLIFY_SETUP_COMPLETO.md` - Setup completo passo a passo

### ✅ Dockerfiles de Produção:
- `backend/Dockerfile.production` - Backend Laravel otimizado
- `frontend/Dockerfile.production` - Frontend Next.js com build estático

### ✅ Configurações:
- `docker-compose.coolify.yml` - Docker Compose para Coolify
- `backend/nginx.conf` - Configuração Nginx para backend
- `frontend/nginx.conf` - Configuração Nginx para frontend
- `.coolify.yaml` - Configuração opcional

### ✅ Scripts:
- `scripts/prepare-coolify.sh` - Script de preparação

---

## ⚡ Quick Start

### 1. Backend no Coolify

**Tipo:** Dockerfile  
**Dockerfile Path:** `backend/Dockerfile.production`  
**Porta:** 8000  
**Domínio:** `api.seudominio.com`

**Variáveis:**
```env
APP_ENV=production
DB_HOST=sitehmx-mysql
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
```

### 2. Frontend no Coolify

**Tipo:** Dockerfile  
**Dockerfile Path:** `frontend/Dockerfile.production`  
**Porta:** 80  
**Domínio:** `seudominio.com`

**Variáveis:**
```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
```

### 3. MySQL no Coolify

**Tipo:** MySQL Resource  
**Nome:** `sitehmx-mysql`

---

## 📖 Documentação Completa

Consulte os guias para instruções detalhadas:

1. **Início Rápido:** `COOLIFY_QUICK_START.md`
2. **Setup Completo:** `COOLIFY_SETUP_COMPLETO.md`
3. **Guia Detalhado:** `DEPLOY_COOLIFY.md`

---

**Boa sorte com o deploy!** 🚀

