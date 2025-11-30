#!/bin/bash
set -e

echo "🚀 Iniciando Laravel em produção..."

# Instalar dependências se vendor não existir
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependências do Composer..."
    composer install --no-dev --optimize-autoloader --no-scripts
    composer dump-autoload --optimize
fi

# Criar .env se não existir
if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env 2>/dev/null || echo "APP_KEY=" > .env
fi

# Gerar chave se não existir
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate --force || true
fi

# Configurar cache
echo "⚡ Otimizando aplicação..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Configurar permissões
echo "🔒 Configurando permissões..."
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
chmod -R 775 storage bootstrap/cache

# Executar comando passado
exec "$@"

