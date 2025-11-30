# ✅ Solução: Erro 404 em `/buscar`

## 🚨 Problema

O erro mostra que está tentando acessar uma rota `/buscar` que não existe.

**Causa:** O frontend ainda está usando código antigo ou o build não foi atualizado.

---

## ✅ CORREÇÃO

O código já foi corrigido localmente. A URL correta é:
- ✅ `/api/consulta-online/buscar` (POST)

---

## 🔧 AÇÃO NECESSÁRIA: REBUILD COMPLETO

### Passo 1: Rebuild do Frontend

```bash
cd frontend
npm run build
```

### Passo 2: Limpar Cache Local

Antes do upload, delete a pasta `out/` antiga (se houver):

```bash
cd frontend
rm -rf out
npm run build
```

### Passo 3: Upload Completo

Faça upload de **TODA** a pasta `frontend/out/` para `public_html/` no cPanel, **substituindo tudo**.

### Passo 4: Limpar Cache do Navegador

No navegador:
- **Pressione:** `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
- **OU:** Vá em DevTools (F12) → Network → Marque "Disable cache"
- **OU:** Limpe o cache manualmente

---

## 🧪 Verificar

Depois do rebuild e upload:

1. **Limpe o cache do navegador** (muito importante!)
2. **Acesse a página de consulta online**
3. **Tente buscar consultas**
4. **Abra o Console (F12) → Network**
5. **Veja a URL exata** que está sendo chamada

**Deve ser:** `https://clamatec.com/api/consulta-online/buscar`

---

## 📋 Checklist

- [ ] Fiz rebuild do frontend (`npm run build`)
- [ ] Fiz upload completo da pasta `out/`
- [ ] Limpei o cache do navegador (Ctrl+Shift+R)
- [ ] Testei novamente

---

**Faça o rebuild completo e limpe o cache do navegador!** 🚀

