#!/bin/bash

# Script para fazer commit e push rápido
# Uso: ./scripts/git-commit.sh "mensagem do commit"

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se mensagem foi fornecida
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: Mensagem do commit não fornecida!${NC}"
    echo "Uso: ./scripts/git-commit.sh \"mensagem do commit\""
    exit 1
fi

MESSAGE="$1"

echo "📝 Fazendo commit e push..."
echo "=============================="

# Verificar status
echo -e "${YELLOW}📋 Status atual:${NC}"
git status --short | head -10

# Adicionar todos os arquivos
echo -e "${YELLOW}➕ Adicionando arquivos...${NC}"
git add .

# Fazer commit
echo -e "${YELLOW}💾 Fazendo commit...${NC}"
git commit -m "$MESSAGE"

# Fazer push
echo -e "${YELLOW}🚀 Fazendo push...${NC}"
git push origin main

echo -e "${GREEN}✅ Commit e push concluídos!${NC}"
echo ""
echo "Repositório: https://github.com/sadrack12/sitehmx"

