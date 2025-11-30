# 📋 Scripts Disponíveis

## 🚀 Scripts de Deploy

### `deploy-backend.sh`
**Deploy do backend no servidor via Git**

```bash
./scripts/deploy-backend.sh
```

Mostra instruções para fazer deploy do backend no servidor.

---

### `deploy-frontend.sh`
**Build e preparar frontend para deploy**

```bash
./scripts/deploy-frontend.sh
```

- Limpa builds antigos
- Faz build do Next.js
- Prepara para upload

---

### `deploy-completo.sh`
**Deploy completo (backend + frontend)**

```bash
./scripts/deploy-completo.sh
```

- Faz build do frontend
- Mostra instruções para deploy completo

---

## 🔧 Scripts de Git

### `git-commit.sh`
**Commit e push rápido**

```bash
./scripts/git-commit.sh "mensagem do commit"
```

Exemplo:
```bash
./scripts/git-commit.sh "Corrigir rotas API"
```

---

## 🔍 Scripts de Verificação

### `verificar-rotas.sh`
**Verificar rotas no código**

```bash
./scripts/verificar-rotas.sh
```

Verifica:
- Rotas com `/public/` no backend
- Duplicação `/api/api/` no frontend
- Rotas `/api/exames` incorretas

---

### `status-projeto.sh`
**Status geral do projeto**

```bash
./scripts/status-projeto.sh
```

Mostra:
- Status do Git
- Status do backend
- Status do frontend

---

## 🧹 Scripts de Limpeza

### `limpar-cache.sh`
**Limpar cache do Laravel**

```bash
./scripts/limpar-cache.sh
```

Mostra instruções para limpar cache no servidor.

---

## 📝 Exemplos de Uso

### Workflow Completo:

```bash
# 1. Verificar status
./scripts/status-projeto.sh

# 2. Verificar rotas
./scripts/verificar-rotas.sh

# 3. Fazer build do frontend
./scripts/deploy-frontend.sh

# 4. Fazer commit
./scripts/git-commit.sh "Atualizar build do frontend"

# 5. Deploy no servidor (seguir instruções)
./scripts/deploy-backend.sh
```

---

**Todos os scripts estão prontos para uso!** 🚀
