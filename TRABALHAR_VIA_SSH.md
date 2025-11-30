# 🔧 Trabalhar via SSH

## 📋 Como Usar

Eu não posso me conectar diretamente ao servidor, mas criei scripts e comandos prontos para você executar.

---

## 🚀 OPÇÃO 1: Usar Scripts (Mais Fácil)

### 1. Fazer upload dos scripts para o servidor:

```bash
# No seu computador local
scp scripts/deploy-backend-ssh.sh ebvutbmy@50.6.35.67:~/public_html/api/
scp scripts/verificar-rotas-servidor.sh ebvutbmy@50.6.35.67:~/public_html/api/
scp scripts/atualizar-backend-ssh.sh ebvutbmy@50.6.35.67:~/public_html/api/
```

### 2. No servidor, executar:

```bash
ssh ebvutbmy@50.6.35.67
cd ~/public_html/api
bash deploy-backend-ssh.sh
```

---

## 🚀 OPÇÃO 2: Copiar e Colar Comandos

### 1. Conectar ao servidor:

```bash
ssh ebvutbmy@50.6.35.67
```

### 2. Ir para o diretório:

```bash
cd ~/public_html/api
```

### 3. Executar comandos (copiar de `COMANDOS_SSH_COPIAR_COLAR.txt`):

```bash
# Limpar cache
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# Recriar cache
php artisan route:cache
php artisan config:cache

# Verificar rotas
php artisan route:list | grep "consulta-online/buscar"
```

---

## 📦 Scripts Disponíveis

### `deploy-backend-ssh.sh`
- Limpa cache
- Recria cache
- Verifica rotas

### `verificar-rotas-servidor.sh`
- Lista rotas de consulta-online
- Lista rotas públicas
- Verifica se há rotas com `/public/`

### `atualizar-backend-ssh.sh`
- Verifica arquivos
- Limpa cache
- Recria cache
- Verifica rotas

---

## 🔍 Verificar Alterações

### Verificar se arquivos foram atualizados:

```bash
cd ~/public_html/api

# Verificar PublicController
cat app/Http/Controllers/Api/PublicController.php | grep "url.*api/consultas"
# Deve mostrar URLs sem /public/

# Verificar AppServiceProvider
cat app/Providers/AppServiceProvider.php | grep "Route::prefix"
# NÃO deve mostrar Route::prefix('api')
```

### Verificar rotas:

```bash
php artisan route:list | grep "consulta-online/buscar"
php artisan route:list | grep "noticias"
```

---

## ⚠️ IMPORTANTE

1. **Faça upload dos arquivos corrigidos primeiro** via FTP/cPanel:
   - `backend/app/Http/Controllers/Api/PublicController.php`
   - `backend/app/Providers/AppServiceProvider.php`
   - `backend/.htaccess`

2. **Depois execute os scripts ou comandos** no servidor

3. **Sempre limpe o cache** após fazer alterações

---

**Use os scripts ou comandos acima para trabalhar via SSH!** 🚀

