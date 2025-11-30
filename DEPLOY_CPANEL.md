# 🚀 Guia Completo de Deploy no cPanel

Este guia explica passo a passo como hospedar o sistema Hospital Geral do Moxico no cPanel.

## 📋 Estrutura do Projeto

- **Frontend**: Next.js (React) - pode ser deployado como estático ou com Node.js
- **Backend**: Laravel (PHP) 
- **Banco de Dados**: MySQL/MariaDB

## ✅ Pré-requisitos

1. ✅ Acesso ao cPanel
2. ✅ PHP 8.1 ou superior (verificar em cPanel → Select PHP Version)
3. ✅ MySQL/MariaDB disponível
4. ✅ Composer instalado (via cPanel Terminal ou SSH)
5. ❓ Node.js no servidor (opcional - apenas se usar Opção B do frontend)

**⚠️ Não tem Node.js no cPanel?** Use o guia simplificado: **`DEPLOY_CPANEL_SEM_NODE.md`** (recomendado - mais fácil!)

## 🎯 Visão Geral do Processo

1. **Backend**: Upload do Laravel para `public_html/api/` ou subdomínio
2. **Frontend**: Build e upload para `public_html/`
3. **Banco de Dados**: Criar e configurar no cPanel
4. **Configuração**: Ajustar .env, permissões e rotas

---

## 📦 PARTE 1: PREPARAR O BACKEND (Laravel)

### Passo 1.1: Preparação Local

No seu computador, prepare o backend:

```bash
cd backend

# Instalar dependências de produção
composer install --optimize-autoloader --no-dev

# Gerar chave da aplicação (se ainda não tiver)
php artisan key:generate

# Copiar o .env.example para .env (se ainda não tiver)
cp .env.example .env

# IMPORTANTE: Configure o .env com valores temporários para produção
# Você ajustará no servidor depois
```

### Passo 1.2: Criar Banco de Dados no cPanel

1. Acesse o cPanel → **MySQL Databases**
2. Crie um novo banco de dados (ex: `sitehmx_db`)
3. Crie um usuário MySQL (ex: `sitehmx_user`)
4. Adicione o usuário ao banco com privilégios **ALL PRIVILEGES**
5. **Anote as credenciais**:
   - Nome do banco: `cpanel_user_sitehmx_db`
   - Usuário: `cpanel_user_sitehmx_user`
   - Senha: (a que você definiu)

### Passo 1.3: Upload do Backend

**⚠️ IMPORTANTE:** Se você receber erro HTTP 500 durante o upload, consulte o arquivo `SOLUCAO_UPLOAD_CPANEL.md` para soluções detalhadas.

**Opção A: Via File Manager do cPanel (para arquivos pequenos)**

1. Acesse **File Manager** no cPanel
2. Navegue até `public_html`
3. Crie uma pasta chamada `api` (ou use um subdomínio - veja alternativa abaixo)
4. Faça upload de **TODOS** os arquivos do diretório `backend/`, **EXCETO**:
   - ❌ `.env` (você criará manualmente no servidor)
   - ❌ `.git/`
   - ❌ `vendor/` ⚠️ **MUITO GRANDE - instale no servidor via Composer**
   - ❌ `node_modules/` (se existir)
   - ❌ Arquivos de backup

**Opção B: Via FTP/SFTP (Recomendado para arquivos grandes)**

Use um cliente FTP (FileZilla, WinSCP, Cyberduck) para fazer upload de todos os arquivos do `backend/` para `public_html/api/`

**Opção C: Instalar Dependências no Servidor (Melhor Prática)**

**Não faça upload da pasta `vendor/`!** Instale no servidor:

1. Faça upload apenas da estrutura básica (sem `vendor/`)
2. No Terminal do cPanel:
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev
   ```

Isso evita problemas com arquivos grandes e é muito mais rápido!

**Estrutura final deve ser:**
```
public_html/
└── api/
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/
    ├── routes/
    ├── storage/
    ├── vendor/
    ├── artisan
    ├── composer.json
    └── ... (outros arquivos)
```

### Passo 1.4: Configurar .env no Servidor

1. No File Manager, navegue até `public_html/api/`
2. Crie um arquivo `.env` (pode copiar de `.env.example` se existir)
3. Edite o `.env` com as seguintes configurações:

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
DB_DATABASE=cpanel_user_sitehmx_db
DB_USERNAME=cpanel_user_sitehmx_user
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

# Daily.co (se estiver usando)
DAILY_API_KEY=sua_chave_daily
DAILY_DOMAIN=seu_dominio_daily
```

**⚠️ IMPORTANTE:**
- Substitua `seudominio.com` pelo seu domínio real
- Use o nome completo do banco e usuário do cPanel (geralmente com prefixo do usuário)
- Use a chave `APP_KEY` que foi gerada no passo 1.1

### Passo 1.5: Configurar Permissões

No File Manager do cPanel:

1. Navegue até `public_html/api/`
2. Clique com botão direito em `storage/` → **Change Permissions** → Defina como `775`
3. Faça o mesmo para `bootstrap/cache/` → `775`

