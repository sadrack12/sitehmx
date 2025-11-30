# 🔧 Corrigir Duplicação /api/api/

## ⚠️ Problema

**URL duplicada:** `https://clamatec.com/api/api/consultas/2/requisicao-exames?nif=500000000`

**Causa:** O frontend está adicionando `API_URL` (que já contém `/api`) na frente de URLs que já começam com `/api/`.

---

## ✅ CORREÇÃO APLICADA

**Arquivo corrigido:** `frontend/src/app/consulta-online/page.tsx`

**Função `abrirDocumento` corrigida:**
- ✅ Agora verifica se a URL já começa com `/api/`
- ✅ Se sim, remove `/api` do `API_URL` antes de concatenar
- ✅ Evita duplicação: `/api/api/`

---

## 🚀 APLICAR NO SERVIDOR

### Rebuild do Frontend:

**No seu computador local:**

```bash
cd frontend
npm run build
```

**Depois, faça upload de toda a pasta `frontend/out/` para `public_html/` no cPanel.**

---

## ✅ Verificar

**Após rebuild e upload:**

1. **Acesse:** `https://clamatec.com/consulta-online`
2. **Digite um NIF e busque consultas**
3. **Clique em um documento**
4. **A URL deve ser:** `https://clamatec.com/api/consultas/2/requisicao-exames?nif=500000000`
5. **NÃO deve ser:** `https://clamatec.com/api/api/consultas/...`

---

**Faça rebuild do frontend e faça upload!** 🚀

