# 🔧 Solução: Erro "Class not found" ao Instalar Composer

## ❌ Erro Encontrado

```
Class "NunoMaduro\Collision\Adapters\Laravel\CollisionServiceProvider" not found
Script @php artisan package:discover --ansi handling the post-autoload-dump event returned with error code 1
```

## ✅ Solução

Este erro acontece porque o Composer tenta executar scripts do Laravel antes que todas as dependências estejam instaladas.

### Solução 1: Instalar Sem Scripts (Recomendado)

Execute o Composer **sem executar os scripts** primeiro:

```bash
cd ~/public_html/api/backend  # ou ~/public_html/api se não tiver subpasta backend

# Limpar cache do Composer
composer clear-cache

# Instalar sem executar scripts
composer install --optimize-autoloader --no-dev --no-scripts

# Depois executar os scripts manualmente
composer dump-autoload --optimize

# Se ainda der erro, pule os scripts do Laravel por enquanto
```

### Solução 2: Instalar Passo a Passo

```bash
cd ~/public_html/api/backend  # ou ~/public_html/api

# 1. Limpar tudo primeiro
rm -rf vendor/ composer.lock  # Se já tentou instalar antes

# 2. Instalar apenas dependências (sem scripts)
composer install --no-scripts --no-dev

# 3. Gerar autoloader
composer dump-autoload --optimize

# 4. Agora tentar executar os scripts (pode pular se der erro)
php artisan package:discover --ansi || echo "Scripts ignorados"
```

### Solução 3: Verificar Estrutura de Pastas

**⚠️ IMPORTANTE:** Verifique se você está no diretório correto!

O erro mostra que você está em `~/public_html/api/backend`. 

**Verifique a estrutura:**

```bash
# Ver onde você está
pwd

# Ver estrutura
ls -la

# Se você está em ~/public_html/api/backend, mas deveria estar em ~/public_html/api/
# Então o Laravel está em uma subpasta extra!
```

**Se o Laravel está em `public_html/api/backend/`:**

```bash
cd ~/public_html/api/backend
composer install --optimize-autoloader --no-dev --no-scripts
composer dump-autoload --optimize
```

**Se o Laravel está diretamente em `public_html/api/`:**

```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev --no-scripts
composer dump-autoload --optimize
```

### Solução 4: Ignorar Scripts Completamente

Se os scripts continuarem dando erro, você pode ignorá-los:

```bash
cd ~/public_html/api/backend  # ou ~/public_html/api

# Instalar sem scripts
composer install --optimize-autoloader --no-dev --no-scripts

# Gerar autoloader
composer dump-autoload --optimize

# Os scripts do Laravel não são críticos para funcionamento básico
# Você pode executar manualmente depois se necessário
```

---

## 🔍 Verificar o Problema

### 1. Verificar Estrutura

```bash
cd ~/public_html/api

# Ver se composer.json existe
ls -la composer.json

# Ver estrutura de pastas
ls -la
```

### 2. Verificar se Composer está Funcionando

```bash
composer --version
composer diagnose
```

### 3. Verificar PHP

```bash
php -v
php -m | grep -i pdo
php -m | grep -i mbstring
```

---

## 🎯 Solução Completa Passo a Passo

Execute estes comandos na ordem:

```bash
# 1. Navegar para o diretório correto
cd ~/public_html/api/backend  # Se Laravel está em subpasta
# OU
cd ~/public_html/api  # Se Laravel está diretamente aqui

# 2. Limpar cache
composer clear-cache

# 3. Remover vendor se existir (para começar limpo)
rm -rf vendor/

# 4. Instalar sem scripts
composer install --optimize-autoloader --no-dev --no-scripts

# 5. Gerar autoloader
composer dump-autoload --optimize

# 6. Verificar se funcionou
ls -la vendor/ | head -10
```

**Se funcionou, continue:**

```bash
# 7. Criar .env se não existir
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || touch .env
fi

# 8. Configurar APP_KEY
php artisan key:generate

# 9. Agora tentar executar migrações
php artisan migrate --force
```

---

## ⚠️ Se Ainda Der Erro

### Verificar Permissões

```bash
chmod -R 755 .
chmod -R 775 storage bootstrap/cache
```

### Verificar Espaço em Disco

```bash
df -h
```

### Verificar Logs

```bash
tail -50 storage/logs/laravel.log
```

### Reinstalar Composer Localmente

Se o Composer global não funcionar:

```bash
cd ~/public_html/api/backend  # ou ~/public_html/api

# Baixar Composer local
curl -sS https://getcomposer.org/installer | php

# Usar versão local
php composer.phar install --optimize-autoloader --no-dev --no-scripts
php composer.phar dump-autoload --optimize
```

---

## 📋 Checklist

- [ ] Estou no diretório correto (onde está composer.json)
- [ ] Composer está instalado e funcionando
- [ ] PHP 8.1+ está instalado
- [ ] Extensões PHP necessárias estão instaladas (pdo_mysql, mbstring, etc)
- [ ] Executei `composer install` com `--no-scripts` primeiro
- [ ] Executei `composer dump-autoload` depois
- [ ] Verifiquei se vendor/ foi criado

---

## 💡 Dica Final

**O mais importante:** Use `--no-scripts` na primeira instalação, depois gere o autoloader manualmente. Os scripts do Laravel não são críticos para o funcionamento básico da API.

---

## 🆘 Se Nada Funcionar

1. **Verifique a estrutura de pastas** - pode estar em lugar errado
2. **Use Composer local** ao invés do global
3. **Contate o suporte da hospedagem** - pode ser limitação do servidor
4. **Considere fazer upload do vendor/** já instalado localmente (menos ideal, mas funciona)

---

**Execute a Solução 1 primeiro - geralmente resolve!** ✅

