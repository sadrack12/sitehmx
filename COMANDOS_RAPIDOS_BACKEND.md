# ⚡ Comandos Rápidos: Backend no cPanel

## 🎯 Situação Atual

Você está em: `~/public_html/api/backend/`

## ✅ OPÇÃO 1: Mover para Simplificar (Recomendado)

Execute estes comandos na ordem:

```bash
# 1. Ir para o diretório do Laravel
cd ~/public_html/api/backend

# 2. Mover todos os arquivos um nível acima
mv app bootstrap config database public resources routes storage artisan composer.json composer.lock ~/public_html/api/ 2>/dev/null

# 3. Voltar para api/
cd ~/public_html/api

# 4. Verificar se moveu
ls -la

# 5. Instalar dependências (sem scripts)
composer install --optimize-autoloader --no-dev --no-scripts

# 6. Gerar autoloader
composer dump-autoload --optimize

# 7. Criar .env
cp .env.example .env 2>/dev/null || touch .env

# 8. Configurar permissões
chmod -R 775 storage bootstrap/cache

# 9. Gerar APP_KEY
php artisan key:generate

# 10. Executar migrações
php artisan migrate --force

# 11. Criar link do storage
php artisan storage:link

# 12. Otimizar cache
php artisan config:cache
php artisan route:cache
```

**Pronto!** Agora a API está acessível em: `https://seudominio.com/api/public/`

---

## ✅ OPÇÃO 2: Manter Estrutura Atual

Se preferir manter em `backend/`:

```bash
# 1. Continuar em backend/
cd ~/public_html/api/backend

# 2. Instalar dependências (sem scripts)
composer install --optimize-autoloader --no-dev --no-scripts

# 3. Gerar autoloader
composer dump-autoload --optimize

# 4. Criar .env
cp .env.example .env 2>/dev/null || touch .env

# 5. Configurar permissões
chmod -R 775 storage bootstrap/cache

# 6. Gerar APP_KEY
php artisan key:generate

# 7. Executar migrações
php artisan migrate --force

# 8. Criar link do storage
php artisan storage:link

# 9. Otimizar cache
php artisan config:cache
php artisan route:cache
```

**Depois configure acesso:** A API estará em `/api/backend/public/` ou configure subdomínio apontando para `public_html/api/backend/public`

---

## 🔍 Verificar Estrutura

```bash
# Ver onde você está
pwd

# Ver estrutura
ls -la

# Verificar se public/ existe
ls -la public/index.php
```

---

## ⚠️ Se Der Erro no Composer

```bash
# Limpar cache
composer clear-cache

# Tentar novamente com --no-scripts
composer install --optimize-autoloader --no-dev --no-scripts

# Se ainda der erro, usar Composer local
curl -sS https://getcomposer.org/installer | php
php composer.phar install --optimize-autoloader --no-dev --no-scripts
```

---

## 📝 Configurar .env

Depois de instalar, edite o `.env`:

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_KEY=base64:GERADO_PELO_KEY_GENERATE
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

**Copie e cole os comandos da Opção 1 acima para simplificar!** 🚀

