# 🐳 Desenvolvimento com Docker Desktop

## 🚀 Quick Start

### 1. Iniciar todos os serviços:

```bash
docker-compose up -d
```

### 2. Verificar containers:

```bash
docker-compose ps
```

### 3. Ver logs:

```bash
docker-compose logs -f
```

---

## 📋 Serviços Disponíveis

### Backend (Laravel)
- **URL:** `http://localhost:8001`
- **API:** `http://localhost:8001/api`
- **Container:** `sitehmx_backend`

### Frontend (Next.js)
- **URL:** `http://localhost:3000`
- **Container:** `sitehmx_frontend`

### MySQL
- **Porta:** `3306`
- **Container:** `sitehmx_mysql`
- **Database:** `sitehmx_db`
- **User:** `sitehmx_user`
- **Password:** `sitehmx_password`

### Nginx (Opcional)
- **URL:** `http://localhost:80`
- **Container:** `sitehmx_nginx`

---

## 🔧 Comandos Úteis

### Iniciar serviços:

```bash
# Iniciar em background
docker-compose up -d

# Iniciar e ver logs
docker-compose up
```

### Parar serviços:

```bash
docker-compose stop
```

### Parar e remover containers:

```bash
docker-compose down
```

### Reconstruir containers:

```bash
docker-compose build
docker-compose up -d
```

### Ver logs:

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### Executar comandos no container:

```bash
# Backend - Artisan
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan route:list

# Backend - Composer
docker-compose exec backend composer install

# Frontend - npm
docker-compose exec frontend npm install
docker-compose exec frontend npm run build
```

---

## 🗄️ Banco de Dados

### Conectar ao MySQL:

```bash
docker-compose exec mysql mysql -u sitehmx_user -psitehmx_password sitehmx_db
```

### Executar migrations:

```bash
docker-compose exec backend php artisan migrate
```

### Seed (dados de teste):

```bash
docker-compose exec backend php artisan db:seed
```

---

## 🔄 Workflow de Desenvolvimento

### 1. Iniciar ambiente:

```bash
docker-compose up -d
```

### 2. Fazer alterações no código

### 3. Ver mudanças em tempo real:
- Backend: Mudanças são refletidas automaticamente (volume montado)
- Frontend: Mudanças são refletidas automaticamente (hot reload)

### 4. Testar:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8001/api/noticias`

### 5. Parar quando terminar:

```bash
docker-compose stop
```

---

## 🐛 Troubleshooting

### Container não inicia:

```bash
# Ver logs
docker-compose logs backend
docker-compose logs frontend

# Reconstruir
docker-compose build --no-cache
docker-compose up -d
```

### Porta já em uso:

Editar `docker-compose.yml` e mudar as portas:
```yaml
ports:
  - "8002:8000"  # Backend
  - "3001:3000"  # Frontend
```

### Limpar tudo e recomeçar:

```bash
docker-compose down -v
docker-compose build
docker-compose up -d
```

### Verificar volumes:

```bash
docker volume ls
docker volume inspect sitehmx_mysql_data
```

---

## 📝 Configuração de Ambiente

### Backend (.env):

O arquivo `backend/.env` é usado automaticamente. Variáveis importantes:

```env
DB_HOST=mysql
DB_DATABASE=sitehmx_db
DB_USERNAME=sitehmx_user
DB_PASSWORD=sitehmx_password
```

### Frontend (.env.local):

Criar `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

---

## ✅ Verificar se está funcionando

### Backend:
```bash
curl http://localhost:8001/api/noticias
```

### Frontend:
Abrir no navegador: `http://localhost:3000`

---

**Tudo pronto para desenvolver com Docker!** 🐳

