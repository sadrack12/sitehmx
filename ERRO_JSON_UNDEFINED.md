# ✅ Correção: Erro "undefined" is not valid JSON

## 🚨 Problema

O erro `SyntaxError: "undefined" is not valid JSON` acontecia porque:

1. O `localStorage` tinha a string `"undefined"` salva
2. O código tentava fazer `JSON.parse("undefined")` que falha

## ✅ Correções Aplicadas

### 1. Validação no `useAuth.tsx`

Adicionei verificação antes de fazer parse:
- Verifica se o valor não é `"undefined"` ou `"null"`
- Usa `try/catch` para capturar erros
- Limpa o localStorage se houver dados inválidos

### 2. Variável de Ambiente

Atualizado `next.config.js` para garantir que `NEXT_PUBLIC_API_URL` sempre tenha um valor padrão para produção:
- Produção: `https://clamatec.com/api`
- Desenvolvimento: valor do `.env.local`

### 3. Fallbacks no Código

Adicionei fallbacks em todos os lugares que usam `process.env.NEXT_PUBLIC_API_URL`:
- `useAuth.tsx` - login e logout
- `api.ts` - funções da API

---

## 🔧 Próximo Passo: Fazer Novo Build

Para aplicar as correções:

### 1. Limpar localStorage no Navegador

No navegador, abra o Console (F12) e execute:
```javascript
localStorage.clear()
```

Ou manualmente:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
```

### 2. Fazer Novo Build do Frontend

```bash
cd frontend

# Definir a URL da API para produção
export NEXT_PUBLIC_API_URL=https://clamatec.com/api

# Fazer build
npm run build
```

### 3. Upload dos Novos Arquivos

Faça upload de **TODA** a pasta `frontend/out/` para `public_html/` no cPanel.

---

## 🧪 Testar

Após o upload:

1. **Limpe o cache do navegador** (Ctrl+Shift+R)
2. **Acesse:** `https://clamatec.com/gestao/login`
3. **Faça login** com:
   - Email: `admin@sitehmx.com`
   - Senha: `admin123`

---

## 🔍 Se Ainda Não Funcionar

1. **Limpe o localStorage manualmente:**
   - Abra o Console (F12)
   - Execute: `localStorage.clear()`
   - Recarregue a página

2. **Verifique se a API está funcionando:**
   ```bash
   curl https://clamatec.com/api/login -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@sitehmx.com","password":"admin123"}'
   ```

3. **Me envie:**
   - O que aparece no console do navegador
   - O resultado do teste da API acima

---

## ✅ Arquivos Corrigidos

- ✅ `frontend/src/hooks/useAuth.tsx` - Validação do localStorage
- ✅ `frontend/next.config.js` - Variável de ambiente padrão
- ✅ `frontend/src/utils/api.ts` - Fallback para API URL

**Faça um novo build e me diga se funcionou!** 🎯

