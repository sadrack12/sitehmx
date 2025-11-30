# 🔧 Corrigir IP da API no Docker

## ✅ Problema Resolvido

### Erro: `ERR_CONNECTION_REFUSED` em `172.20.10.8`

**Causa:** 
- Fallbacks hardcoded para `https://clamatec.com/api` 
- Next.js não estava lendo `.env.local` corretamente
- `next.config.js` tinha fallback de produção

**Solução:**
1. ✅ Atualizado `next.config.js` - fallback para `http://localhost:8001/api`
2. ✅ Atualizado `consulta-online/page.tsx` - todos os fallbacks corrigidos
3. ✅ `.env.local` já estava correto: `NEXT_PUBLIC_API_URL=http://localhost:8001/api`

---

## 🔄 Reiniciar Frontend

O frontend foi reiniciado automaticamente. Se ainda não funcionar:

```bash
docker-compose restart frontend
```

OU recarregue a página no navegador (Ctrl+R ou Cmd+R)

---

## ✅ Verificar

1. Abrir: `http://localhost:3000/consulta-online`
2. Digitar um NIF
3. Clicar em "Buscar Consultas"
4. Deve funcionar agora!

---

## 📝 Arquivos Modificados

- `frontend/next.config.js` - fallback atualizado
- `frontend/src/app/consulta-online/page.tsx` - fallbacks corrigidos

---

**Problema corrigido!** ✅

