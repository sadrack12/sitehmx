# ⚡ Docker Quick Start

## 🚀 Iniciar em 3 Passos

### 1. Iniciar ambiente:

```bash
./scripts/docker-start.sh
```

OU manualmente:

```bash
docker-compose up -d
```

### 2. Executar migrations:

```bash
./scripts/docker-artisan.sh migrate
```

OU:

```bash
docker-compose exec backend php artisan migrate
```

### 3. Acessar:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api/noticias

---

## 📋 Comandos Rápidos

```bash
# Iniciar
./scripts/docker-start.sh

# Ver logs
./scripts/docker-logs.sh

# Parar
./scripts/docker-stop.sh

# Artisan
./scripts/docker-artisan.sh migrate
./scripts/docker-artisan.sh route:list
```

---

## 🔧 Comandos Docker

```bash
# Ver containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar
docker-compose stop

# Remover
docker-compose down

# Reconstruir
docker-compose build
docker-compose up -d
```

---

**Pronto para desenvolver!** 🐳

