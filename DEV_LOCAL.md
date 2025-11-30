# 💻 Desenvolvimento Local

## 🚀 Setup Rápido

### Pré-requisitos

- PHP 8.1+
- Composer
- Node.js 18+
- MySQL/MariaDB
- Git

---

## 📦 BACKEND (Laravel)

### 1. Instalar dependências:

```bash
cd backend
composer install
```

### 2. Configurar .env:

```bash
cp .env.example .env
```

Editar `.env`:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sitehmx
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

### 3. Gerar chave e executar migrations:

```bash
php artisan key:generate
php artisan migrate
php artisan db:seed  # Opcional: dados de teste
```

### 4. Iniciar servidor:

```bash
php artisan serve
```

Backend rodando em: `http://localhost:8000`

---

## 📦 FRONTEND (Next.js)

### 1. Instalar dependências:

```bash
cd frontend
npm install
```

### 2. Configurar .env.local:

```bash
cp .env.example .env.local  # Se existir
```

Criar `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Iniciar servidor de desenvolvimento:

```bash
npm run dev
```

Frontend rodando em: `http://localhost:3000`

---

## ✅ Verificar

### Backend:
- API: `http://localhost:8000/api/noticias`
- Deve retornar JSON

### Frontend:
- Site: `http://localhost:3000`
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

# Criar migration
php artisan make:migration nome_da_migration

# Rollback migration
php artisan migrate:rollback
```

### Frontend:

```bash
# Build para produção
npm run build

# Build estático (para cPanel/VPS)
npm run build

# Verificar tipos
npm run type-check  # Se configurado
```

---

## 🐛 Troubleshooting

### Erro de conexão com banco:

```bash
# Verificar se MySQL está rodando
mysql -u root -p

# Criar banco se não existir
mysql -u root -p -e "CREATE DATABASE sitehmx;"
```

### Porta 8000 já em uso:

```bash
# Usar outra porta
php artisan serve --port=8001
```

### Porta 3000 já em uso:

```bash
# Next.js perguntará automaticamente
# OU definir manualmente
PORT=3001 npm run dev
```

### Erro de permissões (storage):

```bash
cd backend
chmod -R 775 storage bootstrap/cache
```

---

## 📝 Workflow de Desenvolvimento

### 1. Fazer alterações no código

### 2. Testar localmente:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### 3. Commit e push:

```bash
git add .
git commit -m "Descrição das alterações"
git push origin main
```

### 4. Deploy (quando pronto):
- VPS: `./scripts/deploy-vps.sh`
- cPanel: Upload manual

---

**Tudo pronto para desenvolvimento local!** 💻

