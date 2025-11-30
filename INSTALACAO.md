# Guia de Instalação - Site HMX

Este guia fornece instruções detalhadas para configurar e executar o projeto Site HMX.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker Desktop** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git** (opcional, para clonar o repositório)

## 🔧 Instalação Passo a Passo

### Passo 1: Preparar o Ambiente

1. Navegue até o diretório do projeto:
```bash
cd sitehmx
```

### Passo 2: Configurar Variáveis de Ambiente

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e verifique as seguintes configurações:
- `DB_HOST=mysql` (deve ser "mysql" para funcionar com Docker)
- `DB_DATABASE=sitehmx_db`
- `DB_USERNAME=sitehmx_user`
- `DB_PASSWORD=sitehmx_password`

#### Frontend (.env.local)
```bash
cd ../frontend
cp .env.local.example .env.local
```

O arquivo `.env.local` já deve estar configurado com:
```
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

### Passo 3: Construir e Iniciar os Containers

```bash
cd ..
docker-compose up -d --build
```

Este comando irá:
- Construir as imagens Docker
- Criar os containers
- Iniciar todos os serviços

### Passo 4: Configurar o Backend Laravel

```bash
# Acesse o container do backend
docker exec -it sitehmx_backend bash

# Dentro do container, execute:
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### Passo 5: Verificar se Tudo Está Funcionando

1. **Backend API**: Acesse http://localhost:8001/api
   - Deve retornar uma resposta JSON

2. **Frontend**: Acesse http://localhost:3000
   - Deve carregar a página inicial

3. **Área de Gestão**: Acesse http://localhost:3000/gestao/login
   - Use as credenciais: `admin@sitehmx.com` / `password`

## 🐛 Solução de Problemas

### Erro: Porta já em uso

Se as portas 3000, 8001 ou 3306 já estiverem em uso:

1. Pare os containers:
```bash
docker-compose down
```

2. Edite o `docker-compose.yml` e altere as portas:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "8002:8000"  # Backend
  - "3307:3306"  # MySQL
```

### Erro: Composer não encontrado

Se o Composer não estiver disponível no container:
```bash
docker exec -it sitehmx_backend composer install
```

### Erro: Migrações falhando

Verifique se o MySQL está rodando:
```bash
docker ps
```

Se o MySQL não estiver rodando:
```bash
docker-compose up -d mysql
```

Aguarde alguns segundos e tente novamente:
```bash
docker exec -it sitehmx_backend php artisan migrate
```

## 📝 Comandos Úteis

### Ver logs dos containers
```bash
docker-compose logs -f
```

### Parar todos os containers
```bash
docker-compose down
```

### Parar e remover volumes (limpar banco de dados)
```bash
docker-compose down -v
```

### Reconstruir containers
```bash
docker-compose up -d --build
```

### Acessar MySQL diretamente
```bash
docker exec -it sitehmx_mysql mysql -u sitehmx_user -p sitehmx_db
# Senha: sitehmx_password
```

## 🎯 Próximos Passos

Após a instalação bem-sucedida:

1. Acesse a área de gestão em http://localhost:3000/gestao/login
2. Explore o dashboard administrativo
3. Crie consultas, pacientes e médicos através da interface
4. Personalize o sistema conforme suas necessidades

## 📚 Documentação Adicional

- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)

