# Configuração HTTPS

Este guia explica como configurar HTTPS para o sistema usando nginx como proxy reverso.

## Estrutura

- **nginx**: Proxy reverso com SSL/TLS
- **frontend**: Next.js (porta 3000 internamente)
- **backend**: Laravel API (porta 8000 internamente)

## Configuração Automática

Execute o script de configuração:

```bash
./setup-https.sh
```

Este script irá:
1. Detectar seu IP local
2. Atualizar `frontend/.env.local` com URL HTTPS
3. Atualizar `backend/.env` com URLs HTTPS
4. Regenerar certificados SSL com o IP correto

## Configuração Manual

### 1. Certificados SSL

Os certificados auto-assinados já estão criados em `nginx/ssl/`. Para regenerar:

```bash
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -subj "/C=PT/ST=Luanda/L=Luanda/O=Hospital/CN=localhost" \
    -addext "subjectAltName=IP:SEU_IP,IP:127.0.0.1,DNS:localhost"
```

### 2. Variáveis de Ambiente

#### Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=https://SEU_IP/api
```

#### Backend (`backend/.env`):
```
APP_URL=https://SEU_IP/api
FRONTEND_URL=https://SEU_IP
```

### 3. Iniciar Serviços

```bash
# Reconstruir e iniciar nginx
docker-compose up -d --build nginx

# Ou reiniciar todos os serviços
docker-compose down
docker-compose up -d --build
```

## Acesso

- **HTTPS**: `https://SEU_IP` (porta 443)
- **HTTP**: Redireciona automaticamente para HTTPS (porta 80)
- **Frontend direto**: `http://SEU_IP:3000` (ainda disponível)
- **Backend direto**: `http://SEU_IP:8001/api` (ainda disponível)

## Certificado Auto-Assinado

⚠️ **Aviso de Segurança**: O navegador mostrará um aviso porque o certificado é auto-assinado. Isso é normal em desenvolvimento.

Para aceitar:
1. Clique em "Avançado" ou "Advanced"
2. Clique em "Continuar para o site" ou "Proceed to site"

## Produção

Para produção, use certificados válidos:

### Opção 1: Let's Encrypt (Gratuito)

1. Instale o Certbot
2. Configure o domínio
3. Gere certificados:
```bash
certbot certonly --standalone -d seu-dominio.com
```

4. Atualize `nginx/conf.d/default.conf`:
```nginx
ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
```

### Opção 2: Certificado Comercial

Substitua os arquivos em `nginx/ssl/` pelos seus certificados comerciais.

## Troubleshooting

### Erro: "SSL certificate problem"
- Certifique-se de que os certificados estão em `nginx/ssl/`
- Verifique se o IP no certificado corresponde ao IP do servidor

### Erro: "Connection refused"
- Verifique se os containers estão rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs nginx`

### Erro: "502 Bad Gateway"
- Verifique se frontend e backend estão rodando
- Verifique os logs: `docker-compose logs frontend backend`

### Porta 443 já em uso
- Verifique se outro serviço está usando a porta 443
- Pare o serviço ou mude a porta no `docker-compose.yml`

## Verificação

Após configurar, teste:

1. Acesse `https://SEU_IP` - deve carregar o frontend
2. Teste uma chamada de API - deve funcionar via HTTPS
3. Verifique o console do navegador - não deve haver erros de CORS ou SSL

## Estrutura de Arquivos

```
nginx/
├── Dockerfile
├── nginx.conf
├── conf.d/
│   └── default.conf
└── ssl/
    ├── cert.pem
    └── key.pem
```

