# 🔧 Solução: Erro 404 nas Rotas da API

## 🔍 Problema Identificado

As rotas da API estão com prefixo `api` no código. Precisamos verificar e limpar o cache.

---

## ✅ Solução: Limpar Cache de Rotas

Execute estes comandos no servidor:

```bash
cd ~/public_html/api

# Limpar cache de rotas
php artisan route:clear

# Limpar cache de configuração
php artisan config:clear

# Limpar todo cache
php artisan cache:clear

# Ver todas as rotas disponíveis
php artisan route:list | grep public
```

---

## 🔍 Verificar Rotas Registradas

Execute para ver todas as rotas:

```bash
php artisan route:list
```

Procure por rotas que começam com `api/public/`.

---

## 🎯 Testar URLs Corretas

Com base no código, as URLs corretas devem ser:

1. **Notícias:**
   ```
   https://clamatec.com/api/public/noticias
   ```

2. **Eventos:**
   ```
   https://clamatec.com/api/public/eventos
   ```

3. **Corpo Diretivo:**
   ```
   https://clamatec.com/api/public/corpo-diretivo
   ```

---

## ⚠️ Se Ainda Der 404

### Verificar se Rotas Estão Sendo Carregadas

```bash
cd ~/public_html/api

# Ver rotas registradas
php artisan route:list | grep -i "public\|noticias\|eventos"

# Se não aparecer nada, pode ser problema no registro
```

### Recriar Cache de Rotas

```bash
php artisan route:cache
php artisan config:cache
```

### Verificar Logs

```bash
tail -50 storage/logs/laravel.log | grep -i "route\|404"
```

---

## 🔧 Alternativa: Verificar Estrutura de Rotas

Se o problema persistir, pode ser que as rotas estejam sendo registradas incorretamente. Verifique:

```bash
# Ver se o arquivo de rotas existe
ls -la routes/api.php

# Ver conteúdo das rotas públicas
grep -A 5 "public/" routes/api.php
```

---

## 📋 Comandos de Diagnóstico (Execute Tudo)

```bash
cd ~/public_html/api && \
php artisan route:clear && \
php artisan config:clear && \
php artisan cache:clear && \
php artisan route:list | grep public | head -10 && \
echo "=== Verifique as rotas acima ==="
```

---

**Execute os comandos de limpeza de cache primeiro!** ✅

