#!/bin/bash

# Script para configurar acesso via IP

echo "🔧 Configurando acesso via IP..."
echo ""

# Detectar IP da máquina
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "192.168.1.100")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "192.168.1.100")
else
    # Windows ou outros
    IP="192.168.1.100"
fi

echo "📍 IP detectado: $IP"
echo ""
read -p "Deseja usar este IP? (s/n) [s]: " confirm
confirm=${confirm:-s}

if [[ "$confirm" != "s" && "$confirm" != "S" ]]; then
    read -p "Digite o IP desejado: " IP
fi

echo ""
echo "✅ Configurando NEXT_PUBLIC_API_URL=http://$IP:8001/api"
echo ""

# Criar arquivo .env.local no frontend
cat > frontend/.env.local << EOF
# Configuração automática para acesso via IP
# Gerado em $(date)
NEXT_PUBLIC_API_URL=http://$IP:8001/api
EOF

echo "✅ Arquivo frontend/.env.local criado!"
echo ""
echo "📝 Para aplicar as mudanças:"
echo "   1. Pare os containers: docker-compose down"
echo "   2. Inicie novamente: docker-compose up -d"
echo ""
echo "🌐 Acesse o sistema em: http://$IP:3000"
echo "🔗 Backend API em: http://$IP:8001/api"

