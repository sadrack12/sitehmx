#!/bin/bash

# Script para verificar rotas no servidor
# Execute no servidor: bash verificar-rotas-servidor.sh

set -e

echo "🔍 Verificando Rotas no Servidor"
echo "=================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "artisan" ]; then
    echo -e "${RED}❌ Erro: artisan não encontrado!${NC}"
    echo "Execute este script de: ~/public_html/api"
    exit 1
fi

echo -e "${BLUE}📋 Rotas de consulta-online:${NC}"
php artisan route:list | grep "consulta-online" || echo -e "${YELLOW}⚠️  Nenhuma rota encontrada${NC}"

echo ""
echo -e "${BLUE}📋 Rotas públicas (noticias, eventos, etc):${NC}"
php artisan route:list | grep -E "noticias|eventos|corpo-diretivo" || echo -e "${YELLOW}⚠️  Nenhuma rota encontrada${NC}"

echo ""
echo -e "${BLUE}📋 Verificando se há rotas com /public/:${NC}"
php artisan route:list | grep "/public/" && echo -e "${RED}❌ Encontrado rotas com /public/ (deve ser corrigido)${NC}" || echo -e "${GREEN}✅ Nenhuma rota com /public/ encontrada${NC}"

echo ""
echo -e "${GREEN}✅ Verificação concluída!${NC}"

