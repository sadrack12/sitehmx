# 🔧 Guia Completo: Deploy do Backend Laravel no cPanel

Guia detalhado para fazer deploy do backend Laravel no cPanel.

---

## 📋 Pré-requisitos

- ✅ cPanel com acesso
- ✅ PHP 8.1 ou superior
- ✅ MySQL/MariaDB disponível
- ✅ Composer disponível (via Terminal/SSH do cPanel)
- ✅ Terminal/SSH do cPanel ou acesso via SSH

---

## 🔧 PARTE 1: PREPARAÇÃO LOCAL

### Passo 1.1: Preparar o Backend

**No seu computador:**

```bash
cd backend

# Instalar dependências de produção
composer install --optimize-autoloader --no-dev

# Gerar chave da aplicação
php artisan key:generate

# Anote a APP_KEY gerada! Você precisará dela no servidor
```

**⚠️ IMPORTANTE:** Copie a `APP_KEY` gerada (começa com `base64:`). Você precisará dela no servidor.

### Passo 1.2: Verificar Arquivos

Certifique-se de que estes arquivos estão presentes:
- ✅ `composer.json`
- ✅ `composer.lock`
- ✅ `.env.example` (para referência)

---

## 🗄️ PARTE 2: BANCO DE DADOS

### Passo 2.1: Criar Banco de Dados no cPanel

1. **Acesse cPanel → MySQL Databases**

2. **Criar banco de dados:**
   - Nome: `sitehmx_db` (ou outro nome)
   - Clique em **"Create Database"**
   - **Anote o nome completo:** Geralmente será `usuario_cpanel_sitehmx_db`

3. **Criar usuário MySQL:**
   - Usuário: `sitehmx_user` (ou outro nome)
   - Senha: (crie uma senha forte)
   - Clique em **"Create User"**
   - **Anote o nome completo:** Geralmente será `usuario_cpanel_sitehmx_user`

4. **Adicionar usuário ao banco:**
   - Selecione o usuário e o banco
   - Clique em **"Add"**
   - Marque **"ALL PRIVILEGES"**
   - Clique em **"Make Changes"**

5. **📝 Anote todas as credenciais:**
   ```
   DB_HOST: localhost
   DB_PORT: 3306
   DB_DATABASE: usuario_cpanel_sitehmx_db
   DB_USERNAME: usuario_cpanel_sitehmx_user
   DB_PASSWORD: sua_senha_aqui
   ```

---

## 📤 PARTE 3: UPLOAD DOS ARQUIVOS

### Passo 3.1: Estrutura no Servidor

O backend deve ficar em uma destas localizações:

**Opção A: Subpasta (Recomendado)**
```
public_html/
└── api/
    ├── app/
    ├── config/
    ├── public/
    └── ...
```

**Opção B: Subdomínio**
```
public_html/api/ ou subdomínio api.seudominio.com
```

### Passo 3.2: Fazer Upload

**⚠️ IMPORTANTE: NÃO faça upload da pasta `vendor/`!**

#### Estratégia Recomendada:

**1. Fazer upload da estrutura básica (sem vendor/):**

Faça upload de TODOS os arquivos e pastas, **EXCETO**:
- ❌ `vendor/` ← Instalaremos no servidor
- ❌ `.env` ← Criaremos no servidor
- ❌ `.git/`
- ❌ `node_modules/` (se existir)
- ❌ Arquivos de backup

**Arquivos e pastas para fazer upload:**
- ✅ `app/`
- ✅ `bootstrap/`
- ✅ `config/`
- ✅ `database/`
- ✅ `public/`
- ✅ `resources/`
- ✅ `routes/`
- ✅ `storage/` (estrutura apenas, sem logs)
- ✅ `artisan`
- ✅ `composer.json`
- ✅ `composer.lock`
- ✅ Todos os outros arquivos de configuração

**2. Opções de upload:**

**Via FTP/SFTP (Recomendado):**
1. Conecte via FTP/SFTP ao servidor
2. Navegue até `public_html/`
3. Crie pasta `api/` se não existir
4. Faça upload de todos os arquivos (sem `vendor/`)

**Via File Manager:**
1. cPanel → File Manager
2. Navegue até `public_html/`
3. Crie pasta `api/`
4. Faça upload dos arquivos

**⚠️ Se der erro 500 no upload, consulte `SOLUCAO_UPLOAD_CPANEL.md`**

