# 🔧 Correção: Erro 404 no Login

## 🚨 Problema

O erro `Failed to load resource: the server responded with a status of 404 () (login, line 0)` acontece porque:

1. A URL da API está incorreta ou undefined
2. O frontend está tentando chamar `/login` em vez de `/api/login`
3. A variável de ambiente não está sendo definida corretamente no build estático

---

## ✅ Correções Aplicadas

### 1. Criei arquivo de configuração centralizada

Criado `frontend/src/config/api.ts` que sempre retorna a URL correta.

### 2. Atualizado `useAuth.tsx`

Agora usa a URL correta: `https://clamatec.com/api/login`

### 3. Atualizado `api.ts`

Também usa a mesma configuração.

---

## 🔧 PRÓXIMO PASSO: Rebuild do Frontend

### No seu computador:

```bash
cd frontend

# Definir URL da API para produção
export NEXT_PUBLIC_API_URL=https://clamatec.com/api

# Fazer build
npm run build
```

### OU criar arquivo `.env.local`:

Crie `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://clamatec.com/api
```

Depois:
```bash
cd frontend
npm run build
```

---

## 📤 Upload

Depois do build, faça upload de **TODA** a pasta `frontend/out/` para `public_html/` no cPanel.

---

## 🧪 Depois do Upload

1. **Limpe o localStorage no navegador:**
   - Abra Console (F12)
   - Execute: `localStorage.clear()`
   - Recarregue a página

2. **Teste o login:**
   - Acesse: `https://clamatec.com/gestao/login`
   - Email: `admin@sitehmx.com`
   - Senha: `admin123`

---

## 🔍 Verificar URL da API no Navegador

Depois do upload, abra o Console (F12) e execute:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api')
```

Deve mostrar: `https://clamatec.com/api`

---

## ✅ O Que Foi Corrigido

- ✅ Criado arquivo de configuração centralizada (`config/api.ts`)
- ✅ `useAuth.tsx` agora usa URL fixa para produção
- ✅ `api.ts` também usa a mesma configuração
- ✅ Fallback garantido: sempre vai usar `https://clamatec.com/api` se não encontrar outra

**Faça o rebuild e me diga se funcionou!** 🎯

