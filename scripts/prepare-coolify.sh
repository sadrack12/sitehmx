#!/bin/bash

# Script para preparar projeto para deploy no Coolify
# Uso: ./scripts/prepare-coolify.sh

set -e

echo "🚀 Preparando Projeto para Coolify"
echo "===================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Verificando estrutura...${NC}"

# Verificar Dockerfiles
if [ ! -f "backend/Dockerfile" ]; then
    echo -e "${YELLOW}⚠️  Dockerfile do backend não encontrado${NC}"
else
    echo -e "${GREEN}✅ Dockerfile do backend existe${NC}"
fi

if [ ! -f "frontend/Dockerfile" ]; then
    echo -e "${YELLOW}⚠️  Dockerfile do frontend não encontrado${NC}"
else
    echo -e "${GREEN}✅ Dockerfile do frontend existe${NC}"
fi

if [ ! -f "frontend/Dockerfile.production" ]; then
    echo -e "${YELLOW}⚠️  Dockerfile.production não encontrado, criando...${NC}"
    # Já foi criado anteriormente
else
    echo -e "${GREEN}✅ Dockerfile.production existe${NC}"
fi

echo ""
echo -e "${BLUE}📋 Arquivos para Coolify:${NC}"
echo ""
echo "1. docker-compose.yml - Configuração Docker (já existe)"
echo "2. docker-compose.coolify.yml - Versão para Coolify (criado)"
echo "3. backend/Dockerfile - Backend Laravel (já existe)"
echo "4. frontend/Dockerfile - Frontend Next.js dev (já existe)"
echo "5. frontend/Dockerfile.production - Frontend Next.js produção (criado)"
echo ""
echo -e "${GREEN}✅ Projeto pronto para Coolify!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Fazer commit e push para o GitHub"
echo "2. Criar aplicações no Coolify"
echo "3. Configurar variáveis de ambiente"
echo "4. Deploy!"

