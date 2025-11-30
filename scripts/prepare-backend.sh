#!/bin/bash

# Script para preparar o backend para deploy no cPanel
# Uso: ./scripts/prepare-backend.sh

set -e

echo "🚀 Preparando backend para deploy no cPanel..."

cd "$(dirname "$0")/../backend"

# Verificar se composer está instalado
if ! command -v composer &> /dev/null; then
    echo "❌ Composer não encontrado. Instale o Composer primeiro."
    exit 1
fi

# Instalar dependências de produção
echo "📦 Instalando dependências de produção..."
composer install --optimize-autoloader --no-dev

# Gerar chave se não existir
if [ ! -f .env ]; then
    echo "📝 Arquivo .env não encontrado. Criando a partir do .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "⚠️  .env.example não encontrado. Você precisará criar o .env manualmente."
    fi
fi

# Verificar se APP_KEY está definido
if grep -q "APP_KEY=$" .env 2>/dev/null || ! grep -q "APP_KEY=" .env 2>/dev/null; then
    echo "🔑 Gerando APP_KEY..."
    php artisan key:generate
fi

# Limpar caches
echo "🧹 Limpando caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "✅ Backend preparado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo .env com as credenciais de produção"
echo "2. Faça upload dos arquivos para o servidor (exceto .env)"
echo "3. Crie o arquivo .env no servidor com as configurações corretas"
echo "4. Execute as migrações no servidor: php artisan migrate --force"
echo ""
echo "⚠️  IMPORTANTE: Não faça upload do arquivo .env para o servidor!"
echo "   Crie um novo .env no servidor com as configurações de produção."