---

## ⚙️ PARTE 4: INSTALAR DEPENDÊNCIAS NO SERVIDOR

### Passo 4.1: Instalar Composer (Se Necessário)

**Verificar se Composer está instalado:**

No Terminal do cPanel:
```bash
composer --version
```

**Se não estiver instalado:**

```bash
cd ~
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

Ou use a versão local:
```bash
cd ~/public_html/api
curl -sS https://getcomposer.org/installer | php
php composer.phar install --optimize-autoloader --no-dev
```

### Passo 4.2: Instalar Dependências

**⚠️ IMPORTANTE:** Se você receber erro sobre classes não encontradas, use `--no-scripts`:

```bash
cd ~/public_html/api
# Primeiro, instalar sem executar scripts
composer install --optimize-autoloader --no-dev --no-scripts

# Depois, gerar autoloader
composer dump-autoload --optimize
```

**Se funcionar normalmente (sem erros):**
```bash
composer install --optimize-autoloader --no-dev
```

**Isso vai:**
- ✅ Instalar todas as dependências
- ✅ Criar a pasta `vendor/` automaticamente
- ✅ Otimizar o autoloader

**Tempo estimado:** 2-5 minutos

**Se der erro, consulte `SOLUCAO_ERRO_COMPOSER.md`**

---

## 📝 PARTE 5: CONFIGURAR .env

### Passo 5.1: Criar Arquivo .env

**Via File Manager:**
1. Navegue até `public_html/api/`
2. Se existir `.env.example`, copie e renomeie para `.env`
3. Ou crie um novo arquivo `.env`

**Via Terminal:**
```bash
cd ~/public_html/api
cp .env.example .env  # Se existir
# Ou
touch .env
```

### Passo 5.2: Configurar .env

Edite o arquivo `.env` com estas configurações:

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_KEY=base64:SUA_CHAVE_GERADA_LOCALMENTE
APP_DEBUG=false
APP_URL=https://seudominio.com/api

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=usuario_cpanel_sitehmx_db
DB_USERNAME=usuario_cpanel_sitehmx_user
DB_PASSWORD=SUA_SENHA_DO_BANCO

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# CORS - IMPORTANTE: Substitua pelo seu domínio
FRONTEND_URL=https://seudominio.com

# Sanctum
SANCTUM_STATEFUL_DOMAINS=seudominio.com

# Mail (configure se necessário)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@seudominio.com"
MAIL_FROM_NAME="${APP_NAME}"

# Daily.co (se estiver usando videoconferência)
DAILY_API_KEY=
DAILY_DOMAIN=
```

**⚠️ IMPORTANTE - Substitua:**
- `seudominio.com` → seu domínio real
- `APP_KEY` → a chave que você gerou no passo 1.1
- Credenciais do banco → as que você anotou no passo 2.1

---

## 🔐 PARTE 6: CONFIGURAR PERMISSÕES

### Passo 6.1: Permissões Necessárias

```bash
cd ~/public_html/api

# Dar permissões para storage e cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Verificar propriedade (pode variar)
# Se necessário, ajuste o dono dos arquivos
chown -R usuario:usuario storage bootstrap/cache
```

**Via File Manager:**
1. Clique com botão direito em `storage/` → Change Permissions → `775`
2. Clique com botão direito em `bootstrap/cache/` → Change Permissions → `775`

---

## 🚀 PARTE 7: EXECUTAR COMANDOS LARAVEL

### Passo 7.1: Limpar Cache

```bash
cd ~/public_html/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Passo 7.2: Executar Migrações

```bash
php artisan migrate --force
```

**Isso criará todas as tabelas no banco de dados.**

### Passo 7.3: (Opcional) Popular Banco com Dados Iniciais

```bash
php artisan db:seed --force
```

### Passo 7.4: Criar Link Simbólico do Storage

```bash
php artisan storage:link
```

Isso criará um link de `storage/app/public` para `public/storage`.

### Passo 7.5: Otimizar para Produção

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🌐 PARTE 8: CONFIGURAR ROTAS (IMPORTANTE!)

### Passo 8.1: Estrutura de Diretórios

Se o Laravel está em `public_html/api/`, você precisa acessar via `public_html/api/public/`

**Estrutura:**
```
public_html/api/
├── public/          ← Arquivos públicos acessíveis
│   ├── index.php   ← Entry point
│   └── .htaccess
└── ...
```

### Passo 8.2: Configurar .htaccess

Verifique se existe `.htaccess` em `public_html/api/public/`:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### Passo 8.3: Configurar Acesso à API

**Opção A: Subpasta (public_html/api/public/)**

A API estará acessível em: `https://seudominio.com/api/public/`

