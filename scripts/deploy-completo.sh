#!/bin/bash

# Script para fazer deploy completo (backend + frontend)
# Uso: ./scripts/deploy-completo.sh

set -e

echo "🚀 Deploy Completo"
echo "==================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Erro: Diretórios backend ou frontend não encontrados!${NC}"
    echo "Execute este script da raiz do projeto."
    exit 1
fi

echo -e "${BLUE}📦 Fazendo build do frontend...${NC}"
cd frontend
rm -rf .next out
npm run build
cd ..

echo -e "${GREEN}✅ Build concluído!${NC}"
echo ""
echo -e "${YELLOW}📋 Instruções para deploy no servidor:${NC}"
echo ""
echo "=== BACKEND ==="
echo "cd ~/public_html/api"
echo "git pull origin main"
echo "composer install --no-dev --optimize-autoloader"
echo "php artisan route:clear"
echo "php artisan config:clear"
echo "php artisan route:cache"
echo ""
echo "=== FRONTEND ==="
echo "Fazer upload da pasta 'frontend/out/' para 'public_html/' no cPanel"
echo ""
echo -e "${GREEN}✅ Tudo pronto para deploy!${NC}"

