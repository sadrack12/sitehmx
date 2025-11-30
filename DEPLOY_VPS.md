# 🚀 Deploy em VPS Hosting

## 📋 Visão Geral

Este guia cobre o deploy completo da aplicação em um VPS (Virtual Private Server).

---

## 🎯 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Acesso SSH root ou sudo
- Domínio configurado apontando para o VPS
- Node.js 18+ (para build do frontend)
- PHP 8.1+ e Composer
- MySQL/MariaDB
- Nginx ou Apache

---

## 📦 ESTRUTURA DO DEPLOY

```
/var/www/
├── sitehmx/              # Aplicação completa
│   ├── backend/          # Laravel API
│   ├── frontend/         # Next.js (build estático)
│   └── scripts/          # Scripts de deploy
└── sitehmx-api/          # Laravel public (symlink)
```

---

## 🚀 PASSO 1: Preparar o Servidor

### 1.1 Atualizar o sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar dependências:

```bash
# PHP e extensões
sudo apt install -y php8.1 php8.1-fpm php8.1-mysql php8.1-xml \
    php8.1-mbstring php8.1-curl php8.1-zip php8.1-gd php8.1-bcmath

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL
sudo apt install -y mysql-server

# Nginx
sudo apt install -y nginx

# Git
sudo apt install -y git
```

### 1.3 Configurar MySQL:

```bash
sudo mysql_secure_installation
```

Criar banco de dados:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE sitehmx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sitehmx'@'localhost' IDENTIFIED BY 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON sitehmx.* TO 'sitehmx'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🚀 PASSO 2: Deploy da Aplicação

### 2.1 Clonar repositório:

```bash
cd /var/www
sudo git clone https://github.com/sadrack12/sitehmx.git
sudo chown -R $USER:$USER sitehmx
cd sitehmx
```

### 2.2 Configurar Backend:

```bash
cd backend

# Copiar .env
cp .env.example .env

# Editar .env
nano .env
```

**Configurações importantes no .env:**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seudominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sitehmx
DB_USERNAME=sitehmx
DB_PASSWORD=senha_segura_aqui

FRONTEND_URL=https://seudominio.com
```

```bash
# Instalar dependências
composer install --no-dev --optimize-autoloader

# Gerar chave
php artisan key:generate

# Executar migrations
php artisan migrate --force

# Criar link simbólico para storage
php artisan storage:link

# Limpar e criar cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2.3 Configurar Frontend:

```bash
cd ../frontend

# Instalar dependências
npm install

# Fazer build
npm run build

# O build estará em frontend/out/
```

---

## 🚀 PASSO 3: Configurar Nginx

### 3.1 Criar configuração do site:

```bash
sudo nano /etc/nginx/sites-available/sitehmx
```

**Configuração Nginx:**

```nginx
# Frontend (Next.js estático)
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    root /var/www/sitehmx/frontend/out;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Frontend
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # API - Proxy para Laravel
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /var/www/sitehmx/backend/public/index.php;
        include fastcgi_params;
    }

    # Assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.2 Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/sitehmx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🚀 PASSO 4: Configurar SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

---

## 🚀 PASSO 5: Configurar Permissões

```bash
cd /var/www/sitehmx

# Backend
sudo chown -R www-data:www-data backend/storage
sudo chown -R www-data:www-data backend/bootstrap/cache
sudo chmod -R 775 backend/storage
sudo chmod -R 775 backend/bootstrap/cache

# Frontend
sudo chown -R www-data:www-data frontend/out
```

---

## 🔄 Scripts de Deploy

Use os scripts em `scripts/` para facilitar o deploy:

```bash
# Deploy completo
./scripts/deploy-vps.sh

# Apenas backend
./scripts/deploy-backend-vps.sh

# Apenas frontend
./scripts/deploy-frontend-vps.sh
```

---

## ✅ Verificações

### Verificar serviços:

```bash
sudo systemctl status nginx
sudo systemctl status php8.1-fpm
sudo systemctl status mysql
```

### Verificar rotas:

```bash
cd /var/www/sitehmx/backend
php artisan route:list
```

### Testar API:

```bash
curl https://seudominio.com/api/noticias
```

---

## 🔧 Manutenção

### Atualizar aplicação:

```bash
cd /var/www/sitehmx
git pull origin main
./scripts/deploy-vps.sh
```

### Limpar cache:

```bash
cd /var/www/sitehmx/backend
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Logs:

```bash
# Nginx
sudo tail -f /var/log/nginx/error.log

# Laravel
tail -f /var/www/sitehmx/backend/storage/logs/laravel.log
```

---

**Siga este guia para fazer deploy completo no VPS!** 🚀