Ou via Terminal/SSH:
```bash
cd ~/public_html/api
chmod -R 775 storage bootstrap/cache
```

### Passo 1.6: Configurar .htaccess

Verifique se existe um arquivo `.htaccess` em `public_html/api/public/`. Se não existir, crie-o:

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

**Se usar subdomínio para API (recomendado):**

Se você criou um subdomínio `api.seudominio.com`:

1. No cPanel → **Subdomains**
2. Crie subdomínio `api` apontando para `public_html/api/public`

### Passo 1.7: Executar Migrações

No Terminal do cPanel ou via SSH:

```bash
cd ~/public_html/api

# Limpar cache
php artisan config:clear
php artisan cache:clear

# Executar migrações
php artisan migrate --force

# (Opcional) Popular banco com dados iniciais
php artisan db:seed --force

# Otimizar para produção
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Passo 1.8: Criar Link Simbólico do Storage

```bash
cd ~/public_html/api
php artisan storage:link
```

Isso criará um link simbólico de `storage/app/public` para `public/storage`

---

## 🎨 PARTE 2: PREPARAR O FRONTEND (Next.js)

Você tem **DUAS OPÇÕES** para o frontend:

### 🔹 OPÇÃO A: Build Estático (Mais Simples - Recomendado)

Não precisa de Node.js no servidor, funciona apenas com arquivos estáticos.

#### Passo 2A.1: Preparar Build Local

No seu computador:

```bash
cd frontend

# Criar arquivo .env.local
echo "NEXT_PUBLIC_API_URL=https://seudominio.com/api" > .env.local

# Instalar dependências
npm install

# Modificar next.config.js temporariamente para export estático
# Adicione: output: 'export'
```

**Edite `frontend/next.config.js`** e adicione `output: 'export'`:

```javascript
const nextConfig = {
  output: 'export', // Adicionar esta linha para build estático
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // ... resto da configuração
}
```

#### Passo 2A.2: Fazer Build

```bash
npm run build
```

Isso criará a pasta `out/` com os arquivos estáticos.

#### Passo 2A.3: Upload dos Arquivos

1. No File Manager, navegue até `public_html/`
2. **Apague tudo** que estiver lá (faça backup primeiro!)
3. Faça upload de **TODA** a pasta `frontend/out/` mantendo a estrutura:
   - `index.html`
   - `404.html`
   - Pasta `_next/` (completa)
   - Pasta `images/` (completa)
   - Todas as outras pastas e arquivos

**Estrutura final:**
```
public_html/
├── index.html
├── 404.html
├── _next/
├── images/
├── gestao/
├── sobre/
└── ... (outros arquivos)
```

#### Passo 2A.4: Verificar Permissões

Certifique-se de que:
- Pastas: `755`
- Arquivos: `644`

---

### 🔹 OPÇÃO B: Com Node.js (Mais Flexível)

Permite uso de SSR e funcionalidades mais avançadas do Next.js.

#### Passo 2B.1: Preparar Build Local

```bash
cd frontend

# Criar arquivo .env.local
echo "NEXT_PUBLIC_API_URL=https://seudominio.com/api" > .env.local

# Instalar dependências
npm install

# Fazer build
npm run build
```

#### Passo 2B.2: Upload dos Arquivos

No File Manager, faça upload para `public_html/`:
- Pasta `.next/` (completa)
- Pasta `public/` (completa)
- Arquivo `package.json`
- Arquivo `next.config.js`
- Arquivo `server.js`
- Arquivo `.env.local` (crie manualmente no servidor)

#### Passo 2B.3: Instalar Node.js no cPanel

1. No cPanel, procure por **"Node.js"** ou **"Setup Node.js App"**
2. Clique em **"Create Application"**
3. Configure:
   - **Node.js version**: 18.x ou superior
   - **Application mode**: Production
   - **Application root**: `public_html`
   - **Application URL**: `seudominio.com` (ou deixe em branco para domínio principal)
   - **Application startup file**: `server.js`
4. Clique em **Create**

#### Passo 2B.4: Instalar Dependências no Servidor

No Terminal do cPanel:

```bash
cd ~/public_html
npm install --production
```

#### Passo 2B.5: Iniciar Aplicação

No cPanel → Node.js App:
- Clique em **Restart** ou **Start** na sua aplicação

---

## ⚙️ PARTE 3: CONFIGURAÇÕES FINAIS

### Passo 3.1: Configurar CORS no Laravel

Edite `public_html/api/config/cors.php`:

```php
'allowed_origins' => [
    'https://seudominio.com',
    'http://seudominio.com', // Para desenvolvimento/teste
],
```

Ou mantenha `['*']` se quiser permitir qualquer origem (menos seguro, mas funciona).

### Passo 3.2: Configurar SSL/HTTPS

1. No cPanel → **SSL/TLS Status**
2. Selecione seu domínio
3. Clique em **Run AutoSSL** ou instale um certificado Let's Encrypt (gratuito)

### Passo 3.3: Verificar Variáveis de Ambiente

**Frontend** (`public_html/.env.local` - se usar Opção B):
```
NEXT_PUBLIC_API_URL=https://seudominio.com/api
```

**Backend** (`public_html/api/.env`):
```
APP_URL=https://seudominio.com/api
FRONTEND_URL=https://seudominio.com
```

---

## 🧪 PARTE 4: TESTAR

### Testes Básicos

1. **Frontend**: Acesse `https://seudominio.com`
   - Deve carregar a página inicial
   - Verifique se as imagens carregam

