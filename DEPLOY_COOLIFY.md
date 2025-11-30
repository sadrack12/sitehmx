# 🚀 Deploy no Coolify

## 📋 O que é Coolify?

Coolify é uma plataforma open-source de automação de deployment self-hosted, similar ao Heroku/Vercel, que suporta:
- Deploy automático via Git
- Docker containers
- SSL automático (Let's Encrypt)
- Domínios personalizados
- Monitoramento

---

## 🎯 Pré-requisitos

- Servidor VPS com Docker instalado
- Coolify instalado e rodando
- Domínio configurado apontando para o servidor
- Repositório Git (GitHub, GitLab, etc.)

---

## 📦 ESTRUTURA DO PROJETO

O projeto já está configurado para Docker:
- `docker-compose.yml` - Configuração completa
- `backend/Dockerfile` - Container Laravel
- `frontend/Dockerfile` - Container Next.js

---

## 🚀 PASSO A PASSO

### 1. Preparar Repositório Git

```bash
# Já está feito! O projeto está no GitHub
# https://github.com/sadrack12/sitehmx.git
```

### 2. Criar Aplicação no Coolify

#### Backend (Laravel API)

1. No Coolify, criar nova aplicação:
   - **Nome:** `sitehmx-backend`
   - **Tipo:** Docker Compose
   - **Repositório:** `https://github.com/sadrack12/sitehmx.git`
   - **Branch:** `main`
   - **Build Pack:** Docker Compose

2. **Variáveis de Ambiente:**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.seudominio.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=senha_segura_aqui

FRONTEND_URL=https://seudominio.com

DAILY_API_KEY=sua_chave_daily_co
DAILY_DOMAIN=clamatec.daily.co

# Usar volumes do Coolify para MySQL
```

3. **Porta:** `8000` (interno)

4. **Domínio:** `api.seudominio.com`

---

#### Frontend (Next.js)

**Opção 1: Build Estático (Recomendado para Coolify)**

1. Criar nova aplicação:
   - **Nome:** `sitehmx-frontend`
   - **Tipo:** Dockerfile
   - **Repositório:** `https://github.com/sadrack12/sitehmx.git`
   - **Branch:** `main`
   - **Build Pack:** Dockerfile
   - **Dockerfile Path:** `frontend/Dockerfile`

2. **Variáveis de Ambiente:**

```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
```

3. **Porta:** `3000` (interno)

4. **Domínio:** `seudominio.com`

---

### 3. Banco de Dados MySQL

No Coolify, criar recurso MySQL:
- **Nome:** `sitehmx-mysql`
- **Versão:** MySQL 8.0
- **Database:** `sitehmx`
- **User:** `sitehmx`
- **Password:** (gerar automaticamente ou definir)

**Conectar ao Backend:**
- Usar o host interno do MySQL (ex: `mysql` ou `sitehmx-mysql`)
- O Coolify gerencia a rede interna entre containers

---

### 4. Configurar Build

#### Backend

**Dockerfile já existe:** `backend/Dockerfile`

O Coolify irá:
1. Fazer build da imagem
2. Executar `composer install`
3. Executar migrations automaticamente (se configurado)

---

#### Frontend

**Opção 1: Dockerfile (Produção)**

O Coolify irá:
1. Fazer build estático (`npm run build`)
2. Servir arquivos estáticos via Nginx

**Opção 2: Build durante deploy**

Adicionar script de build no Dockerfile ou usar build pack do Coolify.

---

## 🔧 CONFIGURAÇÃO AVANÇADA

### Docker Compose para Coolify

Criar `docker-compose.coolify.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - APP_ENV=production
      - DB_HOST=${DB_HOST}
      - DB_DATABASE=${DB_DATABASE}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - ./backend:/var/www/html
    ports:
      - "8000:8000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

---

## 📝 Comandos Pós-Deploy

### Backend

Após o deploy inicial, executar:

```bash
# No terminal do Coolify (ou via SSH no container)
php artisan migrate --force
php artisan db:seed  # Opcional
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

---

## 🔄 Deploy Automático

O Coolify detecta automaticamente mudanças no Git e faz redeploy.

**Configurar Webhook (opcional):**
1. No GitHub, ir em Settings → Webhooks
2. Adicionar webhook do Coolify
3. Push no `main` = deploy automático

---

## ✅ Verificações

### Backend:
- ✅ API: `https://api.seudominio.com/api/noticias`
- ✅ Deve retornar JSON

### Frontend:
- ✅ Site: `https://seudominio.com`
- ✅ Deve carregar a página inicial

### Banco de Dados:
- ✅ Conectar via MySQL client ou phpMyAdmin (se instalado)

---

## 🔧 Troubleshooting

### Erro de conexão com banco:

Verificar variáveis de ambiente `DB_HOST` (deve ser o host interno do MySQL no Coolify)

### Build falha:

Verificar logs do build no Coolify e garantir que todos os arquivos estão no Git

### Frontend não encontra API:

Verificar `NEXT_PUBLIC_API_URL` está correto no build

---

**Siga este guia para fazer deploy no Coolify!** 🚀

