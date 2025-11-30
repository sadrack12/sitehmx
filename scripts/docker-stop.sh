#!/bin/bash

# Script para parar ambiente Docker
# Uso: ./scripts/docker-stop.sh

set -e

echo "🛑 Parando Ambiente Docker"
echo "=========================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

docker-compose stop

echo -e "${GREEN}✅ Containers parados${NC}"
echo ""
echo -e "${YELLOW}Para remover containers: docker-compose down${NC}"
echo -e "${YELLOW}Para remover volumes: docker-compose down -v${NC}"

