# 🚀 Guia de Deploy no cPanel SEM Node.js

Este guia é para quem **NÃO tem Node.js disponível no cPanel**. Usaremos build estático do Next.js.

## ✅ O que você precisa

1. ✅ cPanel com acesso
2. ✅ PHP 8.1+ 
3. ✅ MySQL/MariaDB
4. ✅ Composer (para Laravel)
5. ❌ **NÃO precisa de Node.js no servidor** ✅

---

## 📋 Estrutura Final no Servidor

```
public_html/
├── index.html          ← Frontend (build estático)
├── _next/             ← Assets do Next.js
├── images/            ← Imagens do site
├── gestao/            ← Páginas do sistema
└── api/               ← Backend Laravel
    ├── app/
    ├── config/
    ├── public/
    └── ...
```

---

## 🔧 PARTE 1: PREPARAR O FRONTEND (Build Estático)

### Passo 1.1: Configurar para Build Estático

**No seu computador**, edite o arquivo `frontend/next.config.js`:

```javascript
const nextConfig = {
  output: 'export', // ← ADICIONE ESTA LINHA
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // ... resto da configuração
}
```

### Passo 1.2: Criar .env.local

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=https://seudominio.com/api" > .env.local
```

**Substitua `seudominio.com` pelo seu domínio real!**

### Passo 1.3: Fazer Build Estático

```bash
cd frontend
npm install  # Se ainda não instalou as dependências
npm run build
```

Isso criará a pasta `frontend/out/` com todos os arquivos estáticos.

### Passo 1.4: Verificar o Build

Verifique se a pasta `out/` foi criada e contém:
- `index.html`
- `404.html`
- Pasta `_next/`
- Pasta `images/`
- Outras pastas e arquivos

---

## 🔧 PARTE 2: PREPARAR O BACKEND (Laravel)

**📚 Para um guia detalhado e completo do backend, consulte: `BACKEND_CPANEL.md`**

### Passo 2.1: Preparação Local

```bash
cd backend

# Instalar dependências de produção
composer install --optimize-autoloader --no-dev

# Gerar chave (se ainda não tiver)
php artisan key:generate

# Anote a APP_KEY gerada - você precisará dela no servidor!
```

### Passo 2.2: Criar Banco de Dados no cPanel

1. cPanel → **MySQL Databases**
2. Crie um banco de dados (ex: `sitehmx_db`)
3. Crie um usuário MySQL
4. Adicione o usuário ao banco com privilégios completos
5. **Anote as credenciais**:
   - Nome completo do banco (geralmente: `usuario_sitehmx_db`)
   - Nome completo do usuário (geralmente: `usuario_sitehmx_user`)
   - Senha

---

## 📤 PARTE 3: UPLOAD PARA O SERVIDOR

### Passo 3.1: Upload do Frontend (Build Estático)

**Opção A: Via FTP/SFTP (Recomendado)**

1. Conecte via FTP ao servidor
2. Navegue até `public_html/`
3. **Apague tudo** que estiver lá (faça backup primeiro!)
4. Faça upload de **TODA** a pasta `frontend/out/` mantendo a estrutura:
   ```
   public_html/
   ├── index.html
   ├── 404.html
   ├── _next/
   ├── images/      ← TODAS as imagens aqui
   ├── gestao/
   └── ...
   ```

**Opção B: Via File Manager (Para arquivos pequenos)**

1. No File Manager, vá até `public_html/`
2. Apague o conteúdo existente
3. Faça upload dos arquivos da pasta `out/`

**⚠️ Se der erro 500 no upload, consulte `SOLUCAO_UPLOAD_CPANEL.md`**

### Passo 3.2: Upload do Backend

**⚠️ IMPORTANTE: NÃO faça upload da pasta `vendor/`!**

**Opção A: Via FTP/SFTP**

1. Conecte via FTP
2. Navegue até `public_html/`
3. Crie uma pasta `api/`
4. Faça upload de **todos os arquivos** do `backend/`, **EXCETO**:
   - ❌ `vendor/` (instalaremos no servidor)
   - ❌ `.env` (criaremos no servidor)
   - ❌ `.git/`

**Opção B: Instalar vendor/ no servidor (Melhor)**

1. Faça upload apenas da estrutura básica (sem `vendor/`)
2. No Terminal do cPanel:
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev
   ```

