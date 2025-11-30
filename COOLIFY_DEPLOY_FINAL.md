# 🚀 Deploy Final no Coolify - Guia Completo

## 📋 Informações do Projeto

- **Domínio:** `hospitalgeraldomoxico.com`
- **Repositório:** `https://github.com/sadrack12/sitehmx.git`
- **Branch:** `main`

---

## 🎯 Estrutura no Coolify

### 1. Backend (Laravel API)
- **Acesso interno** via proxy reverso
- **Porta:** `8000`

### 2. Frontend (Next.js)
- **Domínio público:** `hospitalgeraldomoxico.com`
- **Porta:** `80`

### 3. MySQL
- **Recurso MySQL** no Coolify

---

## 📦 PASSO 1: Criar Aplicação Backend

### Configuração no Coolify:

1. **Nome:** `sitehmx-backend`
2. **Tipo:** Dockerfile
3. **Repositório:** `https://github.com/sadrack12/sitehmx.git`
4. **Branch:** `main`
5. **Dockerfile Context:** `backend` ⚠️ (diretório onde está o Dockerfile)
6. **Dockerfile Path:** `Dockerfile` ⚠️ (nome do arquivo, sem caminho)
7. **Porta:** `8000`

### Variáveis de Ambiente:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hospitalgeraldomoxico.com
DB_HOST=sitehmx-mysql
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=SUA_SENHA_AQUI
FRONTEND_URL=https://hospitalgeraldomoxico.com
DAILY_API_KEY=SUA_CHAVE_DAILY_CO
DAILY_DOMAIN=clamatec.daily.co
```

### ⚠️ IMPORTANTE:
- **NÃO configure domínio público** para o backend
- Backend será acessado internamente via proxy reverso

---

## 📦 PASSO 2: Criar Recurso MySQL

1. **Tipo:** MySQL Resource
2. **Nome:** `sitehmx-mysql`
3. **Versão:** 8.0
4. **Database:** `sitehmx`
5. **Username:** `sitehmx`
6. **Password:** (definir ou gerar pelo Coolify)

**Anote as credenciais** para usar na variável `DB_HOST` do backend!

---

## 📦 PASSO 3: Criar Aplicação Frontend

### Configuração no Coolify:

1. **Nome:** `sitehmx-frontend`
2. **Tipo:** Dockerfile
3. **Repositório:** `https://github.com/sadrack12/sitehmx.git`
4. **Branch:** `main`
5. **Dockerfile Context:** `frontend`
6. **Dockerfile Path:** `Dockerfile.production`
7. **Porta:** `80`

### Variáveis de Ambiente:

```env
NEXT_PUBLIC_API_URL=https://hospitalgeraldomoxico.com/api
NODE_ENV=production
```

### Domínio:
- **Domínio público:** `hospitalgeraldomoxico.com`
- SSL será configurado automaticamente pelo Coolify

---

## 📦 PASSO 4: Configurar Proxy Reverso

O Coolify precisa rotear `/api/*` para o backend.

### No Frontend, configure Traefik Labels:

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

**OU** configure no Coolify via interface (se disponível):
- Route `/api` → Backend service `sitehmx-backend:8000`

---

## 📦 PASSO 5: Primeiro Deploy

1. Salve todas as configurações no Coolify
2. Faça o deploy do **Backend** primeiro
3. Depois faça deploy do **Frontend**
4. Aguarde os builds completarem

---

## 📦 PASSO 6: Configurar Backend (Após Deploy)

Após o deploy do backend, execute no terminal do Coolify (ou via SSH):

```bash
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

---

## ✅ Verificações Finais

### 1. Frontend:
- ✅ Acesse: `https://hospitalgeraldomoxico.com`
- ✅ Deve carregar a página inicial

### 2. API:
- ✅ Acesse: `https://hospitalgeraldomoxico.com/api/noticias`
- ✅ Deve retornar JSON com notícias

### 3. Banco de Dados:
- ✅ Verifique se as tabelas foram criadas (via terminal ou phpMyAdmin)

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

1. **Commit e Push para GitHub:**
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

2. **Deploy automático:** O Coolify detecta mudanças e faz deploy automático

3. **Ou deploy manual:** Vá no Coolify e clique em "Deploy"

---

## 🆘 Troubleshooting

### Erro de build:
- Verifique os logs no Coolify
- Confirme que o Dockerfile Context e Path estão corretos

### Erro de conexão com banco:
- Verifique `DB_HOST` (deve ser o nome do recurso MySQL)
- Confirme que MySQL está rodando

### API não funciona:
- Verifique proxy reverso configurado
- Confirme que backend está rodando na porta 8000

---

## 📚 Documentação Adicional

- `COOLIFY_QUICK_START.md` - Guia rápido resumido
- `COOLIFY_SETUP_COMPLETO.md` - Guia completo detalhado
- `COOLIFY_CONFIGURACAO_FINAL.md` - Configuração técnica

---

**Pronto para deploy! Siga os passos acima e sua aplicação estará no ar!** 🚀

