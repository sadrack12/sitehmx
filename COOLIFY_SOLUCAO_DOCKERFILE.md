# ✅ Solução: Dockerfile não encontrado

## ❌ Erro

```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

O Coolify procura por um arquivo chamado `Dockerfile` mas só existia `Dockerfile.production`.

---

## ✅ Solução Aplicada

Criados arquivos `Dockerfile` (cópias de `Dockerfile.production`):
- ✅ `backend/Dockerfile`
- ✅ `frontend/Dockerfile`

Agora o Coolify pode usar o nome padrão `Dockerfile`.

---

## 📝 Configuração no Coolify

### Backend:
- **Dockerfile Context:** `backend`
- **Dockerfile Path:** `Dockerfile` (ou deixe em branco para usar padrão)

### Frontend:
- **Dockerfile Context:** `frontend`
- **Dockerfile Path:** `Dockerfile` (ou deixe em branco para usar padrão)

---

**Tente fazer deploy novamente! Deve funcionar agora.** 🚀

