# 🚨 REBUILD DO FRONTEND OBRIGATÓRIO

## ⚠️ Problema Identificado

O servidor ainda está usando código antigo que chama:
- ❌ `/api/public/consulta-online/buscar`

O código local já está corrigido, mas o build no servidor está desatualizado.

---

## ✅ SOLUÇÃO IMEDIATA

### Passo 1: Rebuild Completo

```bash
cd frontend
npm run build
```

### Passo 2: Upload

Faça upload de **TODA** a pasta `frontend/out/` para `public_html/` no cPanel, **substituindo todos os arquivos**.

### Passo 3: Limpar Cache

No navegador, pressione `Ctrl+Shift+R` ou `Cmd+Shift+R` para hard refresh.

---

## 🔍 Por Que Precisa Rebuild?

O código JavaScript está "compilado" no build. Mesmo que você corrija o código fonte, precisa fazer um novo build para gerar os arquivos JavaScript finais.

---

## 📋 Checklist

- [ ] Fiz rebuild: `npm run build`
- [ ] Fiz upload completo da pasta `out/`
- [ ] Limpei cache do navegador
- [ ] Testei novamente

---

**FAÇA O REBUILD AGORA!** 🚀

