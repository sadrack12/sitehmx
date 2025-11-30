#!/bin/bash

# Script para listar arquivos que precisam ser enviados
# Uso: ./scripts/listar-arquivos-upload.sh

set -e

echo "📋 Arquivos para Upload no cPanel"
echo "==================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 BACKEND - Arquivos Corrigidos:${NC}"
echo ""
echo "1. backend/app/Http/Controllers/Api/PublicController.php"
echo "   → Para: public_html/api/app/Http/Controllers/Api/PublicController.php"
echo ""
echo "2. backend/app/Providers/AppServiceProvider.php"
echo "   → Para: public_html/api/app/Providers/AppServiceProvider.php"
echo ""
echo "3. backend/.htaccess"
echo "   → Para: public_html/api/.htaccess"
echo ""

echo -e "${BLUE}📦 FRONTEND - Build Completo:${NC}"
echo ""
echo "TODA a pasta: frontend/out/"
echo "→ Para: public_html/"
echo ""
echo "Arquivos principais:"
echo "- .htaccess"
echo "- index.html"
echo "- _next/ (todos os arquivos)"
echo "- gestao/ (todas as páginas HTML)"
echo "- consulta-online.html"
echo "- agendar.html"
echo "- ... (todos os outros arquivos)"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "- Substitua TODOS os arquivos existentes no frontend"
echo "- Não adicione apenas os novos arquivos"
echo "- Limpe o cache do navegador após upload"
echo ""

echo -e "${GREEN}✅ Lista completa!${NC}"

