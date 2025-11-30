# ✅ Correção: Erro 404 no Login

## 🚨 Problema Identificado

O erro `404 (login, line 0)` significa que o frontend está tentando chamar uma URL que não existe.

**Causa:** A variável de ambiente `NEXT_PUBLIC_API_URL` pode estar `undefined` no build estático.

---

## ✅ Correções Aplicadas

1. ✅ Criado arquivo `frontend/src/config/api.ts` com URL fixa para produção
2. ✅ Atualizado `useAuth.tsx` para usar a URL correta
3. ✅ Atualizado `api.ts` para usar a mesma configuração

**A URL agora é SEMPRE:** `https://clamatec.com/api`

---

## 🔧 REBUILD NECESSÁRIO

Você precisa fazer um **novo build** do frontend para aplicar as correções:

### Passo 1: Definir Variável de Ambiente

```bash
cd frontend
export NEXT_PUBLIC_API_URL=https://clamatec.com/api
npm run build
```

### Passo 2: Upload

Faça upload de **TODA** a pasta `frontend/out/` para `public_html/` no cPanel.

---

## 🧪 Teste Rápido no Console

Depois do upload, abra o Console (F12) na página de login e execute:

```javascript
fetch('https://clamatec.com/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@sitehmx.com', password: 'admin123' })
})
.then(r => r.json())
.then(d => console.log('✅ Login funciona!', d))
.catch(e => console.error('❌ Erro:', e))
```

Se aparecer erro de credenciais, significa que a API está funcionando! ✅

---

## 📋 Checklist

- [ ] Fiz rebuild do frontend com `NEXT_PUBLIC_API_URL=https://clamatec.com/api`
- [ ] Fiz upload de TODA a pasta `out/` para cPanel
- [ ] Limpei o localStorage no navegador (`localStorage.clear()`)
- [ ] Testei o login

**Faça o rebuild AGORA e me diga o resultado!** 🚀

