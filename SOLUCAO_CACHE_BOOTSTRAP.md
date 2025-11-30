# 🔧 Solução: Erro CollisionServiceProvider (Cache do Bootstrap)

## ❌ Problema

O Laravel está tentando carregar `CollisionServiceProvider` que é uma dependência de desenvolvimento não instalada. Isso acontece porque o cache de serviços (`bootstrap/cache/services.php`) foi gerado em desenvolvimento.

## ✅ Solução: Limpar Cache do Bootstrap

Execute estes comandos no servidor:

```bash
# 1. Ir para o diretório do Laravel
cd ~/public_html/api

# 2. Remover cache do bootstrap
rm -rf bootstrap/cache/*.php

# 3. Manter apenas o diretório (não apagar a pasta)
# Os arquivos .php serão regenerados

# 4. Verificar que foi limpo
ls -la bootstrap/cache/

# 5. Agora tentar novamente
php artisan --version
```

---

## 🎯 Solução Completa Passo a Passo

```bash
# 1. Limpar TODOS os caches
cd ~/public_html/api

# 2. Remover cache do bootstrap
rm -f bootstrap/cache/services.php
rm -f bootstrap/cache/packages.php
rm -f bootstrap/cache/config.php
rm -f bootstrap/cache/routes.php

# 3. Recriar estrutura se necessário
mkdir -p bootstrap/cache

# 4. Agora tentar artisan
php artisan --version
```

---

## 🔍 Se Ainda Der Erro

### Verificar se .env existe e tem APP_KEY

```bash
# Verificar .env
cat .env | grep APP_KEY

# Se não tiver APP_KEY, criar
cp .env.example .env 2>/dev/null || touch .env
php artisan key:generate
```

### Limpar tudo e recomeçar

```bash
cd ~/public_html/api

# Limpar todos os caches
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true

# Remover cache do bootstrap
rm -f bootstrap/cache/*.php

# Tentar novamente
php artisan --version
```

---

## ✅ Solução Alternativa: Recriar Cache Corretamente

```bash
cd ~/public_html/api

# 1. Limpar tudo
rm -f bootstrap/cache/*.php

# 2. Criar .env se não existir
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || touch .env
    php artisan key:generate
fi

# 3. Limpar todos os caches
php artisan optimize:clear 2>/dev/null || echo "Comando não disponível"

# 4. Agora tentar
php artisan --version
```

---

## 📋 Comandos Rápidos (Copie e Cole)

Execute tudo de uma vez:

```bash
cd ~/public_html/api && \
rm -f bootstrap/cache/*.php && \
mkdir -p bootstrap/cache && \
php artisan --version 2>/dev/null || echo "Ainda com erro, continue..."
```

---

**Execute o primeiro bloco de comandos para limpar o cache do bootstrap!** ✅

