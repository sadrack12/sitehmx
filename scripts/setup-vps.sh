#!/bin/bash

# Script para configurar VPS do zero
# Execute como root ou com sudo
# Uso: sudo ./scripts/setup-vps.sh

set -e

echo "🔧 Configurando VPS do Zero"
echo "============================"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Execute como root ou com sudo${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Atualizando sistema...${NC}"
apt update && apt upgrade -y

echo ""
echo -e "${BLUE}📦 Instalando PHP 8.1 e extensões...${NC}"
apt install -y php8.1 php8.1-fpm php8.1-mysql php8.1-xml \
    php8.1-mbstring php8.1-curl php8.1-zip php8.1-gd php8.1-bcmath

echo ""
echo -e "${BLUE}📦 Instalando Composer...${NC}"
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

echo ""
echo -e "${BLUE}📦 Instalando Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo ""
echo -e "${BLUE}📦 Instalando MySQL...${NC}"
apt install -y mysql-server

echo ""
echo -e "${BLUE}📦 Instalando Nginx...${NC}"
apt install -y nginx

echo ""
echo -e "${BLUE}📦 Instalando Git...${NC}"
apt install -y git

echo ""
echo -e "${BLUE}📦 Instalando Certbot (SSL)...${NC}"
apt install -y certbot python3-certbot-nginx

echo ""
echo -e "${GREEN}✅ Instalação concluída!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Configurar MySQL: sudo mysql_secure_installation"
echo "2. Criar banco de dados e usuário"
echo "3. Clonar repositório: cd /var/www && git clone https://github.com/sadrack12/sitehmx.git"
echo "4. Configurar .env do backend"
echo "5. Executar: ./scripts/deploy-vps.sh"

