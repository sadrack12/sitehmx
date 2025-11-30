#!/bin/bash

# Script para configurar o sistema para acesso de outras máquinas na rede

echo "🔧 Configurando acesso de rede..."

# Obter IP da máquina
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    IP=$(ipconfig | grep "IPv4" | awk '{print $14}' | head -n 1)
else
    echo "❌ Sistema operacional não suportado. Configure manualmente."
    exit 1
fi

if [ -z "$IP" ]; then
    echo "❌ Não foi possível detectar o IP automaticamente."
    echo "Por favor, configure manualmente o arquivo frontend/.env.local"
    exit 1
fi

echo "📍 IP detectado: $IP"

# Criar/atualizar .env.local
ENV_FILE="frontend/.env.local"
API_URL="http://${IP}:8001/api"

# Verificar se o arquivo existe
if [ -f "$ENV_FILE" ]; then
    # Atualizar se já existe
    if grep -q "NEXT_PUBLIC_API_URL" "$ENV_FILE"; then
        # Substituir a linha existente
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=${API_URL}|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=${API_URL}|" "$ENV_FILE"
        fi
        echo "✅ Arquivo $ENV_FILE atualizado"
    else
        # Adicionar se não existe
        echo "NEXT_PUBLIC_API_URL=${API_URL}" >> "$ENV_FILE"
        echo "✅ Adicionado NEXT_PUBLIC_API_URL ao arquivo $ENV_FILE"
    fi
else
    # Criar novo arquivo
    echo "NEXT_PUBLIC_API_URL=${API_URL}" > "$ENV_FILE"
    echo "✅ Arquivo $ENV_FILE criado"
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Reinicie o frontend: docker-compose restart frontend"
echo "2. Acesse o sistema de outra máquina usando: http://${IP}:3000"
echo ""
echo "⚠️  Certifique-se de que as portas 3000 e 8001 estão abertas no firewall"

