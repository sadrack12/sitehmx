# 🔧 Solução Definitiva: Erro /api/public/consulta-online/buscar

## ⚠️ Problema

**Erro 404:** `POST https://clamatec.com/api/public/consulta-online/buscar`

**Causa:** O frontend no servidor ainda está usando JavaScript compilado antigo.

---

## ✅ VERIFICAÇÃO: Código Local Está Correto

**Arquivo:** `frontend/src/app/consulta-online/page.tsx`
- ✅ Linha 32: `${apiUrl}/consulta-online/buscar` (sem `/public/`)
- ✅ Código fonte está 100% correto

**O problema é APENAS o build desatualizado no servidor!**

---

## 🚀 SOLUÇÃO DEFINITIVA

### Passo 1: Rebuild Completo

**No seu computador local:**

```bash
cd frontend
rm -rf .next out
npm run build
```

**Isso vai:**
- ✅ Limpar builds antigos
- ✅ Compilar código novo
- ✅ Gerar arquivos JavaScript corretos

### Passo 2: Verificar Build Local

**Antes de fazer upload, verifique:**

```bash
cd frontend/out
grep -r "public/consulta-online" . 2>/dev/null
```

**Se encontrar algo, o build ainda está errado. Se não encontrar nada, está correto!**

### Passo 3: Upload Completo

**Faça upload de TODA a pasta `frontend/out/` para `public_html/` no cPanel.**

**IMPORTANTE:**
- ✅ Delete TODOS os arquivos antigos em `public_html/`
- ✅ Faça upload de TODA a pasta `out/` novamente
- ✅ Não adicione apenas os novos arquivos

### Passo 4: Limpar Cache

**No navegador:**
1. F12 → Application → Clear site data
2. Marque TODAS as opções
3. Clique em "Clear"
4. Recarregue a página (Ctrl+Shift+R ou Cmd+Shift+R)

**OU teste em modo anônimo/privado**

---

## 🔍 Verificar no Servidor

**Após upload, verifique se o arquivo correto está no servidor:**

1. **Acesse o servidor via FTP/cPanel**
2. **Vá em:** `public_html/_next/static/chunks/app/consulta-online/`
3. **Procure por:** `page-*.js`
4. **Abra o arquivo e procure por:** `consulta-online/buscar`
5. **Deve encontrar:** `/consulta-online/buscar` (sem `/public/`)
6. **NÃO deve encontrar:** `/public/consulta-online/buscar`

---

## ⚠️ Se Ainda Não Funcionar

**Verifique:**

1. [ ] Build foi feito corretamente?
2. [ ] Upload foi completo (todos os arquivos)?
3. [ ] Cache do navegador foi limpo?
4. [ ] Testou em modo anônimo?
5. [ ] Verificou o arquivo JavaScript no servidor?

**Se tudo estiver correto e ainda não funcionar:**
- Pode ser cache do servidor/CDN
- Entre em contato com o suporte do cPanel para limpar cache

---

## ✅ Checklist Final

- [ ] Rebuild feito: `npm run build`
- [ ] Verificado build local (sem `/public/`)
- [ ] Upload completo de `frontend/out/`
- [ ] Cache do navegador limpo
- [ ] Testado em modo anônimo
- [ ] Verificado arquivo JavaScript no servidor

---

**FAÇA REBUILD E UPLOAD COMPLETO AGORA!** 🚀

