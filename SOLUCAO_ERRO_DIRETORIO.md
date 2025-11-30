# 🔧 Solução: Erro "cannot access parent directories"

## ❌ Erro Encontrado

```
shell-init: error retrieving current directory: getcwd: cannot access parent directories: No such file or directory
```

Isso significa que o diretório atual não é mais acessível.

## ✅ Solução Rápida

Execute estes comandos na ordem:

```bash
# 1. Voltar para o diretório home
cd ~

# 2. Verificar se o diretório ainda existe
ls -la public_html/api/backend/ 2>/dev/null && echo "Diretório existe" || echo "Diretório não existe"

# 3. Verificar onde está o composer.json
find ~/public_html -name "composer.json" 2>/dev/null

# 4. Navegar para o diretório correto
cd ~/public_html/api/backend

# 5. OU se não existir, verificar estrutura
cd ~/public_html/api
ls -la
```

---

## 🔍 Verificar Estrutura Atual

```bash
# Ir para home
cd ~

# Ver estrutura de public_html/api
ls -la public_html/api/

# Ver se backend existe
ls -la public_html/api/backend/ 2>/dev/null || echo "Pasta backend não existe"

# Procurar composer.json
find public_html/api -name "composer.json" 2>/dev/null
```

---

## 🎯 Opção 1: Se o Diretório Foi Movido/Removido

### Verificar onde está o Laravel:

```bash
cd ~
find public_html -name "composer.json" -type f 2>/dev/null
```

Isso vai mostrar onde está o `composer.json`.

### Navegar para o local correto:

```bash
cd ~
cd $(dirname $(find public_html -name "composer.json" -type f 2>/dev/null | head -1))

# Agora você está no diretório do Laravel
pwd
ls -la composer.json
```

---

## 🎯 Opção 2: Reconstruir Estrutura

Se os arquivos foram movidos ou a estrutura está confusa:

```bash
# 1. Ir para home
cd ~

# 2. Ver tudo que está em api/
ls -la public_html/api/

# 3. Verificar se há arquivos do Laravel em api/ diretamente
cd public_html/api
ls -la

# Se ver: app/, config/, public/, composer.json → Laravel está aqui!
# Se não, verificar subpastas
```

---

## 🎯 Opção 3: Criar Diretório Novamente

Se o diretório foi deletado mas os arquivos ainda existem:

```bash
cd ~
cd public_html/api

# Ver o que tem aqui
ls -la

# Se os arquivos estão diretamente em api/, use aqui:
cd public_html/api
composer install --optimize-autoloader --no-dev --no-scripts
```

---

## ⚡ Comandos para Executar AGORA

Copie e cole estes comandos:

```bash
# 1. Ir para home primeiro
cd ~

# 2. Verificar estrutura
echo "=== Estrutura em api/ ==="
ls -la public_html/api/ 2>/dev/null || echo "Não existe"

echo ""
echo "=== Procurando composer.json ==="
find public_html -name "composer.json" -type f 2>/dev/null

echo ""
echo "=== Verificar backend/ ==="
ls -la public_html/api/backend/ 2>/dev/null || echo "Pasta backend não existe"
```

**Depois me diga o que apareceu!**

---

## 🚀 Depois de Encontrar o Diretório

Quando encontrar onde está o `composer.json`, execute:

```bash
# Navegar para o diretório
cd ~/caminho/para/o/laravel

# Verificar
pwd
ls -la composer.json

# Instalar dependências
composer install --optimize-autoloader --no-dev --no-scripts
composer dump-autoload --optimize
```

---

**Execute os comandos de verificação primeiro para descobrir onde está o Laravel!**

