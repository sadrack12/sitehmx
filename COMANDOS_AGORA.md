# 🚀 Execute Estes Comandos AGORA

## Opção A: Instalar Onde Está (Rápido)

Execute no servidor:

```bash
# Você já está aqui: ~/public_html/api/backend/
cd ~/public_html/api/backend

# Limpar cache
composer clear-cache

# Instalar SEM scripts (resolve o erro)
composer install --optimize-autoloader --no-dev --no-scripts

# Gerar autoloader
composer dump-autoload --optimize

# Verificar se funcionou
ls -la vendor/ | head -5
```

**Se funcionou, continue:**

```bash
# Criar .env
cp .env.example .env 2>/dev/null || touch .env

# Configurar permissões
chmod -R 775 storage bootstrap/cache

# Gerar APP_KEY
php artisan key:generate
```

---

## Opção B: Simplificar Estrutura (Recomendado)

Mova os arquivos para `api/` diretamente:

```bash
# 1. Ir para backend/
cd ~/public_html/api/backend

# 2. Mover arquivos para api/
mv app bootstrap config database public resources routes storage artisan composer.json composer.lock ~/public_html/api/

# 3. Ir para api/
cd ~/public_html/api

# 4. Verificar se moveu
ls -la

# 5. Instalar dependências
composer install --optimize-autoloader --no-dev --no-scripts
composer dump-autoload --optimize

# 6. Criar .env
cp .env.example .env 2>/dev/null || touch .env

# 7. Permissões
chmod -R 775 storage bootstrap/cache

# 8. Gerar APP_KEY
php artisan key:generate
```

---

## 🔍 Depois, Verifique

```bash
# Ver se vendor/ foi criado
ls -la vendor/ | head -5

# Se sim, sucesso! ✅
```

---

**Recomendo a Opção A primeiro (mais rápida). Se quiser simplificar depois, use a Opção B.**

