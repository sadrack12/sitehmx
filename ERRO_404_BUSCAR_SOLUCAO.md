# 🚨 Solução: Erro 404 em "buscar"

## ⚠️ Problema

**Erro:** `Failed to load resource: the server responded with a status of 404 () (buscar, line 0)`

**Causa:** O JavaScript compilado no servidor ainda está usando a rota antiga `/api/public/consulta-online/buscar`.

---

## ✅ CÓDIGO LOCAL ESTÁ CORRETO

O código fonte está 100% correto. O problema é **APENAS** o build desatualizado no servidor.

---

## 🚀 SOLUÇÃO IMEDIATA

### Opção 1: Rebuild e Upload (Recomendado)

**1. No seu computador:**

```bash
cd frontend
rm -rf .next out
npm run build
```

**2. Upload completo:**

- Delete TODOS os arquivos em `public_html/_next/`
- Faça upload de TODA a pasta `frontend/out/_next/` para `public_html/_next/`
- Faça upload de TODA a pasta `frontend/out/` para `public_html/`

**3. Limpar cache:**

- F12 → Application → Clear site data → Clear
- OU teste em modo anônimo

---

### Opção 2: Verificar e Corrigir Arquivo Específico

**1. Identifique o arquivo:**

- Abra o Console (F12)
- Vá em Network
- Procure por "buscar" ou "consulta-online"
- Veja qual arquivo JavaScript está fazendo a chamada

**2. No servidor, encontre o arquivo:**

- Vá em: `public_html/_next/static/chunks/app/consulta-online/`
- Procure por: `page-*.js`

**3. Verifique o conteúdo:**

- Abra o arquivo
- Procure por: `public/consulta-online/buscar`
- Se encontrar, esse é o arquivo antigo

**4. Solução:**

- Delete esse arquivo antigo
- Faça rebuild e upload do arquivo novo

---

## 🔍 Como Identificar o Arquivo Errado

**No Console do navegador, execute:**

```javascript
// Verificar qual arquivo está fazendo a chamada
console.log('Verificando arquivos carregados...')
Array.from(document.querySelectorAll('script[src]')).forEach(script => {
  if (script.src.includes('consulta-online')) {
    console.log('Arquivo encontrado:', script.src)
  }
})
```

**Depois, acesse o arquivo diretamente e procure por `/public/consulta-online`**

---

## ⚠️ IMPORTANTE

**O código fonte está correto!** O problema é que:

1. O build antigo ainda está no servidor
2. O navegador está usando cache do JavaScript antigo
3. Precisa fazer rebuild + upload + limpar cache

---

## ✅ Checklist

- [ ] Rebuild feito: `npm run build`
- [ ] Upload completo de `frontend/out/`
- [ ] Arquivos antigos deletados do servidor
- [ ] Cache do navegador limpo
- [ ] Testado em modo anônimo
- [ ] Verificado arquivo JavaScript no servidor

---

**FAÇA REBUILD E UPLOAD COMPLETO AGORA!** 🚀

