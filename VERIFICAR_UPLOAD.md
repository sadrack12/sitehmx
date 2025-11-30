# 🔍 Verificar se Upload foi Feito Corretamente

## ⚠️ Problema

O erro mostra que ainda está usando código antigo com `/public/`:
- ❌ `POST https://clamatec.com/api/public/consulta-online/buscar`

Isso significa que os arquivos JavaScript no servidor ainda são antigos.

---

## ✅ Verificações

### 1. Verificar se Upload foi Feito

Você fez upload da pasta `frontend/out/` para `public_html/` no cPanel?

- [ ] Sim, fiz upload
- [ ] Ainda não fiz upload

---

### 2. Se Já Fez Upload

Verifique se os arquivos foram realmente substituídos:

No cPanel, verifique a data de modificação dos arquivos:
- Vá em `public_html/_next/static/chunks/`
- Veja a data do arquivo `page-*.js`
- **Deve ser de hoje** (após o rebuild)

---

### 3. Limpar Cache do Navegador

**MUITO IMPORTANTE:**

1. **Pressione:** `Shift + Ctrl + R` (Windows/Linux) ou `Shift + Cmd + R` (Mac)
2. **OU:** Abra DevTools (F12) → Network → Marque "Disable cache"
3. **OU:** Limpe cache completo nas configurações do navegador

---

### 4. Verificar Arquivo no Servidor

No cPanel, procure pelo arquivo:
- `public_html/_next/static/chunks/page-*.js`

Abra um arquivo e procure por `/public/consulta-online/buscar`. Se encontrar, o upload não substituiu os arquivos.

---

## 📋 Checklist

- [ ] Fiz upload da pasta `out/` completa
- [ ] Substituí todos os arquivos no servidor
- [ ] Limpei cache do navegador (hard refresh)
- [ ] Testei novamente

---

**Se ainda não fez upload, faça AGORA!** 🚀

