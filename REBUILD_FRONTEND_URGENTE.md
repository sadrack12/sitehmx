# 🚨 REBUILD FRONTEND URGENTE

## ⚠️ Problema

**Erro 404:** `GET https://clamatec.com/api/exames`

**Causa:** O frontend no servidor ainda está usando a rota antiga `/api/exames` em vez de `/api/admin/exames`.

---

## ✅ CORREÇÕES JÁ FEITAS LOCALMENTE

**Arquivos corrigidos:**

1. ✅ `frontend/src/components/gestao/atendimento/DailyVideoModal.tsx`
   - ❌ Antes: `/api/exames`
   - ✅ Agora: `/api/admin/exames`

2. ✅ `frontend/src/app/gestao/relatorios/page.tsx`
   - ❌ Antes: `/api/exames`
   - ✅ Agora: `/api/admin/exames`

---

## 🚀 AÇÃO NECESSÁRIA: REBUILD COMPLETO

### No seu computador local:

```bash
cd frontend
npm run build
```

**Isso vai:**
- Compilar todo o código TypeScript/React
- Gerar os arquivos JavaScript corretos
- Criar a pasta `out/` com os arquivos estáticos atualizados

### Depois, faça upload:

**Faça upload de TODA a pasta `frontend/out/` para `public_html/` no cPanel.**

**Substitua todos os arquivos existentes!**

---

## ⚠️ IMPORTANTE

**NÃO adicione apenas os arquivos novos!**

**Você DEVE:**
1. ✅ Fazer rebuild completo (`npm run build`)
2. ✅ Fazer upload de TODA a pasta `out/`
3. ✅ Substituir todos os arquivos existentes

**Por quê?**
- Os arquivos JavaScript antigos ainda estão no servidor
- Eles contêm a rota errada `/api/exames`
- Só um rebuild completo vai gerar os arquivos corretos

---

## ✅ Verificar Após Upload

**Teste:**

1. **Acesse:** `https://clamatec.com/gestao/relatorios`
2. **Abra o Console (F12)**
3. **Não deve mais aparecer erro 404 em `/api/exames`**

---

## 🔍 Se Ainda Aparecer Erro

**Limpe o cache do navegador:**
- F12 → Application → Clear site data
- Marque TODAS as opções
- Clique em "Clear"

**OU teste em modo anônimo**

---

**FAÇA REBUILD COMPLETO DO FRONTEND AGORA!** 🚀

