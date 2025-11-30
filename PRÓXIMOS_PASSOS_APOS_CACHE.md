# ✅ Cache Limpo! Próximos Passos

## 🎉 Cache foi limpo com sucesso!

Agora execute estes comandos na ordem:

---

## 📝 Passo 1: Verificar/Criar .env

```bash
# Verificar se .env existe
ls -la .env

# Se não existir, criar
cp .env.example .env 2>/dev/null || touch .env

# Verificar se tem APP_KEY
grep APP_KEY .env

# Se não tiver, gerar
php artisan key:generate
```

---

## 🧪 Passo 2: Testar Laravel

```bash
# Testar se funciona agora
php artisan --version

# Se funcionar, você verá algo como: Laravel Framework 10.x.x
```

---

## ⚙️ Passo 3: Configurar Permissões

```bash
# Dar permissões necessárias
chmod -R 775 storage bootstrap/cache

# Verificar
ls -ld storage bootstrap/cache
```

---

## 🗄️ Passo 4: Configurar .env

Edite o arquivo `.env` com suas configurações:

```bash
nano .env
```

**Configure pelo menos:**

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seudominio.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=seu_banco
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha

FRONTEND_URL=https://seudominio.com
```

---

## 🚀 Passo 5: Executar Migrações

```bash
# Executar migrações do banco de dados
php artisan migrate --force

# Criar link do storage
php artisan storage:link

# Otimizar cache (agora vai funcionar!)
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## ✅ Comandos Rápidos (Execute Tudo)

```bash
cd ~/public_html/api && \
cp .env.example .env 2>/dev/null || touch .env && \
php artisan key:generate && \
chmod -R 775 storage bootstrap/cache && \
php artisan --version
```

---

**Execute o Passo 1 primeiro para criar/configurar o .env!** ✅

