# ⚡ Quick Start - Deploy VPS

## 🚀 Deploy Rápido em 5 Passos

### 1. Preparar Servidor

```bash
sudo ./scripts/setup-vps.sh
```

### 2. Configurar MySQL

```bash
sudo mysql_secure_installation
sudo mysql -u root -p
```

```sql
CREATE DATABASE sitehmx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sitehmx'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON sitehmx.* TO 'sitehmx'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clonar e Configurar

```bash
cd /var/www
sudo git clone https://github.com/sadrack12/sitehmx.git
sudo chown -R $USER:$USER sitehmx
cd sitehmx/backend
cp .env.example .env
nano .env  # Configurar banco de dados e URLs
```

### 4. Configurar Nginx

```bash
sudo ./scripts/nginx-config.sh seudominio.com
```

### 5. Deploy

```bash
cd /var/www/sitehmx
./scripts/deploy-vps.sh
```

### 6. SSL (Opcional)

```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

---

**Pronto! Aplicação está no ar!** 🎉

