# ⚠️ IMPORTANTE: Configuração do Dockerfile no Coolify

## ❌ Erro Atual

```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

O Coolify está procurando o Dockerfile mas não encontra.

---

## ✅ SOLUÇÃO DEFINITIVA

### Opção 1: Configurar Dockerfile Context e Path Corretamente

No Coolify, **CONFIGURE EXATAMENTE ASSIM:**

#### Backend:

1. Vá em **Settings** ou **Configuration** da aplicação Backend
2. Procure por **"Dockerfile"** ou **"Build Settings"**
3. Configure:
   - **Build Pack:** Dockerfile
   - **Dockerfile Location:** 
     - **Context:** `backend` (diretório onde está o Dockerfile)
     - **Dockerfile:** `Dockerfile` (nome do arquivo)

**OU se o Coolify pedir um caminho completo:**
- **Dockerfile Path:** `backend/Dockerfile`

#### Frontend:

1. Vá em **Settings** ou **Configuration** da aplicação Frontend
2. Procure por **"Dockerfile"** ou **"Build Settings"**
3. Configure:
   - **Build Pack:** Dockerfile
   - **Dockerfile Location:**
     - **Context:** `frontend`
     - **Dockerfile:** `Dockerfile`

**OU se o Coolify pedir um caminho completo:**
- **Dockerfile Path:** `frontend/Dockerfile`

---

### Opção 2: Criar Dockerfile na Raiz (Alternativa)

Se o Coolify não aceitar a Opção 1, podemos criar Dockerfiles na raiz que fazem referência aos diretórios corretos.

---

## 🔍 Como Verificar no Coolify

1. Vá na aplicação (Backend ou Frontend)
2. Clique em **"Settings"** ou **"Configuration"**
3. Procure por:
   - **Dockerfile Context**
   - **Dockerfile Path**
   - **Build Context**
   - **Dockerfile Location**

Essas opções podem estar em seções diferentes dependendo da versão do Coolify.

---

## 📝 Captura de Tela Sugerida

Se possível, envie uma captura de tela das configurações de Dockerfile no Coolify para identificarmos o problema exato.

---

**Tente a Opção 1 primeiro e me avise o resultado!** 🚀

