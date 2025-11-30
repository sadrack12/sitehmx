#!/bin/bash

# Script para verificar tamanho dos arquivos antes de fazer upload
# Uso: ./scripts/check-upload-size.sh [backend|frontend]

set -e

TYPE="${1:-backend}"

echo "📊 Verificando tamanho dos arquivos para upload..."
echo ""

if [ "$TYPE" = "backend" ]; then
    echo "🔍 Backend (Laravel):"
    echo ""
    cd "$(dirname "$0")/../backend"
    
    echo "📁 Estrutura básica (sem vendor/):"
    du -sh app bootstrap config database routes storage public resources artisan composer.json composer.lock 2>/dev/null | awk '{print "  " $0}'
    
    echo ""
    echo "📦 Pasta vendor/ (NÃO enviar - instalar no servidor):"
    if [ -d "vendor" ]; then
        VENDOR_SIZE=$(du -sh vendor 2>/dev/null | cut -f1)
        echo "  ⚠️  vendor/ tem $VENDOR_SIZE - MUITO GRANDE para upload!"
        echo "  💡 Solução: Execute 'composer install' no servidor"
    else
        echo "  ✅ vendor/ não existe (já foi excluída ou não instalada)"
    fi
    
    echo ""
    echo "📋 Total (sem vendor/):"
    TOTAL=$(du -sh --exclude=vendor --exclude=.git --exclude=node_modules . 2>/dev/null | cut -f1)
    echo "  Total: $TOTAL"
    
    echo ""
    echo "✅ Recomendações:"
    echo "  1. NÃO faça upload de vendor/"
    echo "  2. Instale dependências no servidor via: composer install --optimize-autoloader --no-dev"
    echo "  3. Use FTP/SFTP para arquivos maiores que 50MB"
    
elif [ "$TYPE" = "frontend" ]; then
    echo "🔍 Frontend (Next.js):"
    echo ""
    cd "$(dirname "$0")/../frontend"
    
    if [ -d "out" ]; then
        echo "📁 Build estático (pasta out/):"
        OUT_SIZE=$(du -sh out 2>/dev/null | cut -f1)
        OUT_COUNT=$(find out -type f 2>/dev/null | wc -l | xargs)
        echo "  Tamanho: $OUT_SIZE"
        echo "  Arquivos: $OUT_COUNT"
        echo ""
        echo "✅ Esta pasta está pronta para upload"
    else
        echo "  ⚠️  Pasta out/ não encontrada"
        echo "  💡 Execute: npm run build"
    fi
    
    echo ""
    echo "📁 Para deploy com Node.js:"
    if [ -d ".next" ]; then
        NEXT_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
        echo "  .next/: $NEXT_SIZE"
    else
        echo "  .next/ não existe"
    fi
    
    if [ -d "public" ]; then
        PUBLIC_SIZE=$(du -sh public 2>/dev/null | cut -f1)
        echo "  public/: $PUBLIC_SIZE"
    fi
    
    echo ""
    echo "⚠️  node_modules/ (NÃO enviar):"
    if [ -d "node_modules" ]; then
        NODE_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
        echo "  ⚠️  node_modules/ tem $NODE_SIZE - MUITO GRANDE!"
        echo "  💡 Solução: Execute 'npm install --production' no servidor"
    else
        echo "  ✅ node_modules/ não existe"
    fi
    
else
    echo "❌ Tipo inválido. Use 'backend' ou 'frontend'"
    exit 1
fi

echo ""
echo "📝 Dica: Se os arquivos forem muito grandes, consulte SOLUCAO_UPLOAD_CPANEL.md"

