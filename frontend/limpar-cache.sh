#!/bin/bash

# Script para limpar cache do Next.js
echo "🧹 Limpando cache do Next.js..."

# Remover pasta .next
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Pasta .next removida"
else
    echo "ℹ️  Pasta .next não existe"
fi

# Limpar node_modules/.cache se existir
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Cache do node_modules limpo"
fi

echo "✅ Cache limpo! Agora execute: npm run dev"

