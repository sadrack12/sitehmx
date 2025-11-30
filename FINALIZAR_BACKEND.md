# ✅ Laravel Funcionando! Finalizar Configuração

## 🎉 Ótimo! Laravel está funcionando!

Agora vamos finalizar a configuração do backend.

---

## 📝 Passo 1: Configurar .env

### 1.1 Verificar/Criar .env

```bash
cd ~/public_html/api

# Verificar se .env existe e tem APP_KEY
grep APP_KEY .env

# Se não existir ou estiver vazio, criar
cp .env.example .env 2>/dev/null || touch .env

# Gerar APP_KEY se não tiver
php artisan key:generate
```

### 1.2 Editar .env com suas configurações

```bash
nano .env
```

**Configure pelo menos estas linhas:**

```env
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seudominio.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=seu_nome_banco
DB_USERNAME=seu_usuario_banco
DB_PASSWORD=sua_senha_banco

FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com
```

**⚠️ Substitua:**
- `seudominio.com` → seu domínio real
- Credenciais do banco → as que você criou no cPanel

**Para salvar no nano:** `Ctrl+X`, depois `Y`, depois `Enter`

---

## ⚙️ Passo 2: Configurar Permissões

```bash
# Dar permissões necessárias
chmod -R 775 storage bootstrap/cache

# Verificar
ls -ld storage bootstrap/cache
```

---

## 🗄️ Passo 3: Executar Migrações

```bash
# Executar migrações (cria as tabelas no banco)
php artisan migrate --force

# Se der erro, verifique as credenciais do banco no .env
```

---

## 🔗 Passo 4: Criar Link do Storage

```bash
# Criar link simbólico para arquivos públicos
php artisan storage:link
```

---

## ⚡ Passo 5: Otimizar Cache

```bash
# Cache de configuração
php artisan config:cache

# Cache de rotas
php artisan route:cache

# Cache de views
php artisan view:cache
```

---

## 🧪 Passo 6: Testar a API

### Teste 1: Rota Pública

No navegador ou via curl:

```
https://seudominio.com/api/public/noticias
```

**Deve retornar:** JSON (mesmo que vazio `[]`)

### Teste 2: Verificar Logs

```bash
# Ver se há erros
tail -20 storage/logs/laravel.log
```

---

## 📋 Checklist Final

- [ ] `.env` criado e configurado
- [ ] `APP_KEY` gerada
- [ ] Permissões configuradas (storage, bootstrap/cache)
- [ ] Migrações executadas
- [ ] Storage link criado
- [ ] Cache otimizado
- [ ] API testada e funcionando

---

## 🚀 Comandos Rápidos (Execute Tudo)

```bash
cd ~/public_html/api && \
chmod -R 775 storage bootstrap/cache && \
php artisan migrate --force && \
php artisan storage:link && \
php artisan config:cache && \
php artisan route:cache && \
php artisan view:cache && \
echo "✅ Backend configurado com sucesso!"
```

---

## 🎯 Próximo: Testar API

Depois de configurar o `.env`, teste:

1. **No navegador:** `https://seudominio.com/api/public/noticias`
2. **Deve retornar JSON**

---

**Configure o .env primeiro com suas credenciais do banco de dados!** ✅

