#!/bin/bash

# Script para configurar a API local para desenvolvimento

echo "🔧 Configurando API local para desenvolvimento..."
echo ""

# Perguntar qual porta a API está rodando
read -p "Em qual porta sua API Laravel está rodando? (padrão: 8000): " PORT
PORT=${PORT:-8000}

# Criar .env.local com a URL da API local
cat > .env.local << EOF
# Configuração para DESENVOLVIMENTO LOCAL
# Esta URL aponta para a API Laravel rodando localmente
NEXT_PUBLIC_API_URL=http://localhost:${PORT}/api
EOF

echo "✅ Arquivo .env.local criado com sucesso!"
echo ""
echo "📝 Configuração:"
echo "   NEXT_PUBLIC_API_URL=http://localhost:${PORT}/api"
echo ""
echo "🔄 Agora reinicie o servidor Next.js:"
echo "   1. Pare o servidor atual (Ctrl+C)"
echo "   2. Execute: npm run dev"
echo ""

