#!/bin/bash

# Script para deploy completo no VPS
# Uso: ./scripts/deploy-vps.sh

set -e

echo "🚀 Deploy Completo no VPS"
echo "=========================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Erro: Diretórios backend ou frontend não encontrados!${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Atualizando código do Git...${NC}"
git pull origin main || echo -e "${YELLOW}⚠️  Git pull falhou, continuando...${NC}"

echo ""
echo -e "${BLUE}📦 Deploy do Backend...${NC}"
cd backend

# Instalar dependências
echo -e "${YELLOW}Instalando dependências do backend...${NC}"
composer install --no-dev --optimize-autoloader

# Limpar cache
echo -e "${YELLOW}Limpando cache...${NC}"
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# Executar migrations
echo -e "${YELLOW}Executando migrations...${NC}"
php artisan migrate --force

# Recriar cache
echo -e "${YELLOW}Recriando cache...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

cd ..

echo ""
echo -e "${BLUE}📦 Deploy do Frontend...${NC}"
cd frontend

# Instalar dependências
echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
npm install

# Fazer build
echo -e "${YELLOW}Fazendo build do frontend...${NC}"
npm run build

cd ..

echo ""
echo -e "${BLUE}🔧 Configurando permissões...${NC}"
sudo chown -R www-data:www-data backend/storage backend/bootstrap/cache
sudo chmod -R 775 backend/storage backend/bootstrap/cache
sudo chown -R www-data:www-data frontend/out

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Verificar serviços: sudo systemctl status nginx php8.1-fpm mysql"
echo "2. Testar API: curl https://seudominio.com/api/noticias"
echo "3. Verificar logs: tail -f backend/storage/logs/laravel.log"

