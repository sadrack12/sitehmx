# ✅ Solução Definitiva: Erro 404 no Login

## 🚨 Diagnóstico

O erro `404 (login, line 0)` significa que a requisição está sendo feita para uma URL que não existe.

**URL esperada:** `https://clamatec.com/api/login`
**Problema:** O código pode estar chamando apenas `/login` ou a URL está undefined.

---

## ✅ Correções Aplicadas

1. ✅ Criado arquivo `frontend/src/config/api.ts` com URL fixa
2. ✅ Atualizado `useAuth.tsx` para usar `API_URL` do config
3. ✅ URL padrão hardcoded: `https://clamatec.com/api`

---

## 🔧 REBUILD OBRIGATÓRIO

Você **DEVE** fazer um novo build para aplicar as correções:

```bash
cd frontend

# Opção 1: Definir variável de ambiente
export NEXT_PUBLIC_API_URL=https://clamatec.com/api
npm run build

# Opção 2: Criar .env.local (recomendado)
echo "NEXT_PUBLIC_API_URL=https://clamatec.com/api" > .env.local
npm run build
```

---

## 📤 Upload para cPanel

1. **Faça upload de TODA a pasta `frontend/out/` para `public_html/`**
2. **Sobrescreva os arquivos existentes**

---

## 🧪 Verificar se Funcionou

### 1. Limpar localStorage

No navegador, Console (F12):
```javascript
localStorage.clear()
location.reload()
```

### 2. Testar API diretamente

No Console:
```javascript
fetch('https://clamatec.com/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@sitehmx.com', password: 'admin123' })
})
.then(r => r.json())
.then(d => console.log('✅ API funciona!', d))
.catch(e => console.error('❌ Erro:', e))
```

Se retornar erro de "credenciais incorretas", significa que a API está funcionando! ✅

### 3. Testar Login

1. Acesse: `https://clamatec.com/gestao/login`
2. Email: `admin@sitehmx.com`
3. Senha: `admin123`

---

## 🔍 Se Ainda Não Funcionar

Me envie:

1. **O que aparece no Console do navegador** (F12 → Console)
2. **O que aparece na aba Network** (F12 → Network → tente fazer login → veja a requisição)
   - Qual é a URL exata que está sendo chamada?
   - Qual é o status code?
   - Qual é a resposta?

3. **Resultado do teste da API acima**

Com essas informações, posso corrigir precisamente! 🎯

---

## ✅ Arquivos Corrigidos

- ✅ `frontend/src/config/api.ts` (novo arquivo)
- ✅ `frontend/src/hooks/useAuth.tsx` (atualizado)
- ✅ `frontend/src/utils/api.ts` (atualizado)

**FAÇA O REBUILD AGORA!** 🚀
