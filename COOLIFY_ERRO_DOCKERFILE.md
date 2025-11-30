# 🔧 Corrigir Erro: Dockerfile não encontrado

## ❌ Erro Encontrado

```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

O Coolify está procurando por um arquivo chamado `Dockerfile`, mas o arquivo se chama `Dockerfile.production`.

---

## ✅ SOLUÇÃO

### No Coolify, você precisa configurar:

#### Backend:

1. Vá nas configurações da aplicação Backend
2. Procure por **"Dockerfile"** ou **"Dockerfile Path"**
3. Configure:
   - **Dockerfile Context:** `backend`
   - **Dockerfile Path:** `Dockerfile.production` ⚠️ (nome completo do arquivo)

#### Frontend:

1. Vá nas configurações da aplicação Frontend
2. Procure por **"Dockerfile"** ou **"Dockerfile Path"**
3. Configure:
   - **Dockerfile Context:** `frontend`
   - **Dockerfile Path:** `Dockerfile.production` ⚠️ (nome completo do arquivo)

---

## 🔄 Alternativa: Criar Dockerfile padrão

Se o Coolify não aceitar `Dockerfile.production`, podemos criar links simbólicos ou copiar os arquivos.

**Mas primeiro, tente configurar o caminho completo como descrito acima!**

---

## 📝 Resumo da Configuração Correta

### Backend:
```
Context: backend
Dockerfile: Dockerfile.production
```

### Frontend:
```
Context: frontend
Dockerfile: Dockerfile.production
```

---

**Configure no Coolify e tente novamente!** 🚀

