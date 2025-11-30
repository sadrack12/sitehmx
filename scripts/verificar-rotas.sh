#!/bin/bash

# Script para verificar rotas no código
# Uso: ./scripts/verificar-rotas.sh

set -e

echo "🔍 Verificando Rotas no Código"
echo "================================"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Verificando rotas com /public/ no backend...${NC}"
PUBLIC_COUNT=$(grep -r "/public/" backend/app/Http/Controllers --include="*.php" 2>/dev/null | grep -v "storage/app/public" | wc -l | tr -d ' ')
if [ "$PUBLIC_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Encontrado $PUBLIC_COUNT ocorrências de /public/ no backend${NC}"
    grep -r "/public/" backend/app/Http/Controllers --include="*.php" 2>/dev/null | grep -v "storage/app/public" | head -5
else
    echo -e "${GREEN}✅ Nenhuma rota com /public/ encontrada no backend${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Verificando duplicação /api/api/ no frontend...${NC}"
API_API_COUNT=$(grep -r "/api/api/" frontend/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$API_API_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Encontrado $API_API_COUNT ocorrências de /api/api/ no frontend${NC}"
    grep -r "/api/api/" frontend/src --include="*.tsx" --include="*.ts" 2>/dev/null | head -5
else
    echo -e "${GREEN}✅ Nenhuma duplicação /api/api/ encontrada no frontend${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Verificando rotas /api/exames (deve ser /api/admin/exames)...${NC}"
EXAMES_COUNT=$(grep -r "/api/exames" frontend/src --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "/api/admin/exames" | wc -l | tr -d ' ')
if [ "$EXAMES_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Encontrado $EXAMES_COUNT ocorrências de /api/exames (deve ser /api/admin/exames)${NC}"
    grep -r "/api/exames" frontend/src --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "/api/admin/exames" | head -5
else
    echo -e "${GREEN}✅ Todas as rotas de exames estão corretas${NC}"
fi

echo ""
echo -e "${GREEN}✅ Verificação concluída!${NC}"

