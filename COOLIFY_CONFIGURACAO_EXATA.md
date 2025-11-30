# ⚠️ CONFIGURAÇÃO EXATA NO COOLIFY

## 🎯 Problema: Dockerfile não encontrado

O Coolify está procurando mas não encontra o Dockerfile. Isso geralmente é um problema de configuração.

---

## ✅ CONFIGURAÇÃO EXATA PARA BACKEND

No Coolify, ao criar/configurar a aplicação Backend:

### Campos Obrigatórios:

1. **Nome da Aplicação:** `sitehmx-backend`

2. **Tipo:** `Dockerfile` (ou "Docker" → "Dockerfile")

3. **Repositório Git:**
   - URL: `https://github.com/sadrack12/sitehmx.git`
   - Branch: `main`

4. **Build Settings / Docker Settings:**

   **Opção A (se o Coolify tem campos separados):**
   - **Build Context:** `backend`
   - **Dockerfile:** `Dockerfile` (ou `backend/Dockerfile`)

   **Opção B (se o Coolify pede um caminho completo):**
   - **Dockerfile Path:** `backend/Dockerfile`

   **Opção C (se o Coolify usa contexto raiz):**
   - **Build Context:** `.` (raiz)
   - **Dockerfile Path:** `backend/Dockerfile`

5. **Porta:** `8000`

---

## ✅ CONFIGURAÇÃO EXATA PARA FRONTEND

No Coolify, ao criar/configurar a aplicação Frontend:

### Campos Obrigatórios:

1. **Nome da Aplicação:** `sitehmx-frontend`

2. **Tipo:** `Dockerfile`

3. **Repositório Git:**
   - URL: `https://github.com/sadrack12/sitehmx.git`
   - Branch: `main`

4. **Build Settings / Docker Settings:**

   **Opção A:**
   - **Build Context:** `frontend`
   - **Dockerfile:** `Dockerfile`

   **Opção B:**
   - **Dockerfile Path:** `frontend/Dockerfile`

   **Opção C:**
   - **Build Context:** `.`
   - **Dockerfile Path:** `frontend/Dockerfile`

5. **Porta:** `80`

---

## 🔍 Como Encontrar as Configurações no Coolify

1. Vá na sua aplicação (Backend ou Frontend)
2. Procure por uma dessas seções:
   - **Settings** → **Docker**
   - **Configuration** → **Build**
   - **Build Settings**
   - **Dockerfile Settings**

3. Procure por campos como:
   - `Dockerfile Context`
   - `Build Context`
   - `Dockerfile Path`
   - `Dockerfile Location`
   - `Dockerfile`

---

## ⚠️ IMPORTANTE

O erro `open Dockerfile: no such file or directory` significa que o Coolify está procurando o arquivo no caminho errado.

**A configuração correta depende de como o Coolify interpreta o Context:**

- Se Context = `backend` → Dockerfile deve ser apenas `Dockerfile`
- Se Context = `.` (raiz) → Dockerfile deve ser `backend/Dockerfile`

---

## 🧪 Teste Rápido

1. Verifique nos logs do build qual caminho o Coolify está tentando usar
2. Ajuste a configuração baseado no que ver no log

---

**Configure no Coolify e tente novamente!** 🚀

