# 🔧 Troubleshooting - Erro Dockerfile no Coolify

## ❌ Erro Comum

```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

---

## 🔍 Possíveis Causas e Soluções

### 1. Dockerfile Context Incorreto

**Sintoma:** Coolify não encontra o Dockerfile

**Solução:**

No Coolify, verifique a configuração:

#### Backend:
- **Dockerfile Context:** Deve ser `backend` (o diretório)
- **Dockerfile Path/Name:** Deve ser apenas `Dockerfile` (sem `backend/`)

**Teste:**
- Context: `backend`
- Path: `Dockerfile`
- Coolify procura: `backend/Dockerfile` ✅

#### Frontend:
- **Dockerfile Context:** Deve ser `frontend`
- **Dockerfile Path/Name:** Deve ser apenas `Dockerfile`

---

### 2. Dockerfile Path com Caminho Completo

Se o Coolify pedir um caminho completo, tente:

#### Backend:
- **Dockerfile Path:** `backend/Dockerfile`

#### Frontend:
- **Dockerfile Path:** `frontend/Dockerfile`

---

### 3. Context Vazio ou Raiz

Se o Context estiver vazio ou como `.`, então:

#### Backend:
- **Dockerfile Path:** `backend/Dockerfile`

#### Frontend:
- **Dockerfile Path:** `frontend/Dockerfile`

---

## ✅ Checklist de Verificação

- [ ] Arquivos `backend/Dockerfile` e `frontend/Dockerfile` existem no Git
- [ ] Dockerfile Context está configurado corretamente no Coolify
- [ ] Dockerfile Path está configurado corretamente no Coolify
- [ ] Repositório está correto: `https://github.com/sadrack12/sitehmx.git`
- [ ] Branch está correto: `main`

---

## 🔄 Teste Rápido

1. Vá no Coolify → Sua Aplicação → Settings
2. Procure seção "Docker" ou "Build"
3. Verifique:
   - **Context** = `backend` (para backend) ou `frontend` (para frontend)
   - **Dockerfile** = `Dockerfile`
4. Salve e tente deploy novamente

---

## 📸 Onde Encontrar no Coolify

Dependendo da versão do Coolify, as configurações podem estar em:

1. **Settings** → **Docker** → **Dockerfile**
2. **Configuration** → **Build Settings**
3. **Docker** → **Build Context**

Procure por:
- `Dockerfile Context`
- `Dockerfile Path`
- `Build Context`
- `Dockerfile Location`

---

**Se ainda não funcionar, verifique os logs do build no Coolify para ver o caminho exato que está sendo procurado.**

