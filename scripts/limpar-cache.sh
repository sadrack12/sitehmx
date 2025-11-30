#!/bin/bash

# Script para limpar cache do Laravel
# Uso: ./scripts/limpar-cache.sh

set -e

echo "🧹 Limpando Cache do Laravel"
echo "============================="

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

cd backend

echo -e "${YELLOW}📋 Instruções para limpar cache no servidor:${NC}"
echo ""
echo "No servidor (SSH), execute:"
echo ""
echo "cd ~/public_html/api"
echo "php artisan route:clear"
echo "php artisan config:clear"
echo "php artisan cache:clear"
echo "php artisan view:clear"
echo ""
echo "Depois, recriar caches:"
echo ""
echo "php artisan route:cache"
echo "php artisan config:cache"
echo ""
echo -e "${GREEN}✅ Cache limpo!${NC}"

