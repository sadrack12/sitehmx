# 🔧 Corrigir Rota /api/exames

## ⚠️ Problema

**Erro 404:** `GET https://clamatec.com/api/exames`

**Causa:** A rota `/api/exames` não existe. A rota correta é `/api/admin/exames` (requer autenticação).

---

## ✅ SOLUÇÃO APLICADA

**Arquivos corrigidos localmente:**

1. ✅ `frontend/src/components/gestao/atendimento/DailyVideoModal.tsx`
   - ❌ Antes: `/api/exames`
   - ✅ Agora: `/api/admin/exames`

2. ✅ `frontend/src/app/gestao/relatorios/page.tsx`
   - ❌ Antes: `/api/exames`
   - ✅ Agora: `/api/admin/exames`

---

## 🚀 APLICAR NO SERVIDOR

### Opção 1: Rebuild Completo do Frontend

**No seu computador local:**

```bash
cd frontend
npm run build
```

**Depois, faça upload de toda a pasta `frontend/out/` para `public_html/` no cPanel.**

### Opção 2: Upload Apenas dos Arquivos Corrigidos

**Faça upload de:**

1. `frontend/out/_next/static/chunks/app/gestao/relatorios/page-*.js`
2. `frontend/out/_next/static/chunks/app/gestao/atendimento/DailyVideoModal-*.js`

**OU melhor: Rebuild completo para garantir que tudo está atualizado!**

---

## ✅ Verificar

**Após aplicar, teste:**

1. **Acesse:** `https://clamatec.com/gestao/relatorios`
2. **Não deve mais aparecer erro 404 em `/api/exames`**

---

**Faça rebuild do frontend e faça upload!** 🚀

