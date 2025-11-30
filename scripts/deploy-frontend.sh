#!/bin/bash

# Script para fazer build e preparar frontend para deploy
# Uso: ./scripts/deploy-frontend.sh

set -e

echo "🚀 Build e Deploy do Frontend"
echo "================================"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Erro: Diretório frontend não encontrado!${NC}"
    echo "Execute este script da raiz do projeto."
    exit 1
fi

# Ir para o diretório frontend
cd frontend

echo -e "${BLUE}📦 Limpando builds antigos...${NC}"
rm -rf .next out

echo -e "${BLUE}🔨 Fazendo build do Next.js...${NC}"
npm run build

if [ ! -d "out" ]; then
    echo -e "${RED}❌ Erro: Build falhou! Diretório out não foi criado.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo ""
echo "1. Fazer upload da pasta 'frontend/out/' para 'public_html/' no cPanel"
echo "2. OU fazer commit e push:"
echo ""
echo "   git add frontend/out/"
echo "   git commit -m 'Atualizar build do frontend'"
echo "   git push origin main"
echo ""
echo -e "${GREEN}✅ Frontend pronto para deploy!${NC}"

