#!/bin/bash

# Script para fazer deploy do backend no servidor via Git
# Uso: ./scripts/deploy-backend.sh

set -e

echo "🚀 Deploy do Backend via Git"
echo "================================"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Erro: Diretório backend não encontrado!${NC}"
    echo "Execute este script da raiz do projeto."
    exit 1
fi

echo -e "${YELLOW}📋 Instruções para deploy no servidor:${NC}"
echo ""
echo "1. No servidor (SSH), execute:"
echo ""
echo "   cd ~/public_html/api"
echo "   git pull origin main"
echo "   composer install --no-dev --optimize-autoloader"
echo "   php artisan route:clear"
echo "   php artisan config:clear"
echo "   php artisan route:cache"
echo ""
echo -e "${GREEN}✅ Pronto! Backend atualizado.${NC}"

