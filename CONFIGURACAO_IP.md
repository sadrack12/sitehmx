# Configuração para Acesso via IP

Este guia explica como configurar o sistema para ser acessado via IP do computador na rede local.

## Passos para Configuração

### 1. Descobrir o IP do seu computador

**macOS:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
```

**Linux:**
```bash
hostname -I | awk '{print $1}'
```

**Windows:**
```cmd
ipconfig
```
Procure por "IPv4 Address" na sua interface de rede ativa.

### 2. Configurar a variável de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Substitua SEU_IP pelo IP do seu computador
NEXT_PUBLIC_API_URL=http://SEU_IP:8001/api
```

**Exemplo:**
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:8001/api
```

### 3. Reiniciar os containers

```bash
docker-compose down
docker-compose up -d --build
```

### 4. Acessar o sistema

Após a configuração, o sistema estará acessível em:

- **Frontend:** `http://SEU_IP:3000`
- **Backend API:** `http://SEU_IP:8001/api`

## Configuração Automática (Opcional)

Você pode usar o script `setup-network.sh` para configurar automaticamente:

```bash
chmod +x setup-network.sh
./setup-network.sh
```

Este script detecta automaticamente o IP e atualiza as configurações necessárias.

## Notas Importantes

1. **Firewall:** Certifique-se de que as portas 3000 e 8001 estão abertas no firewall do seu computador.

2. **Rede Local:** O sistema só será acessível na mesma rede local (Wi-Fi ou Ethernet).

3. **IP Dinâmico:** Se o IP do seu computador mudar, você precisará atualizar a configuração.

4. **Desenvolvimento Local:** Para desenvolvimento local, você pode continuar usando `http://localhost:3000` sem alterar as configurações.

## Verificação

Para verificar se está funcionando:

1. Acesse `http://SEU_IP:3000` de outro dispositivo na mesma rede
2. Abra o console do navegador (F12)
3. Verifique se não há erros de CORS ou conexão
4. Teste fazer login ou agendar uma consulta

## Troubleshooting

### Erro de CORS
Se você encontrar erros de CORS, verifique se o `NEXT_PUBLIC_API_URL` está configurado corretamente com o IP do servidor.

### Não consegue acessar
- Verifique se o firewall está bloqueando as portas
- Certifique-se de que está na mesma rede
- Verifique se os containers estão rodando: `docker-compose ps`

### API não responde
- Verifique se o backend está acessível: `curl http://SEU_IP:8001/api/health`
- Verifique os logs: `docker-compose logs backend`

