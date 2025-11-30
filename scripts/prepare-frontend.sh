#!/bin/bash

# Script para preparar o frontend para deploy no cPanel
# Uso: ./scripts/prepare-frontend.sh [static|nodejs]

set -e

DEPLOY_TYPE="${1:-static}"

echo "🚀 Preparando frontend para deploy no cPanel..."
echo "📦 Tipo de deploy: $DEPLOY_TYPE"

cd "$(dirname "$0")/../frontend"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar .env.local
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    read -p "Digite a URL da API (ex: https://seudominio.com/api): " API_URL
    echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local
    echo "✅ .env.local criado com API_URL: $API_URL"
else
    echo "✅ .env.local já existe"
fi

if [ "$DEPLOY_TYPE" = "static" ]; then
    echo "📄 Configurando para build estático..."
    
    # Verificar se output: 'export' está no next.config.js
    if ! grep -q "output: 'export'" next.config.js 2>/dev/null; then
        echo "⚠️  ATENÇÃO: Você precisa adicionar 'output: \"export\"' no next.config.js para build estático"
        echo "   Edite o arquivo next.config.js e adicione:"
        echo "   output: 'export',"
        read -p "Pressione Enter após fazer a alteração..."
    fi
    
    # Fazer build
    echo "🏗️  Fazendo build estático..."
    npm run build
    
    if [ -d "out" ]; then
        echo ""
        echo "✅ Build estático concluído!"
        echo ""
        echo "📋 Próximos passos:"
        echo "1. Faça upload de TODA a pasta 'out/' para public_html/ no cPanel"
        echo "2. Certifique-se de incluir a pasta images/ e todas as outras"
        echo "3. Configure as permissões: pastas 755, arquivos 644"
    else
        echo "❌ Pasta 'out/' não foi criada. Verifique os erros acima."
        exit 1
    fi
    
elif [ "$DEPLOY_TYPE" = "nodejs" ]; then
    echo "🟢 Preparando para deploy com Node.js..."
    
    # Fazer build
    echo "🏗️  Fazendo build do Next.js..."
    npm run build
    
    if [ -d ".next" ]; then
        echo ""
        echo "✅ Build concluído!"
        echo ""
        echo "📋 Próximos passos:"
        echo "1. Faça upload para public_html/ no cPanel:"
        echo "   - Pasta .next/ (completa)"
        echo "   - Pasta public/ (completa)"
        echo "   - package.json"
        echo "   - next.config.js"
        echo "   - server.js"
        echo "   - .env.local"
        echo ""
        echo "2. No cPanel, crie uma aplicação Node.js:"
        echo "   - Versão: 18.x ou superior"
        echo "   - Application root: public_html"
        echo "   - Startup file: server.js"
        echo ""
        echo "3. No Terminal do cPanel, execute:"
        echo "   cd ~/public_html && npm install --production"
        echo ""
        echo "4. Inicie a aplicação Node.js no cPanel"
    else
        echo "❌ Pasta '.next/' não foi criada. Verifique os erros acima."
        exit 1
    fi
else
    echo "❌ Tipo de deploy inválido. Use 'static' ou 'nodejs'"
    exit 1
fi

echo ""
echo "✅ Frontend preparado com sucesso!"

