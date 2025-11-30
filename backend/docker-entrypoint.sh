#!/bin/bash
set -e

# Instalar dependências se vendor não existir
if [ ! -d "vendor" ]; then
    echo "Instalando dependências do Composer..."
    composer install --no-scripts
    composer dump-autoload
fi

# Criar .env se não existir
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env 2>/dev/null || echo "APP_KEY=" > .env
fi

# Executar scripts do Composer apenas se .env estiver configurado
if grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    php artisan package:discover --ansi || true
fi

# Executar comando passado
exec "$@"

