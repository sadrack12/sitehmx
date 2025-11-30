#!/bin/bash

# Script para verificar status do projeto
# Uso: ./scripts/status-projeto.sh

set -e

echo "📊 Status do Projeto"
echo "===================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Git Status
echo -e "${BLUE}📋 Status do Git:${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Branch: $(git branch --show-current)"
    echo "Commits: $(git log --oneline | wc -l | tr -d ' ')"
    echo "Remote: $(git remote get-url origin 2>/dev/null || echo 'Não configurado')"
    echo ""
    echo "Mudanças não commitadas:"
    git status --short | head -10
else
    echo -e "${RED}❌ Não é um repositório Git${NC}"
fi

echo ""
echo -e "${BLUE}📦 Backend:${NC}"
if [ -d "backend" ]; then
    echo "✅ Diretório existe"
    if [ -f "backend/composer.json" ]; then
        echo "✅ composer.json existe"
    fi
    if [ -f "backend/.env" ]; then
        echo "✅ .env existe"
    else
        echo -e "${YELLOW}⚠️  .env não existe${NC}"
    fi
else
    echo -e "${RED}❌ Diretório não existe${NC}"
fi

echo ""
echo -e "${BLUE}📦 Frontend:${NC}"
if [ -d "frontend" ]; then
    echo "✅ Diretório existe"
    if [ -f "frontend/package.json" ]; then
        echo "✅ package.json existe"
    fi
    if [ -d "frontend/out" ]; then
        echo "✅ Build existe (out/)"
    else
        echo -e "${YELLOW}⚠️  Build não existe (execute: npm run build)${NC}"
    fi
else
    echo -e "${RED}❌ Diretório não existe${NC}"
fi

echo ""
echo -e "${GREEN}✅ Verificação concluída!${NC}"

