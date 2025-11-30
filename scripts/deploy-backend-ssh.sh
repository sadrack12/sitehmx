#!/bin/bash

# Script para fazer deploy do backend via SSH
# Execute no servidor: bash deploy-backend-ssh.sh
# OU copie e cole os comandos no servidor

set -e

echo "🚀 Deploy do Backend via SSH"
echo "=============================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "composer.json" ]; then
    echo -e "${RED}❌ Erro: composer.json não encontrado!${NC}"
    echo "Execute este script de: ~/public_html/api"
    exit 1
fi

echo -e "${BLUE}📋 Limpando cache...${NC}"
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo -e "${BLUE}💾 Recriando cache...${NC}"
php artisan route:cache
php artisan config:cache

echo -e "${BLUE}📦 Verificando rotas...${NC}"
echo ""
echo "Rotas de consulta-online:"
php artisan route:list | grep "consulta-online" || echo "Nenhuma rota encontrada"
echo ""
echo "Rotas públicas:"
php artisan route:list | grep -E "noticias|eventos|corpo-diretivo" || echo "Nenhuma rota encontrada"

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"