---

## ⚙️ PARTE 4: CONFIGURAÇÃO NO SERVIDOR

### Passo 4.1: Configurar .env do Backend

1. No File Manager, navegue até `public_html/api/`
2. Crie um arquivo `.env` (pode copiar de `.env.example` se existir)
3. Configure com estas informações:

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_KEY=base64:SUA_CHAVE_AQUI
APP_DEBUG=false
APP_URL=https://seudominio.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=usuario_sitehmx_db
DB_USERNAME=usuario_sitehmx_user
DB_PASSWORD=SUA_SENHA

FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com
```

**Substitua:**
- `seudominio.com` → seu domínio
- `APP_KEY` → a chave gerada no passo 2.1
- Credenciais do banco → as que você anotou no passo 2.2

### Passo 4.2: Configurar Permissões

Via Terminal do cPanel ou File Manager:

```bash
cd ~/public_html/api
chmod -R 775 storage bootstrap/cache
```

### Passo 4.3: Executar Migrações

```bash
cd ~/public_html/api
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

---

## ✅ PARTE 5: TESTAR

### Teste 1: Frontend

Acesse: `https://seudominio.com`
- ✅ Deve carregar a página inicial
- ✅ Imagens devem aparecer

### Teste 2: API

Acesse: `https://seudominio.com/api/public/noticias`
- ✅ Deve retornar JSON (mesmo que vazio)

### Teste 3: Login

Acesse: `https://seudominio.com/gestao/login`
- ✅ Deve carregar a página de login
- ✅ Tente fazer login

---

## 🔧 TROUBLESHOOTING

### Erro 500 no Upload

**Solução:** Use FTP/SFTP ao invés do File Manager. Consulte `SOLUCAO_UPLOAD_CPANEL.md`.

### Imagens Não Aparecem

1. Verifique se a pasta `images/` está em `public_html/images/`
2. Verifique permissões (755 para pastas, 644 para arquivos)
3. Teste acesso direto: `https://seudominio.com/images/logo.jpeg`

### API Retorna 404

1. Verifique se o backend está em `public_html/api/`
2. Verifique se há `.htaccess` em `public_html/api/public/`
3. Se usar subdomínio, configure apontando para `public_html/api/public`

### Erro 500 na API

1. Verifique o `.env` está configurado corretamente
2. Verifique permissões de `storage/` e `bootstrap/cache/`
3. Veja os logs: `public_html/api/storage/logs/laravel.log`

---

## 📝 CHECKLIST FINAL

- [ ] Frontend: Build estático feito (`out/` criada)
- [ ] Frontend: Upload de `out/` para `public_html/` completo
- [ ] Backend: Estrutura enviada para `public_html/api/`
- [ ] Backend: `vendor/` instalado via Composer no servidor
- [ ] Backend: `.env` criado e configurado
- [ ] Backend: Permissões configuradas (storage, bootstrap/cache)
- [ ] Backend: Migrações executadas
- [ ] Testes realizados (frontend, API, login)
- [ ] SSL/HTTPS instalado

---

## 💡 DICAS IMPORTANTES

1. **NÃO precisa de Node.js no servidor** - apenas para fazer o build localmente
2. **NÃO faça upload de `vendor/`** - instale no servidor
3. **Use FTP/SFTP** para arquivos grandes
4. **Faça backup** antes de qualquer alteração
5. **Mantenha `APP_DEBUG=false`** em produção

---

## 🎯 Resumo Rápido

1. ✅ Build estático localmente: `cd frontend && npm run build`
2. ✅ Upload de `frontend/out/` para `public_html/`
3. ✅ Upload de backend (sem `vendor/`) para `public_html/api/`
4. ✅ Instalar `vendor/` no servidor: `composer install`
5. ✅ Configurar `.env` no servidor
6. ✅ Executar migrações
7. ✅ Testar!

---

**Pronto! Seu site está no ar sem precisar de Node.js no servidor! 🚀**

