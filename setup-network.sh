#!/bin/bash

# Script para configurar acesso via IP do computador

echo "🔧 Configurando acesso via IP..."

# Detectar IP da máquina
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
else
    echo "Sistema operacional não suportado. Configure manualmente."
    exit 1
fi

if [ -z "$IP" ]; then
    echo "❌ Não foi possível detectar o IP automaticamente."
    echo "Por favor, configure manualmente no arquivo docker-compose.yml"
    exit 1
fi

echo "✅ IP detectado: $IP"

# Criar arquivo .env.local para o frontend se não existir
if [ ! -f "frontend/.env.local" ]; then
    echo "Criando frontend/.env.local..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://${IP}:8001/api
EOF
    echo "✅ Arquivo frontend/.env.local criado"
else
    echo "⚠️  Arquivo frontend/.env.local já existe. Atualizando..."
    # Atualizar apenas a linha NEXT_PUBLIC_API_URL
    if grep -q "NEXT_PUBLIC_API_URL" frontend/.env.local; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://${IP}:8001/api|" frontend/.env.local
        else
            sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://${IP}:8001/api|" frontend/.env.local
        fi
    else
        echo "NEXT_PUBLIC_API_URL=http://${IP}:8001/api" >> frontend/.env.local
    fi
    echo "✅ Arquivo frontend/.env.local atualizado"
fi

# Atualizar docker-compose.yml
echo "Atualizando docker-compose.yml..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://${IP}:8001/api|" docker-compose.yml
else
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://${IP}:8001/api|" docker-compose.yml
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Informações de acesso:"
echo "   Frontend: http://${IP}:3000"
echo "   Backend API: http://${IP}:8001/api"
echo ""
echo "🔄 Para aplicar as mudanças, execute:"
echo "   docker-compose down"
echo "   docker-compose up -d --build"
echo ""

