# 📝 Configurar .env do Backend

## ✅ Arquivo .env Criado!

Agora vamos configurá-lo.

---

## 🔑 Passo 1: Gerar APP_KEY

```bash
php artisan key:generate
```

Isso vai gerar e adicionar a `APP_KEY` automaticamente no `.env`.

---

## ⚙️ Passo 2: Configurar .env

Edite o arquivo `.env`:

```bash
nano .env
```

### Configure estas variáveis:

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seudominio.com/api

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=seu_nome_banco_completo
DB_USERNAME=seu_usuario_completo
DB_PASSWORD=sua_senha

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com
```

**⚠️ IMPORTANTE - Substitua:**

1. **`seudominio.com`** → Seu domínio real
2. **`DB_DATABASE`** → Nome completo do banco (geralmente: `usuario_cpanel_nome_banco`)
3. **`DB_USERNAME`** → Nome completo do usuário (geralmente: `usuario_cpanel_nome_user`)
4. **`DB_PASSWORD`** → Senha do banco que você criou

**Como encontrar no cPanel:**
- cPanel → MySQL Databases
- Veja os nomes completos (com prefixo do usuário cPanel)

---

## 💾 Como Salvar no Nano

1. Edite o arquivo com `nano .env`
2. Adicione/altere as configurações
3. Para salvar:
   - Pressione `Ctrl + X`
   - Pressione `Y` (para confirmar)
   - Pressione `Enter`

---

## ✅ Passo 3: Verificar Configuração

Depois de salvar:

```bash
# Verificar se APP_KEY foi gerada
grep APP_KEY .env

# Verificar se banco está configurado
grep DB_DATABASE .env
```

---

## 🚀 Depois de Configurar

Execute:

```bash
# Testar conexão com banco
php artisan migrate --force

# Criar link do storage
php artisan storage:link

# Otimizar cache
php artisan config:cache
php artisan route:cache
```

---

**Execute primeiro: `php artisan key:generate` e depois edite o .env!** ✅

