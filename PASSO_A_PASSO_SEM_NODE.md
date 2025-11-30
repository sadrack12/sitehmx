# 🎯 Passo a Passo Rápido: Deploy SEM Node.js no cPanel

## ⚡ Resumo Ultra Rápido

1. **Frontend:** Build estático local → Upload pasta `out/`
2. **Backend:** Upload estrutura → Instalar `vendor/` no servidor
3. **Configurar:** `.env` e permissões
4. **Pronto!** 🚀

---

## 📝 Passo 1: Preparar Frontend (No Seu Computador)

### 1.1 Editar next.config.js

Abra `frontend/next.config.js` e **adicione** esta linha:

```javascript
const nextConfig = {
  output: 'export', // ← ADICIONE ESTA LINHA
  reactStrictMode: true,
  // ... resto
}
```

### 1.2 Criar .env.local

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=https://seudominio.com/api" > .env.local
```

**Substitua `seudominio.com` pelo seu domínio!**

### 1.3 Fazer Build

```bash
npm install
npm run build
```

Isso criará a pasta `frontend/out/` ✅

**OU use o script:**
```bash
./scripts/build-estatico.sh https://seudominio.com/api
```

---

## 📤 Passo 2: Upload para o Servidor

### 2.1 Upload do Frontend

**Via FTP ou File Manager:**
- Upload **TODA** a pasta `frontend/out/` para `public_html/`
- Certifique-se de incluir a pasta `images/`

**Estrutura final:**
```
public_html/
├── index.html
├── _next/
├── images/
└── ...
```

### 2.2 Upload do Backend

**Via FTP:**
- Crie pasta `public_html/api/`
- Upload **todos os arquivos** de `backend/`, **EXCETO**:
  - ❌ `vendor/`
  - ❌ `.env`
  - ❌ `.git/`

**Depois, no Terminal do cPanel:**
```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev
```

---

## ⚙️ Passo 3: Configurar no Servidor

### 3.1 Criar Banco de Dados

1. cPanel → **MySQL Databases**
2. Crie banco e usuário
3. Anote as credenciais

### 3.2 Criar .env

No File Manager, crie `public_html/api/.env`:

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_KEY=base64:SUA_CHAVE_AQUI
APP_DEBUG=false
APP_URL=https://seudominio.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=usuario_nome_banco
DB_USERNAME=usuario_nome_user
DB_PASSWORD=senha

FRONTEND_URL=https://seudominio.com
```

### 3.3 Configurar Permissões

```bash
cd ~/public_html/api
chmod -R 775 storage bootstrap/cache
```

### 3.4 Executar Migrações

```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
```

---

## ✅ Passo 4: Testar

1. **Frontend:** `https://seudominio.com` ✅
2. **API:** `https://seudominio.com/api/public/noticias` ✅
3. **Login:** `https://seudominio.com/gestao/login` ✅

---

## 🔧 Se Der Erro

### Erro 500 no Upload
→ Use FTP ao invés do File Manager
→ Consulte `SOLUCAO_UPLOAD_CPANEL.md`

### Imagens não Aparecem
→ Verifique se pasta `images/` está em `public_html/images/`
→ Verifique permissões (755)

### API não Funciona
→ Verifique `.env`
→ Verifique permissões de `storage/`
→ Veja logs: `storage/logs/laravel.log`

---

## 📚 Documentação Completa

- **`DEPLOY_CPANEL_SEM_NODE.md`** - Guia completo detalhado
- **`DEPLOY_CPANEL.md`** - Guia completo (com opção Node.js)
- **`SOLUCAO_UPLOAD_CPANEL.md`** - Soluções para problemas de upload

---

**Pronto! Seu site está no ar! 🎉**

