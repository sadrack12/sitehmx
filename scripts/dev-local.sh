#!/bin/bash

# Script para iniciar ambiente de desenvolvimento local
# Uso: ./scripts/dev-local.sh

set -e

echo "💻 Iniciando Ambiente de Desenvolvimento Local"
echo "================================================"

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

echo -e "${BLUE}📋 Verificando pré-requisitos...${NC}"

# Verificar PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PHP encontrado: $(php -v | head -1)${NC}"

# Verificar Composer
if ! command -v composer &> /dev/null; then
    echo -e "${RED}❌ Composer não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Composer encontrado${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js encontrado: $(node -v)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm encontrado${NC}"

echo ""
echo -e "${BLUE}📦 Verificando dependências do backend...${NC}"
if [ ! -d "backend/vendor" ]; then
    echo -e "${YELLOW}⚠️  Dependências não instaladas. Instalando...${NC}"
    cd backend
    composer install
    cd ..
else
    echo -e "${GREEN}✅ Dependências do backend instaladas${NC}"
fi

echo ""
echo -e "${BLUE}📦 Verificando dependências do frontend...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependências não instaladas. Instalando...${NC}"
    cd frontend
    npm install
    cd ..
else
    echo -e "${GREEN}✅ Dependências do frontend instaladas${NC}"
fi

echo ""
echo -e "${BLUE}📋 Verificando arquivos de configuração...${NC}"

# Verificar .env do backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  .env não encontrado. Copiando de .env.example...${NC}"
    cd backend
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Configure o arquivo .env antes de continuar!${NC}"
    cd ..
else
    echo -e "${GREEN}✅ .env do backend encontrado${NC}"
fi

# Verificar .env.local do frontend
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local não encontrado. Criando...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > frontend/.env.local
    echo -e "${GREEN}✅ .env.local criado${NC}"
else
    echo -e "${GREEN}✅ .env.local do frontend encontrado${NC}"
fi

echo ""
echo -e "${GREEN}✅ Ambiente pronto!${NC}"
echo ""
echo -e "${YELLOW}📋 Para iniciar os servidores:${NC}"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  php artisan serve"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Backend: http://localhost:8000${NC}"
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"

