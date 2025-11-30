#!/bin/bash

# Script para configurar HTTPS
# Detecta o IP local e atualiza as configurações

echo "🔒 Configurando HTTPS..."

# Detectar IP local
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname -I | awk '{print $1}' || echo "172.20.10.8")

echo "📍 IP local detectado: $LOCAL_IP"

# Atualizar frontend/.env.local
if [ -f "frontend/.env.local" ]; then
    # Substituir HTTP por HTTPS
    sed -i.bak "s|http://|https://|g" frontend/.env.local
    sed -i.bak "s|https://localhost:8001|https://$LOCAL_IP/api|g" frontend/.env.local
    sed -i.bak "s|https://$LOCAL_IP:8001|https://$LOCAL_IP/api|g" frontend/.env.local
    echo "✅ frontend/.env.local atualizado"
else
    echo "NEXT_PUBLIC_API_URL=https://$LOCAL_IP/api" > frontend/.env.local
    echo "✅ frontend/.env.local criado"
fi

# Atualizar backend/.env se existir
if [ -f "backend/.env" ]; then
    # Garantir que APP_URL use HTTPS
    if grep -q "APP_URL=" backend/.env; then
        sed -i.bak "s|APP_URL=http://|APP_URL=https://|g" backend/.env
        sed -i.bak "s|APP_URL=https://localhost:8001|APP_URL=https://$LOCAL_IP/api|g" backend/.env
    else
        echo "APP_URL=https://$LOCAL_IP/api" >> backend/.env
    fi
    
    # Garantir que FRONTEND_URL use HTTPS
    if grep -q "FRONTEND_URL=" backend/.env; then
        sed -i.bak "s|FRONTEND_URL=http://|FRONTEND_URL=https://|g" backend/.env
        sed -i.bak "s|FRONTEND_URL=https://localhost:3000|FRONTEND_URL=https://$LOCAL_IP|g" backend/.env
    else
        echo "FRONTEND_URL=https://$LOCAL_IP" >> backend/.env
    fi
    echo "✅ backend/.env atualizado"
fi

# Regenerar certificados SSL com o IP correto
echo "🔐 Regenerando certificados SSL..."
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -subj "/C=PT/ST=Luanda/L=Luanda/O=Hospital/CN=localhost" \
    -addext "subjectAltName=IP:$LOCAL_IP,IP:127.0.0.1,DNS:localhost" 2>/dev/null
cd ../..

echo ""
echo "✅ Configuração HTTPS concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Execute: docker-compose up -d --build nginx"
echo "2. Acesse: https://$LOCAL_IP"
echo "3. Aceite o aviso de certificado auto-assinado (é normal em desenvolvimento)"
echo ""
echo "⚠️  Nota: O navegador mostrará um aviso de segurança porque o certificado é auto-assinado."
echo "   Isso é normal em desenvolvimento. Clique em 'Avançado' e 'Continuar'."