2. **API**: Acesse `https://seudominio.com/api/public/noticias`
   - Deve retornar JSON com notícias (ou array vazio se não houver)

3. **Login**: Tente fazer login em `https://seudominio.com/gestao`
   - Deve conectar com a API

### Verificar Logs

**Laravel:**
```bash
cd ~/public_html/api
tail -f storage/logs/laravel.log
```

**Node.js (se usar Opção B):**
- No cPanel → Node.js App → Veja os logs

---

## 🔧 TROUBLESHOOTING

### ⚠️ Erro HTTP 500 ao Fazer Upload

Se você receber erro "The upload failed. The server indicated HTTP error 500" ao tentar fazer upload no cPanel, consulte o arquivo **`SOLUCAO_UPLOAD_CPANEL.md`** para soluções detalhadas.

**Soluções rápidas:**
1. **Use FTP/SFTP** ao invés do File Manager (mais estável para arquivos grandes)
2. **Não faça upload de `vendor/`** - instale via Composer no servidor
3. **Compacte arquivos em ZIP** antes de fazer upload
4. **Aumente limites do PHP** no cPanel → Select PHP Version → Options

**Melhor prática:** Faça upload apenas da estrutura básica e instale dependências no servidor:
```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev
```

### Erro 500 no Laravel

**Causas comuns:**

1. **Permissões incorretas**
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

2. **.env não configurado**
   - Verifique se o arquivo `.env` existe
   - Confirme que `APP_KEY` está definido
   - Verifique credenciais do banco

3. **Banco de dados não conecta**
   - Verifique credenciais no `.env`
   - Teste conexão via phpMyAdmin
   - Confirme que o usuário tem privilégios

4. **Ver logs:**
   ```bash
   tail -50 ~/public_html/api/storage/logs/laravel.log
   ```

### Erro 404 na API

1. **Verifique o .htaccess** em `public_html/api/public/`
2. **Se usar subdomínio**: Verifique se aponta para `public_html/api/public`
3. **Verifique as rotas:**
   ```bash
   cd ~/public_html/api
   php artisan route:list | grep api
   ```

### CORS Errors

1. Verifique `config/cors.php` no Laravel
2. Confirme URLs no `.env` (sem barra no final)
3. Teste com Postman/Insomnia primeiro

### Imagens não Carregam

1. Verifique se a pasta `images/` foi enviada
2. Verifique permissões (755 para pastas, 644 para arquivos)
3. Verifique caminhos no código (devem ser relativos)

### Next.js não Inicia (Opção B)

1. Verifique versão do Node.js (deve ser 18+)
2. Verifique logs no cPanel → Node.js App
3. Confirme que `npm install` foi executado
4. Verifique se `server.js` existe e está correto

---

## 📝 CHECKLIST DE DEPLOY

Marque cada item ao completar:

### Backend
- [ ] Composer install executado localmente
- [ ] APP_KEY gerado
- [ ] Banco de dados criado no cPanel
- [ ] Arquivos do backend enviados para `public_html/api/`
- [ ] Arquivo `.env` criado e configurado no servidor
- [ ] Permissões configuradas (storage e bootstrap/cache → 775)
- [ ] .htaccess configurado
- [ ] Migrações executadas (`php artisan migrate --force`)
- [ ] Storage link criado (`php artisan storage:link`)
- [ ] Cache otimizado

### Frontend
- [ ] .env.local configurado com URL da API
- [ ] Build executado localmente
- [ ] Arquivos enviados para `public_html/`
- [ ] (Se Opção B) Node.js App criado e iniciado
- [ ] Permissões verificadas

### Configuração
- [ ] CORS configurado no Laravel
- [ ] SSL/HTTPS instalado
- [ ] Variáveis de ambiente verificadas
- [ ] Testes básicos realizados

---

## 🔄 ATUALIZAÇÕES FUTURAS

### Atualizar Backend

1. Faça upload dos novos arquivos
2. No servidor:
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   ```

### Atualizar Frontend

1. Faça novo build localmente
2. Faça upload dos novos arquivos
3. (Se Opção B) Reinicie a aplicação Node.js no cPanel

---

## 💡 DICAS IMPORTANTES

1. **Sempre faça backup** antes de fazer deploy ou atualizações
2. **Mantenha `APP_DEBUG=false`** em produção
3. **Use HTTPS** sempre (SSL gratuito via Let's Encrypt)
4. **Monitore os logs** regularmente
5. **Mantenha PHP, Node.js e dependências atualizados**

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique os logs primeiro
2. Consulte esta documentação
3. Verifique configurações de .env e permissões
4. Teste cada componente isoladamente (API, Frontend, BD)

**Boa sorte com o deploy! 🚀**
