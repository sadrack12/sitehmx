# 🛠️ Scripts de Deploy para cPanel

Scripts auxiliares para facilitar o processo de deploy no cPanel.

## 📋 Scripts Disponíveis

### 1. `prepare-backend.sh`

Prepara o backend (Laravel) para deploy, instalando dependências e configurando o ambiente.

**Uso:**
```bash
./scripts/prepare-backend.sh
```

**O que faz:**
- Instala dependências de produção com Composer
- Cria `.env` se não existir
- Gera `APP_KEY` se necessário
- Limpa caches antigos

**Nota:** Não faz upload. Você precisa fazer upload manualmente depois.

---

### 2. `prepare-frontend.sh`

Prepara o frontend (Next.js) para deploy, oferecendo duas opções.

**Uso:**
```bash
# Build estático (mais simples, não precisa Node.js no servidor)
./scripts/prepare-frontend.sh static

# Com Node.js (mais flexível, precisa Node.js no servidor)
./scripts/prepare-frontend.sh nodejs
```

**O que faz:**
- Instala dependências
- Cria `.env.local` com URL da API
- Faz build do Next.js
- Orienta sobre próximos passos

---

### 3. `create-htaccess.sh`

Cria o arquivo `.htaccess` necessário para o Laravel funcionar no cPanel.

**Uso:**
```bash
./scripts/create-htaccess.sh
```

**O que faz:**
- Cria arquivo `.htaccess` em `backend/public/.htaccess`
- Configura rewrite rules para Laravel

---

## 🔧 Pré-requisitos

Antes de usar os scripts, certifique-se de ter:

- **Backend:**
  - PHP 8.1+ instalado
  - Composer instalado

- **Frontend:**
  - Node.js 18+ instalado
  - npm instalado

- **Sistema:**
  - Bash shell (Linux, macOS, ou Git Bash no Windows)

---

## 📝 Exemplo de Uso Completo

### Preparar Backend:
```bash
cd /caminho/para/sitehmx
./scripts/prepare-backend.sh
```

### Preparar Frontend (estático):
```bash
./scripts/prepare-frontend.sh static
# Quando solicitado, digite a URL da API: https://seudominio.com/api
```

### Criar .htaccess:
```bash
./scripts/create-htaccess.sh
```

---

## ⚠️ Importante

1. **Não faça upload do `.env`** para o servidor
   - O `.env` deve ser criado manualmente no servidor com as configurações de produção

2. **Backup sempre**
   - Faça backup antes de qualquer deploy

3. **Teste localmente**
   - Teste o build localmente antes de fazer upload

---

## 🆘 Problemas?

Se os scripts não funcionarem:

1. Verifique se têm permissão de execução:
   ```bash
   chmod +x scripts/*.sh
   ```

2. Verifique se está na raiz do projeto

3. Execute manualmente os comandos que o script tenta executar

---

## 📚 Documentação Relacionada

- [DEPLOY_CPANEL.md](../DEPLOY_CPANEL.md) - Guia completo de deploy
- [DEPLOY_CHECKLIST.md](../DEPLOY_CHECKLIST.md) - Checklist de deploy

