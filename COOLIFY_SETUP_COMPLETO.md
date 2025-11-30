# 🚀 Setup Completo no Coolify

## 📋 Visão Geral

Este guia cobre o deploy completo da aplicação no Coolify usando Docker.

---

## 🎯 Estrutura no Coolify

### Aplicações:

1. **Backend (Laravel API)**
   - Tipo: Dockerfile
   - Porta: 8000
   - Domínio: `api.hospitalgeraldomoxico.com`

2. **Frontend (Next.js)**
   - Tipo: Dockerfile
   - Porta: 3000 (ou 80 com Nginx)
   - Domínio: `hospitalgeraldomoxico.com`

3. **MySQL**
   - Tipo: MySQL Resource
   - Versão: 8.0
   - Conectado ao backend via rede interna

---

## 📦 PASSO 1: Preparar Repositório

### 1.1 Verificar que tudo está no Git:

```bash
git status
git add .
git commit -m "Preparar para deploy no Coolify"
git push origin main
```

---

## 📦 PASSO 2: Criar Aplicação Backend

### 2.1 No Coolify:

1. **Nova Aplicação**
   - Nome: `sitehmx-backend`
   - Tipo: `Dockerfile`
   - Repositório: `https://github.com/sadrack12/sitehmx.git`
   - Branch: `main`
   - Dockerfile Path: `backend/Dockerfile.production`
   - Dockerfile Context: `backend`

### 2.2 Variáveis de Ambiente:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:... (gerar após primeiro deploy)
APP_URL=https://api.hospitalgeraldomoxico.com

DB_CONNECTION=mysql
DB_HOST=sitehmx-mysql (nome do recurso MySQL no Coolify)
DB_PORT=3306
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=senha_gerada_pelo_coolify

FRONTEND_URL=https://hospitalgeraldomoxico.com

DAILY_API_KEY=sua_chave_daily_co
DAILY_DOMAIN=clamatec.daily.co
```

### 2.3 Porta:

- **Interna:** `8000`
- **Pública:** Coolify gerencia automaticamente

### 2.4 Domínio:

- `api.hospitalgeraldomoxico.com`
- SSL automático via Let's Encrypt

---

## 📦 PASSO 3: Criar Recurso MySQL

### 3.1 No Coolify:

1. **Novo Recurso**
   - Tipo: `MySQL`
   - Nome: `sitehmx-mysql`
   - Versão: `8.0`
   - Database: `sitehmx`
   - Username: `sitehmx`
   - Password: (gerar ou definir)

### 3.2 Conectar ao Backend:

No backend, usar o host interno do MySQL (ex: `sitehmx-mysql`)

---

## 📦 PASSO 4: Criar Aplicação Frontend

### 4.1 No Coolify:

1. **Nova Aplicação**
   - Nome: `sitehmx-frontend`
   - Tipo: `Dockerfile`
   - Repositório: `https://github.com/sadrack12/sitehmx.git`
   - Branch: `main`
   - Dockerfile Path: `frontend/Dockerfile.production`
   - Dockerfile Context: `frontend`

### 4.2 Variáveis de Ambiente:

```env
NEXT_PUBLIC_API_URL=https://api.hospitalgeraldomoxico.com/api
NODE_ENV=production
```

### 4.3 Porta:

- **Interna:** `80` (Nginx no container)
- **Pública:** Coolify gerencia

### 4.4 Domínio:

- `hospitalgeraldomoxico.com`
- SSL automático

---

## 🔧 PASSO 5: Pós-Deploy

### 5.1 Após primeiro deploy do backend:

No terminal do Coolify (ou via SSH no container):

```bash
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

### 5.2 Criar usuário de teste (opcional):

```bash
php artisan db:seed --class=CriarUsuarioTesteSeeder
```

---

## 🔄 Deploy Automático

O Coolify detecta push no GitHub e faz deploy automático.

**Configurar Webhook (recomendado):**
1. No Coolify, ativar "Auto Deploy" na aplicação
2. No GitHub, o webhook é configurado automaticamente

---

## 📝 Arquivos Criados

### Para Coolify:

1. `docker-compose.coolify.yml` - Versão para Coolify
2. `frontend/Dockerfile.production` - Build de produção
3. `frontend/nginx.conf` - Configuração Nginx
4. `backend/Dockerfile.production` - Backend otimizado
5. `backend/nginx.conf` - Configuração Nginx
6. `.coolify.yaml` - Configuração opcional

---

## ✅ Verificações

### Backend:
- `https://api.seudominio.com/api/noticias`
- Deve retornar JSON

### Frontend:
- `https://seudominio.com`
- Deve carregar corretamente

### API do Frontend:
- Frontend deve conseguir chamar `https://api.seudominio.com/api`

---

## 🔧 Troubleshooting

### Erro de conexão com banco:

- Verificar `DB_HOST` (deve ser o nome do recurso MySQL no Coolify)
- Verificar se MySQL está rodando no Coolify
- Verificar rede interna entre containers

### Build falha:

- Verificar logs do build no Coolify
- Verificar se todos os arquivos estão no Git
- Verificar se Dockerfiles estão corretos

### Frontend não encontra API:

- Verificar `NEXT_PUBLIC_API_URL` está correto
- Verificar CORS no backend
- Verificar se backend está acessível

---

**Siga este guia completo para deploy no Coolify!** 🚀

