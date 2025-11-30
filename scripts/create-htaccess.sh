#!/bin/bash

# Script para criar arquivo .htaccess para Laravel no cPanel
# Uso: ./scripts/create-htaccess.sh

HTACCESS_CONTENT='<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>'

OUTPUT_DIR="$(dirname "$0")/../backend/public"

echo "📝 Criando arquivo .htaccess para Laravel..."

if [ -f "$OUTPUT_DIR/.htaccess" ]; then
    echo "⚠️  Arquivo .htaccess já existe em $OUTPUT_DIR"
    read -p "Deseja substituir? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Operação cancelada."
        exit 0
    fi
fi

echo "$HTACCESS_CONTENT" > "$OUTPUT_DIR/.htaccess"
echo "✅ Arquivo .htaccess criado em $OUTPUT_DIR/.htaccess"

echo ""
echo "📋 Nota: Este arquivo deve estar em public_html/api/public/.htaccess no servidor"

