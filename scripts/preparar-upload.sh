#!/bin/bash

# Script para preparar arquivos para upload no cPanel
# Uso: ./scripts/preparar-upload.sh

set -e

echo "📦 Preparando Arquivos para Upload no cPanel"
echo "============================================="

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

# Criar diretório temporário
UPLOAD_DIR="upload-cpanel-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$UPLOAD_DIR"

echo -e "${BLUE}📦 Preparando backend...${NC}"

# Backend - Arquivos corrigidos
mkdir -p "$UPLOAD_DIR/api/app/Http/Controllers/Api"
mkdir -p "$UPLOAD_DIR/api/app/Providers"
mkdir -p "$UPLOAD_DIR/api"

cp backend/app/Http/Controllers/Api/PublicController.php "$UPLOAD_DIR/api/app/Http/Controllers/Api/"
cp backend/app/Providers/AppServiceProvider.php "$UPLOAD_DIR/api/app/Providers/"
cp backend/.htaccess "$UPLOAD_DIR/api/"

echo -e "${GREEN}✅ Backend preparado${NC}"

echo -e "${BLUE}📦 Preparando frontend...${NC}"

# Verificar se build existe
if [ ! -d "frontend/out" ]; then
    echo -e "${YELLOW}⚠️  Build do frontend não existe. Fazendo build...${NC}"
    cd frontend
    npm run build
    cd ..
fi

# Frontend - Toda a pasta out
echo -e "${BLUE}📋 Copiando frontend/out/...${NC}"
cp -r frontend/out/* "$UPLOAD_DIR/"

echo -e "${GREEN}✅ Frontend preparado${NC}"

# Criar arquivo de instruções
cat > "$UPLOAD_DIR/INSTRUCOES_UPLOAD.txt" << 'EOF'
INSTRUÇÕES DE UPLOAD
===================

BACKEND:
--------
1. Via FTP/cPanel, faça upload de:
   - api/app/Http/Controllers/Api/PublicController.php
     → Para: public_html/api/app/Http/Controllers/Api/PublicController.php
   
   - api/app/Providers/AppServiceProvider.php
     → Para: public_html/api/app/Providers/AppServiceProvider.php
   
   - api/.htaccess
     → Para: public_html/api/.htaccess

2. No servidor (SSH), execute:
   cd ~/public_html/api
   php artisan route:clear
   php artisan config:clear
   php artisan route:cache

FRONTEND:
---------
1. Via FTP/cPanel, faça upload de TODA a pasta raiz (todos os arquivos)
   → Para: public_html/

2. IMPORTANTE: Substitua todos os arquivos existentes!

3. Limpe o cache do navegador (F12 → Application → Clear site data)
EOF

echo ""
echo -e "${GREEN}✅ Arquivos preparados em: $UPLOAD_DIR${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Compacte a pasta: zip -r $UPLOAD_DIR.zip $UPLOAD_DIR"
echo "2. Faça upload do ZIP para o servidor"
echo "3. OU faça upload direto via FTP/cPanel"
echo ""
echo -e "${BLUE}📁 Localização: $UPLOAD_DIR${NC}"