Mas normalmente você quer: `https://seudominio.com/api/`

**Para isso, você precisa:**

1. **Criar um subdomínio** (recomendado):
   - cPanel → Subdomains
   - Crie: `api.seudominio.com`
   - Document Root: `public_html/api/public`

2. **Ou configurar redirecionamento** no `.htaccess` de `public_html/`:

```apache
# Redirecionar /api/* para /api/public/*
RewriteRule ^api/(.*)$ /api/public/$1 [L]
```

**Opção B: Subdomínio**

1. cPanel → Subdomains
2. Crie subdomínio: `api`
3. Document Root: `public_html/api/public`
4. API acessível em: `https://api.seudominio.com`

---

## 🧪 PARTE 9: TESTAR

### Teste 1: Verificar se a API Responde

Acesse no navegador:
```
https://seudominio.com/api/public/noticias
```

Ou se configurou subdomínio:
```
https://api.seudominio.com/noticias
```

**Deve retornar:** JSON (mesmo que vazio `[]`)

### Teste 2: Verificar Rotas Públicas

- ✅ `/api/public/noticias`
- ✅ `/api/public/eventos`
- ✅ `/api/public/corpo-diretivo`

### Teste 3: Testar Login

Via Postman ou frontend:
```bash
POST https://seudominio.com/api/login
{
  "email": "seu@email.com",
  "password": "sua_senha"
}
```

### Teste 4: Verificar Logs

```bash
tail -f ~/public_html/api/storage/logs/laravel.log
```

---

## 🔧 TROUBLESHOOTING

### Erro 500 ao Acessar API

**Possíveis causas:**

1. **Permissões incorretas:**
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

2. **APP_KEY não configurada:**
   - Verifique se `.env` tem `APP_KEY=base64:...`
   - Se não tiver, gere: `php artisan key:generate`

3. **Banco de dados não conecta:**
   - Verifique credenciais no `.env`
   - Teste conexão via phpMyAdmin

4. **Ver logs:**
   ```bash
   tail -50 ~/public_html/api/storage/logs/laravel.log
   ```

### Erro 404 na API

**Causa:** Rotas não configuradas corretamente

**Solução:**
1. Verifique se está acessando via `public/` ou subdomínio
2. Verifique `.htaccess` em `public/`
3. Teste: `php artisan route:list`

### Erro de Permissão

```bash
cd ~/public_html/api
chmod -R 775 storage bootstrap/cache
chown -R seu_usuario:seu_usuario storage bootstrap/cache
```

### Composer não encontrado

Instale Composer no servidor ou use a versão local:
```bash
cd ~/public_html/api
curl -sS https://getcomposer.org/installer | php
php composer.phar install --optimize-autoloader --no-dev
```

---

## 📋 CHECKLIST FINAL

- [ ] Backend preparado localmente
- [ ] APP_KEY gerada e anotada
- [ ] Banco de dados criado no cPanel
- [ ] Credenciais do banco anotadas
- [ ] Arquivos enviados para `public_html/api/` (sem vendor/)
- [ ] `vendor/` instalado via Composer no servidor
- [ ] Arquivo `.env` criado e configurado
- [ ] Permissões configuradas (storage, bootstrap/cache)
- [ ] Migrações executadas
- [ ] Storage link criado
- [ ] Cache otimizado
- [ ] API testada e funcionando
- [ ] Logs verificados (sem erros)

---

## ✅ PRONTO!

Seu backend Laravel está funcionando no cPanel! 🚀

A API estará acessível em:
- `https://seudominio.com/api/public/` (subpasta)
- Ou `https://api.seudominio.com/` (subdomínio)

---

## 📚 Documentação Relacionada

- **`DEPLOY_CPANEL_SEM_NODE.md`** - Guia completo incluindo frontend
- **`SOLUCAO_UPLOAD_CPANEL.md`** - Soluções para problemas de upload
- **`DEPLOY_CHECKLIST.md`** - Checklist completo de deploy

