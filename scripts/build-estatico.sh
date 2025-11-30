#!/bin/bash

# Script para fazer build estático do Next.js para deploy no cPanel sem Node.js
# Uso: ./scripts/build-estatico.sh [URL_DA_API]

set -e

cd "$(dirname "$0")/../frontend"

echo "🚀 Preparando build estático para cPanel (sem Node.js)..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script a partir da raiz do projeto"
    exit 1
fi

# Solicitar URL da API se não fornecida
if [ -z "$1" ]; then
    read -p "Digite a URL da API (ex: https://seudominio.com/api): " API_URL
else
    API_URL="$1"
fi

echo ""
echo "📝 Configurando .env.local com API_URL: $API_URL"
echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local

echo ""
echo "📝 Verificando next.config.js..."

# Verificar se output: 'export' está no config
if ! grep -q "output: 'export'" next.config.js 2>/dev/null; then
    echo "⚠️  ATENÇÃO: Você precisa adicionar 'output: \"export\"' no next.config.js"
    echo ""
    echo "Edite o arquivo frontend/next.config.js e adicione:"
    echo "  output: 'export',"
    echo ""
    read -p "Pressione Enter após fazer a alteração..."
fi

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🏗️  Fazendo build estático..."
npm run build

if [ -d "out" ]; then
    OUT_SIZE=$(du -sh out 2>/dev/null | cut -f1)
    OUT_FILES=$(find out -type f 2>/dev/null | wc -l | xargs)
    
    echo ""
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "📊 Estatísticas:"
    echo "   Tamanho: $OUT_SIZE"
    echo "   Arquivos: $OUT_FILES"
    echo ""
    echo "📁 A pasta 'out/' está pronta para upload!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Faça upload de TODA a pasta 'out/' para 'public_html/' no cPanel"
    echo "2. Use FTP/SFTP para arquivos grandes (mais estável)"
    echo "3. Certifique-se de incluir a pasta 'images/' e todas as outras"
    echo "4. Configure permissões: pastas 755, arquivos 644"
    echo ""
    echo "💡 Dica: Se receber erro 500 no upload, consulte SOLUCAO_UPLOAD_CPANEL.md"
else
    echo ""
    echo "❌ Erro: Pasta 'out/' não foi criada!"
    echo "Verifique os erros acima."
    exit 1
fi

