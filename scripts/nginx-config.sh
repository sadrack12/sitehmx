#!/bin/bash

# Script para criar configuração Nginx
# Uso: sudo ./scripts/nginx-config.sh seudominio.com

set -e

DOMAIN=${1:-"seudominio.com"}

if [ "$EUID" -ne 0 ]; then 
    echo "❌ Execute como root ou com sudo"
    exit 1
fi

echo "🔧 Criando configuração Nginx para $DOMAIN"

cat > /etc/nginx/sites-available/sitehmx << EOF
# Frontend (Next.js estático)
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/sitehmx/frontend/out;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Frontend
    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }

    # API - Proxy para Laravel
    location /api {
        try_files \$uri \$uri/ /index.php?\$query_string;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /var/www/sitehmx/backend/public/index.php;
        include fastcgi_params;
    }

    # Assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/sitehmx /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Recarregar Nginx
systemctl reload nginx

echo "✅ Configuração Nginx criada!"
echo ""
echo "📋 Próximo passo:"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"

