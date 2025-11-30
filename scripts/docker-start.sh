#!/bin/bash

# Script para iniciar ambiente Docker
# Uso: ./scripts/docker-start.sh

set -e

echo "🐳 Iniciando Ambiente Docker"
echo "============================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando!${NC}"
    echo "Inicie o Docker Desktop e tente novamente."
    exit 1
fi

echo -e "${GREEN}✅ Docker está rodando${NC}"

# Verificar se docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ docker-compose.yml não encontrado!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Construindo containers...${NC}"
docker-compose build

echo ""
echo -e "${BLUE}🚀 Iniciando containers...${NC}"
docker-compose up -d

echo ""
echo -e "${BLUE}⏳ Aguardando containers iniciarem...${NC}"
sleep 5

echo ""
echo -e "${BLUE}📋 Status dos containers:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}✅ Ambiente Docker iniciado!${NC}"
echo ""
echo -e "${YELLOW}📋 URLs:${NC}"
echo "  Backend:  http://localhost:8001"
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:8001/api"
echo ""
echo -e "${YELLOW}📋 Comandos úteis:${NC}"
echo "  Ver logs:     docker-compose logs -f"
echo "  Parar:        docker-compose stop"
echo "  Remover:      docker-compose down"
echo "  Reconstruir:  docker-compose build && docker-compose up -d"

