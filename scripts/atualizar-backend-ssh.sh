#!/bin/bash

# Script completo para atualizar backend no servidor
# Execute no servidor: bash atualizar-backend-ssh.sh

set -e

echo "🔄 Atualizando Backend no Servidor"
echo "===================================="

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
    echo ""
    echo "Comando: cd ~/public_html/api"
    exit 1
fi

echo -e "${BLUE}📋 Verificando arquivos...${NC}"

# Verificar se arquivos existem
if [ ! -f "app/Http/Controllers/Api/PublicController.php" ]; then
    echo -e "${RED}❌ PublicController.php não encontrado!${NC}"
    echo "Faça upload do arquivo primeiro."
    exit 1
fi

if [ ! -f "app/Providers/AppServiceProvider.php" ]; then
    echo -e "${RED}❌ AppServiceProvider.php não encontrado!${NC}"
    echo "Faça upload do arquivo primeiro."
    exit 1
fi

if [ ! -f ".htaccess" ]; then
    echo -e "${YELLOW}⚠️  .htaccess não encontrado na raiz${NC}"
fi

echo -e "${GREEN}✅ Arquivos encontrados${NC}"

echo ""
echo -e "${BLUE}🧹 Limpando cache...${NC}"
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo ""
echo -e "${BLUE}💾 Recriando cache...${NC}"
php artisan route:cache
php artisan config:cache

echo ""
echo -e "${BLUE}🔍 Verificando rotas...${NC}"
echo ""
echo "Rotas de consulta-online:"
php artisan route:list | grep "consulta-online" || echo "Nenhuma encontrada"

echo ""
echo "Rotas públicas:"
php artisan route:list | grep -E "noticias|eventos|corpo-diretivo" || echo "Nenhuma encontrada"

echo ""
echo -e "${BLUE}🔍 Verificando se há rotas com /public/:${NC}"
PUBLIC_ROUTES=$(php artisan route:list | grep "/public/" | wc -l)
if [ "$PUBLIC_ROUTES" -gt 0 ]; then
    echo -e "${RED}❌ Encontrado $PUBLIC_ROUTES rotas com /public/${NC}"
    php artisan route:list | grep "/public/"
else
    echo -e "${GREEN}✅ Nenhuma rota com /public/ encontrada${NC}"
fi

echo ""
echo -e "${GREEN}✅ Atualização concluída!${NC}"

