#!/bin/bash

# Script para verificar ambiente local
# Uso: ./scripts/verificar-local.sh

set -e

echo "🔍 Verificando Ambiente Local"
echo "=============================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar PHP
echo -e "${BLUE}📋 PHP:${NC}"
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -1)
    echo -e "${GREEN}✅ $PHP_VERSION${NC}"
else
    echo -e "${RED}❌ PHP não encontrado${NC}"
fi

# Verificar Composer
echo -e "${BLUE}📋 Composer:${NC}"
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✅ Composer instalado${NC}"
else
    echo -e "${RED}❌ Composer não encontrado${NC}"
fi

# Verificar Node.js
echo -e "${BLUE}📋 Node.js:${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado${NC}"
fi

# Verificar npm
echo -e "${BLUE}📋 npm:${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm não encontrado${NC}"
fi

# Verificar MySQL
echo -e "${BLUE}📋 MySQL:${NC}"
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✅ MySQL instalado${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL não encontrado (pode usar SQLite)${NC}"
fi

echo ""
echo -e "${BLUE}📋 Backend:${NC}"
if [ -d "backend" ]; then
    if [ -f "backend/.env" ]; then
        echo -e "${GREEN}✅ Diretório backend existe${NC}"
        echo -e "${GREEN}✅ Arquivo .env existe${NC}"
    else
        echo -e "${YELLOW}⚠️  .env não encontrado${NC}"
    fi
    
    if [ -d "backend/vendor" ]; then
        echo -e "${GREEN}✅ Dependências instaladas${NC}"
    else
        echo -e "${YELLOW}⚠️  Dependências não instaladas (execute: cd backend && composer install)${NC}"
    fi
else
    echo -e "${RED}❌ Diretório backend não encontrado${NC}"
fi

echo ""
echo -e "${BLUE}📋 Frontend:${NC}"
if [ -d "frontend" ]; then
    if [ -f "frontend/.env.local" ]; then
        echo -e "${GREEN}✅ Diretório frontend existe${NC}"
        echo -e "${GREEN}✅ Arquivo .env.local existe${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.local não encontrado${NC}"
    fi
    
    if [ -d "frontend/node_modules" ]; then
        echo -e "${GREEN}✅ Dependências instaladas${NC}"
    else
        echo -e "${YELLOW}⚠️  Dependências não instaladas (execute: cd frontend && npm install)${NC}"
    fi
else
    echo -e "${RED}❌ Diretório frontend não encontrado${NC}"
fi

echo ""
echo -e "${GREEN}✅ Verificação concluída!${NC}"

