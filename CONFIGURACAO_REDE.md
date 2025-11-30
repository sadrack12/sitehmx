# Configuração para Acesso de Outras Máquinas

Este guia explica como configurar o sistema para permitir acesso de outras máquinas na rede.

## Problema

Quando você acessa o sistema de outra máquina, o login não funciona porque:
1. O frontend está tentando se conectar ao backend usando `localhost:8001`
2. O CORS pode estar bloqueando requisições de outros IPs

## Solução

### Passo 1: Descobrir o IP da Máquina Servidor

No servidor (máquina onde o Docker está rodando), execute:

```bash
# Linux/Mac
hostname -I | awk '{print $1}'
# ou
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
# Procure por "IPv4 Address" da interface de rede
```

Anote o IP (exemplo: `192.168.1.100`)

### Passo 2: Configurar o Frontend

Edite o arquivo `frontend/.env.local` e configure o IP correto:

```bash
# Substitua SEU_IP_AQUI pelo IP da máquina servidor
NEXT_PUBLIC_API_URL=http://SEU_IP_AQUI:8001/api
```

**Exemplo:**
```bash
NEXT_PUBLIC_API_URL=http://192.168.1.100:8001/api
```

### Passo 3: Reiniciar o Frontend

Após alterar o `.env.local`, reinicie o container do frontend:

```bash
docker-compose restart frontend
```

Ou, se estiver em desenvolvimento:

```bash
docker-compose down
docker-compose up -d
```

### Passo 4: Acessar de Outra Máquina

Na outra máquina, acesse o sistema usando o IP do servidor:

```
http://SEU_IP_AQUI:3000
```

**Exemplo:**
```
http://192.168.1.100:3000
```

### Passo 5: Verificar Firewall

Certifique-se de que as portas estão abertas no firewall:

- **Porta 3000**: Frontend (Next.js)
- **Porta 8001**: Backend (Laravel API)

**Linux (UFW):**
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 8001/tcp
```

**Windows:**
- Abra o Firewall do Windows
- Adicione regras de entrada para as portas 3000 e 8001

## Configuração Automática (Opcional)

Você pode criar um script para configurar automaticamente:

```bash
#!/bin/bash
# configure-network.sh

# Obter IP da máquina
IP=$(hostname -I | awk '{print $1}')

# Criar/atualizar .env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://${IP}:8001/api
EOF

echo "Configurado NEXT_PUBLIC_API_URL para http://${IP}:8001/api"
echo "Reinicie o frontend com: docker-compose restart frontend"
```

Torne o script executável e execute:

```bash
chmod +x configure-network.sh
./configure-network.sh
```

## Notas Importantes

1. **Desenvolvimento vs Produção**: 
   - Em desenvolvimento, você pode usar IPs locais
   - Em produção, use um domínio ou IP fixo

2. **CORS**: 
   - O CORS foi configurado para aceitar requisições de IPs locais
   - Se ainda tiver problemas, verifique os logs do backend

3. **HTTPS**: 
   - Para produção, configure HTTPS
   - Atualize o `NEXT_PUBLIC_API_URL` para usar `https://`

4. **Docker Network**: 
   - Os containers se comunicam internamente usando os nomes dos serviços
   - O `NEXT_PUBLIC_API_URL` é apenas para o navegador acessar o backend

## Troubleshooting

### Erro: "Network Error" ou "CORS Error"

1. Verifique se o IP está correto no `.env.local`
2. Verifique se o backend está acessível: `curl http://SEU_IP:8001/api`
3. Verifique os logs: `docker-compose logs backend`

### Erro: "Connection Refused"

1. Verifique se o Docker está rodando: `docker-compose ps`
2. Verifique se as portas estão mapeadas: `docker-compose ps` deve mostrar `0.0.0.0:8001->8000/tcp`
3. Verifique o firewall

### Login não funciona

1. Verifique se o `NEXT_PUBLIC_API_URL` está correto
2. Abra o console do navegador (F12) e verifique os erros
3. Verifique se o token está sendo salvo no localStorage

