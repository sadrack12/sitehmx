#!/bin/bash

# Script para conectar ao servidor via SSH
# Uso: ./scripts/conectar-servidor.sh

echo "🔐 Conectando ao Servidor"
echo "=========================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Informações de Conexão:${NC}"
echo ""
echo "Host: 50.6.35.67"
echo "Usuário: ebvutbmy"
echo ""
echo -e "${YELLOW}Comando para conectar:${NC}"
echo "ssh ebvutbmy@50.6.35.67"
echo ""
echo -e "${GREEN}✅ Execute o comando acima para conectar!${NC}"
echo ""
echo -e "${BLUE}📋 Depois de conectar, diretórios úteis:${NC}"
echo ""
echo "# Backend"
echo "cd ~/public_html/api"
echo ""
echo "# Frontend"
echo "cd ~/public_html"
echo ""

