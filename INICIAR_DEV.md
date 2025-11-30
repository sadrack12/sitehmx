# 🚀 Iniciar Desenvolvimento Local

## ⚡ Quick Start

### 1. Verificar ambiente:

```bash
./scripts/verificar-local.sh
```

### 2. Se PHP/Composer não estiverem instalados:

```bash
# Ver guia: INSTALAR_PHP_MACOS.md
```

### 3. Iniciar Backend (Terminal 1):

```bash
cd backend
php artisan serve
```

Backend rodando em: `http://localhost:8000`

### 4. Iniciar Frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

Frontend rodando em: `http://localhost:3000`

---

## 📋 Verificar se está funcionando

### Backend:
- Abrir: `http://localhost:8000/api/noticias`
- Deve retornar JSON

### Frontend:
- Abrir: `http://localhost:3000`
- Deve carregar a página inicial

---

## 🔧 Comandos Úteis

### Backend:

```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver rotas
php artisan route:list

# Executar migrations
php artisan migrate

# Seed (dados de teste)
php artisan db:seed
```

### Frontend:

```bash
# Build para produção
npm run build

# Verificar erros
npm run lint  # Se configurado
```

---

## 🐛 Problemas Comuns

### Porta 8000 em uso:

```bash
php artisan serve --port=8001
```

### Porta 3000 em uso:

```bash
PORT=3001 npm run dev
```

### Erro de banco de dados:

Verificar `.env` do backend:
```env
DB_DATABASE=sitehmx
DB_USERNAME=root
DB_PASSWORD=
```

---

**Tudo pronto para desenvolver!** 💻

