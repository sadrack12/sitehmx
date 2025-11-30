# 📋 Comandos Git para Este Projeto

## ✅ Git Inicializado!

O repositório Git foi criado. Agora você pode:

---

## 🚀 Comandos Básicos

### 1. Ver Status das Mudanças:

```bash
git status
```

### 2. Adicionar Todas as Mudanças:

```bash
git add .
```

### 3. Fazer Commit:

```bash
git commit -m "Corrigir rotas API - remover /public/ e duplicação /api/api/"
```

### 4. Ver Histórico:

```bash
git log --oneline
```

---

## 🔄 Workflow Recomendado

### Passo 1: Verificar Mudanças

```bash
git status
```

### Passo 2: Adicionar Mudanças

```bash
git add .
```

### Passo 3: Fazer Commit

```bash
git commit -m "Descrição clara das mudanças"
```

**Exemplos de mensagens:**
- `"Corrigir rotas API - remover /public/"`
- `"Corrigir duplicação /api/api/ no frontend"`
- `"Atualizar AppServiceProvider para remover prefixo duplicado"`
- `"Corrigir URLs de documentos no PublicController"`

### Passo 4: Verificar Commit

```bash
git log --oneline -5
```

---

## 🌐 Conectar com GitHub/GitLab

### 1. Criar Repositório no GitHub/GitLab

### 2. Adicionar Remote:

```bash
git remote add origin https://github.com/seu-usuario/sitehmx.git
```

### 3. Fazer Push:

```bash
git branch -M main
git push -u origin main
```

---

## 📦 Deploy no Servidor via Git

### Opção 1: Pull Direto (Recomendado)

**No servidor (SSH):**

```bash
# Backend
cd ~/public_html/api
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan route:clear
php artisan config:clear
php artisan route:cache

# Frontend (se tiver Node.js no servidor)
cd ~/public_html
git pull origin main
cd frontend
npm run build
# Copiar out/ para public_html/
```

### Opção 2: Clone no Servidor

**Primeira vez:**

```bash
cd ~
git clone https://github.com/seu-usuario/sitehmx.git sitehmx-temp
cd sitehmx-temp/backend
# Copiar arquivos para public_html/api
cd ../frontend
npm run build
# Copiar out/ para public_html/
```

**Atualizações:**

```bash
cd ~/sitehmx-temp
git pull origin main
# Copiar arquivos atualizados
```

---

## ✅ Vantagens

1. **Histórico Completo:** Todas as correções registradas
2. **Fácil Deploy:** `git pull` no servidor
3. **Rollback:** Voltar versão anterior se necessário
4. **Backup:** Código seguro no repositório
5. **Colaboração:** Fácil trabalhar em equipe

---

## 📝 Próximos Passos

1. **Fazer commit das correções atuais:**
   ```bash
   git add .
   git commit -m "Corrigir todas as rotas API e URLs"
   ```

2. **Criar repositório no GitHub/GitLab**

3. **Fazer push:**
   ```bash
   git remote add origin [URL_DO_REPOSITORIO]
   git push -u origin main
   ```

4. **Configurar deploy no servidor**

---

**Vamos fazer o primeiro commit agora?** 🚀

