# Site HMX - Sistema Hospitalar

Sistema web completo para gestão hospitalar com arquitetura full-stack separada.

## 🏗️ Arquitetura

- **Backend**: Laravel (PHP 8.2) - API REST
- **Frontend**: Next.js (React + TypeScript) - SPA
- **Banco de Dados**: MySQL 8.0
- **Infraestrutura**: Docker Compose

## 📋 Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado

## 🚀 Como executar

### 1. Pré-requisitos
- Docker Desktop instalado e rodando
- Docker Compose instalado

### 2. Clone o repositório (se aplicável)
```bash
git clone <repository-url>
cd sitehmx
```

### 3. Configure o ambiente

#### Backend
```bash
cd backend
cp .env.example .env
# Edite o .env conforme necessário
```

#### Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Edite o .env.local conforme necessário
```

### 4. Inicie os containers
```bash
docker-compose up -d --build
```

### 5. Configure o backend Laravel

```bash
# Acesse o container do backend
docker exec -it sitehmx_backend bash

# Instale as dependências do Composer (se necessário)
composer install

# Gere a chave da aplicação
php artisan key:generate

# Execute as migrações
php artisan migrate

# (Opcional) Seed do banco de dados para criar usuários padrão
php artisan db:seed
```

**Usuários padrão criados pelo seed:**
- **Admin**: admin@sitehmx.com / password
- **Gestor**: gestor@sitehmx.com / password

### 6. Configure o frontend

```bash
# Acesse o container do frontend
docker exec -it sitehmx_frontend sh

# Instale as dependências (se necessário)
npm install
```

### 7. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api
- **Área de Gestão**: http://localhost:3000/gestao/login
- **MySQL**: localhost:3306

## 📁 Estrutura do Projeto

```
sitehmx/
├── backend/          # API Laravel
│   ├── app/
│   ├── config/
│   ├── database/
│   └── routes/
├── frontend/         # Next.js SPA
│   ├── src/
│   ├── pages/
│   └── components/
├── docker-compose.yml
└── README.md
```

## 🔧 Desenvolvimento

### Backend (Laravel)
```bash
docker exec -it sitehmx_backend bash
php artisan make:controller NomeController
php artisan make:model NomeModel -m
```

### Frontend (Next.js)
```bash
docker exec -it sitehmx_frontend sh
npm run dev
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=sitehmx_db
DB_USERNAME=sitehmx_user
DB_PASSWORD=sitehmx_password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

## 🛠️ Comandos Úteis

```bash
# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Acessar MySQL
docker exec -it sitehmx_mysql mysql -u sitehmx_user -p sitehmx_db
```

## 📚 Funcionalidades

- Sistema de consultas externas
- Gestão de pacientes
- Agendamento de consultas
- Interface moderna e responsiva

## 👥 Contribuição

1. Crie uma branch para sua feature
2. Faça commit das alterações
3. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso interno.

