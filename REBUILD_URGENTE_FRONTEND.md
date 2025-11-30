# 🚨 REBUILD URGENTE DO FRONTEND

## ⚠️ Problema Crítico

**Erro 404:** `POST https://clamatec.com/api/public/consulta-online/buscar`

**Causa:** O frontend no servidor ainda está usando a versão antiga compilada que inclui `/public/` nas rotas.

---

## ✅ CÓDIGO LOCAL ESTÁ CORRETO

**Arquivo:** `frontend/src/app/consulta-online/page.tsx`
- ✅ Linha 32: Usa `/consulta-online/buscar` (sem `/public/`)
- ✅ Código está correto

**O problema é que o build no servidor está desatualizado!**

---

## 🚀 SOLUÇÃO: REBUILD COMPLETO

### 1. No seu computador local:

```bash
cd frontend
npm run build
```

**Isso vai:**
- Compilar todo o código TypeScript/React
- Gerar os arquivos JavaScript corretos
- Criar a pasta `out/` com os arquivos atualizados

### 2. Fazer upload para o servidor:

**Faça upload de TODA a pasta `frontend/out/` para `public_html/` no cPanel.**

**IMPORTANTE:**
- ✅ Substitua TODOS os arquivos existentes
- ✅ Não adicione apenas os novos
- ✅ Faça upload completo

### 3. Limpar cache do navegador:

**Após upload:**
- F12 → Application → Clear site data
- Marque TODAS as opções
- Clique em "Clear"

**OU teste em modo anônimo**

---

## ⚠️ POR QUE ISSO ACONTECEU?

O JavaScript compilado no servidor ainda contém o código antigo que usava `/public/consulta-online/buscar`. Mesmo que o código fonte esteja correto, o build precisa ser refeito para gerar os novos arquivos JavaScript.

---

## ✅ Verificar Após Upload

**Teste:**

1. **Acesse:** `https://clamatec.com/consulta-online`
2. **Digite um NIF e busque**
3. **No Console (F12), verifique:**
   - ✅ Deve chamar: `POST https://clamatec.com/api/consulta-online/buscar`
   - ❌ NÃO deve chamar: `POST https://clamatec.com/api/public/consulta-online/buscar`

---

## 📋 Checklist

- [ ] Fazer rebuild: `npm run build`
- [ ] Fazer upload de toda a pasta `frontend/out/`
- [ ] Limpar cache do navegador
- [ ] Testar em modo anônimo
- [ ] Verificar Console para confirmar URL correta

---

**FAÇA REBUILD COMPLETO DO FRONTEND AGORA!** 🚀

