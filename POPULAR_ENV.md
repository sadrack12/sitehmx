# 📝 Popular Arquivo .env

## ✅ Arquivo .env Existe (mas está vazio)!

Vamos popular com as configurações necessárias.

---

## 🎯 Opção 1: Criar .env Completo (Recomendado)

Execute este comando para criar o .env com configurações básicas:

```bash
cat > .env << 'ENVEOF'
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://seudominio.com/api

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com
ENVEOF
```

**Depois edite manualmente para adicionar:**
- DB_DATABASE
- DB_USERNAME  
- DB_PASSWORD
- APP_URL (com seu domínio)

---

## 🎯 Opção 2: Editar Manualmente

```bash
# Editar .env
nano .env
```

**Cole este conteúdo:**

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://seudominio.com/api

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=seu_banco_aqui
DB_USERNAME=seu_usuario_aqui
DB_PASSWORD=sua_senha_aqui

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com
```

**Substitua:**
- `seudominio.com` → seu domínio
- `seu_banco_aqui` → nome do banco
- `seu_usuario_aqui` → usuário do banco
- `sua_senha_aqui` → senha do banco

**Salvar no nano:** `Ctrl+X`, `Y`, `Enter`

---

## 🔑 Passo Importante: Gerar APP_KEY

Depois de criar o .env, execute:

```bash
php artisan key:generate
```

Isso vai preencher o `APP_KEY=` automaticamente.

---

## ✅ Verificar

```bash
# Ver conteúdo do .env
cat .env

# Ver se APP_KEY foi gerada (depois de key:generate)
grep APP_KEY .env
```

---

**Use a Opção 1 (comando cat) para criar rapidamente!** ✅

