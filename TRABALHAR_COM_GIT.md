# 🔧 Trabalhar com Git

## ✅ Vantagens de Usar Git

1. **Controle de Versão:** Todas as mudanças ficam registradas
2. **Facilita Deploy:** Pode fazer pull direto no servidor
3. **Backup:** Código seguro no repositório
4. **Colaboração:** Fácil trabalhar em equipe

---

## 🚀 Configuração Inicial (Se Não Tiver Git)

### 1. Inicializar Repositório:

```bash
cd /Users/sadraquemassala/sitehmx
git init
```

### 2. Adicionar Arquivos:

```bash
git add .
git commit -m "Initial commit"
```

### 3. Adicionar Remote (GitHub/GitLab):

```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

---

## 📋 Comandos Úteis

### Ver Status:

```bash
git status
```

### Ver Mudanças:

```bash
git diff
```

### Adicionar Mudanças:

```bash
git add .
# ou arquivo específico:
git add frontend/src/app/consulta-online/page.tsx
```

### Fazer Commit:

```bash
git commit -m "Corrigir rotas API - remover /public/"
```

### Fazer Push:

```bash
git push origin main
```

---

## 🔄 Workflow Recomendado

### 1. Fazer Mudanças Localmente

### 2. Verificar Mudanças:

```bash
git status
git diff
```

### 3. Adicionar e Commitar:

```bash
git add .
git commit -m "Descrição das mudanças"
```

### 4. Fazer Push:

```bash
git push origin main
```

### 5. No Servidor, Fazer Pull:

```bash
cd ~/public_html/api
git pull origin main
```

---

## ⚠️ Arquivos para .gitignore

**Certifique-se de que `.gitignore` inclui:**

```
# Dependencies
node_modules/
vendor/

# Build
.next/
out/
dist/

# Environment
.env
.env.local
.env.production

# Logs
*.log
storage/logs/*

# Cache
bootstrap/cache/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
```

---

## 🚀 Deploy no Servidor via Git

### Opção 1: Pull Direto no Servidor

**No servidor (SSH):**

```bash
cd ~/public_html/api
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan route:clear
php artisan config:clear
php artisan route:cache
```

### Opção 2: CI/CD (GitHub Actions)

**Criar `.github/workflows/deploy.yml`:**

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ~/public_html/api
            git pull origin main
            composer install --no-dev --optimize-autoloader
            php artisan route:clear
            php artisan config:clear
            php artisan route:cache
```

---

## ✅ Vantagens para Este Projeto

1. **Fácil Deploy:** `git pull` no servidor
2. **Histórico:** Ver todas as correções feitas
3. **Rollback:** Voltar versão anterior se necessário
4. **Backup:** Código seguro no repositório

---

**Vamos configurar Git agora?** 🚀

