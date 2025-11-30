#!/bin/bash

# Script para preparar o backend para deploy no cPanel
# Uso: ./scripts/prepare-backend-cpanel.sh

set -e

echo "🔧 Preparando backend para deploy no cPanel..."
echo ""

cd "$(dirname "$0")/../backend"

# Verificar se está no diretório correto
if [ ! -f "composer.json" ]; then
    echo "❌ Erro: Execute este script a partir da raiz do projeto"
    exit 1
fi

# Verificar se composer está instalado
if ! command -v composer &> /dev/null; then
    echo "❌ Composer não encontrado. Instale o Composer primeiro."
    exit 1
fi

echo "📦 Instalando dependências de produção..."
composer install --optimize-autoloader --no-dev

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "📝 Arquivo .env não encontrado."
    if [ -f ".env.example" ]; then
        echo "   Copiando .env.example para .env..."
        cp .env.example .env
    else
        echo "   Criando .env vazio..."
        touch .env
    fi
fi

# Gerar APP_KEY se não existir
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Gerando APP_KEY..."
    php artisan key:generate
    
    # Extrair a APP_KEY gerada
    APP_KEY=$(grep "APP_KEY=" .env | cut -d '=' -f2-)
    echo ""
    echo "✅ APP_KEY gerada: $APP_KEY"
    echo ""
    echo "⚠️  IMPORTANTE: Copie esta chave! Você precisará dela no servidor!"
else
    echo "✅ APP_KEY já existe no .env"
    APP_KEY=$(grep "APP_KEY=" .env | cut -d '=' -f2-)
    echo "   APP_KEY: $APP_KEY"
fi

echo ""
echo "🧹 Limpando caches..."
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

echo ""
echo "✅ Backend preparado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. 📤 Upload para o servidor:"
echo "   - Faça upload de TODOS os arquivos para public_html/api/"
echo "   - EXCETO: vendor/, .env, .git/"
echo ""
echo "2. 🗄️  No servidor, instale as dependências:"
echo "   cd ~/public_html/api"
echo "   composer install --optimize-autoloader --no-dev"
echo ""
echo "3. 📝 Configure o .env no servidor com:"
echo "   - APP_KEY: $APP_KEY"
echo "   - Credenciais do banco de dados"
echo "   - URLs corretas (APP_URL, FRONTEND_URL)"
echo ""
echo "4. ⚙️  Execute no servidor:"
echo "   php artisan migrate --force"
echo "   php artisan storage:link"
echo "   php artisan config:cache"
echo ""
echo "📚 Para mais detalhes, consulte: BACKEND_CPANEL.md"
echo ""
echo "⚠️  NÃO faça upload do arquivo .env para o servidor!"
echo "   Crie um novo .env no servidor com as configurações de produção."

