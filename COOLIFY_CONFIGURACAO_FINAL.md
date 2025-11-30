# ✅ Configuração Final e Mais Correta para Coolify

## 🎯 Estratégia Recomendada

**Usar `Dockerfile.production` que faz build no servidor** durante o deploy.

### ✅ Vantagens:
- Sempre usa a versão mais recente do código
- Build otimizado para produção
- Não depende da pasta `out/` no repositório
- Padrão da indústria (CI/CD)

---

## 📋 Configuração Completa

### 1. Backend

**No Coolify:**
- **Nome:** `sitehmx-backend`
- **Tipo:** Dockerfile
- **Repositório:** `https://github.com/sadrack12/sitehmx.git`
- **Branch:** `main`
- **Dockerfile Context:** `backend`
- **Dockerfile Path:** `Dockerfile.production`
- **Porta:** `8000`

**Variáveis de Ambiente:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hospitalgeraldomoxico.com
DB_HOST=sitehmx-mysql
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=sua_senha_segura
FRONTEND_URL=https://hospitalgeraldomoxico.com
DAILY_API_KEY=sua_chave_daily_co
DAILY_DOMAIN=clamatec.daily.co
```

**Domínio:** ❌ NÃO configure (acesso apenas interno)

---

### 2. Frontend

**No Coolify:**
- **Nome:** `sitehmx-frontend`
- **Tipo:** Dockerfile
- **Repositório:** `https://github.com/sadrack12/sitehmx.git`
- **Branch:** `main`
- **Dockerfile Context:** `frontend`
- **Dockerfile Path:** `Dockerfile.production`
- **Porta:** `80`

**Variáveis de Ambiente (Build Args):**
```env
NEXT_PUBLIC_API_URL=https://hospitalgeraldomoxico.com/api
NODE_ENV=production
```

**Domínio:** ✅ `hospitalgeraldomoxico.com`

**⚠️ IMPORTANTE:** Configure `NEXT_PUBLIC_API_URL` como **Build Argument** ou **Environment Variable** para que seja incluído no build.

---

### 3. MySQL

**No Coolify:**
- **Tipo:** MySQL Resource
- **Nome:** `sitehmx-mysql`
- **Versão:** 8.0
- **Database:** `sitehmx`
- **Username:** `sitehmx`
- **Password:** (definir ou gerar)

---

## 🔧 Configuração de Proxy Reverso

O Coolify (Traefik) precisa rotear `/api/*` para o backend.

**No Frontend, configure Traefik Labels:**

```yaml
# Frontend (páginas HTML)
traefik.http.routers.frontend.rule: Host(`hospitalgeraldomoxico.com`) && !PathPrefix(`/api`)
traefik.http.routers.frontend.entrypoints: websecure
traefik.http.routers.frontend.tls.certresolver: letsencrypt

# API (proxy para backend)
traefik.http.routers.api.rule: Host(`hospitalgeraldomoxico.com`) && PathPrefix(`/api`)
traefik.http.routers.api.entrypoints: websecure
traefik.http.routers.api.tls.certresolver: letsencrypt
traefik.http.services.api.loadbalancer.server.port: 8000
traefik.http.services.api.loadbalancer.server.url: http://sitehmx-backend:8000
```

---

## 🚀 Fluxo de Deploy

1. Push para GitHub → `main` branch
2. Coolify detecta mudanças
3. **Backend:** Build da imagem Docker
4. **Frontend:** Build do Next.js + servir arquivos estáticos
5. Deploy automático

---

## ✅ URLs Finais

- **Frontend:** `https://hospitalgeraldomoxico.com`
- **API:** `https://hospitalgeraldomoxico.com/api/noticias`

---

**Esta é a configuração mais correta e profissional!** 🚀

