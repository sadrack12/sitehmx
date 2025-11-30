# 📋 LISTA DE ARQUIVOS PARA UPLOAD

## ✅ Arquivos Locais Estão Corretos

Confirmação:
- ✅ Não há arquivo `page-226037320b154a03.js` no build local
- ✅ Apenas `page-144a616044619ace.js` existe (correto)
- ✅ HTML referencia o arquivo correto

---

## 🚀 ARQUIVOS PARA UPLOAD

### Arquivo Principal (CRÍTICO)

```
frontend/out/consulta-online.html
→ Fazer upload para: public_html/consulta-online.html
```

### Arquivos JavaScript (CRÍTICO)

```
frontend/out/_next/static/chunks/app/consulta-online/page-144a616044619ace.js
→ Fazer upload para: public_html/_next/static/chunks/app/consulta-online/page-144a616044619ace.js
```

### Ou Fazer Upload de Tudo

Para garantir que tudo está atualizado:

```
frontend/out/_next/
→ Fazer upload para: public_html/_next/
```

---

## ⚡ SOLUÇÃO RÁPIDA

### Opção 1: Upload Apenas dos Arquivos Críticos

1. **No cPanel File Manager:**
   - Vá em `public_html/`
   - Delete: `consulta-online.html`
   - Delete: `public_html/_next/static/chunks/app/consulta-online/` (pasta inteira)

2. **Faça upload:**
   - `frontend/out/consulta-online.html` → `public_html/consulta-online.html`
   - `frontend/out/_next/static/chunks/app/consulta-online/` → `public_html/_next/static/chunks/app/consulta-online/`

### Opção 2: Upload Completo (Recomendado)

1. **No cPanel File Manager:**
   - Vá em `public_html/`
   - Delete: pasta `_next` inteira (fazer backup primeiro se necessário)

2. **Faça upload:**
   - `frontend/out/_next/` → `public_html/_next/`

3. **Substitua também:**
   - `frontend/out/consulta-online.html` → `public_html/consulta-online.html`

---

## ✅ Verificar Após Upload

No cPanel, abra `public_html/consulta-online.html` e verifique:

**Deve conter:**
```html
<script src="/_next/static/chunks/app/consulta-online/page-144a616044619ace.js" async=""></script>
```

**NÃO deve conter:**
```html
page-226037320b154a03.js
```

---

## 🧪 Teste Final

1. **Modo anônimo do navegador**
2. **Acesse:** `https://clamatec.com/consulta-online`
3. **Console (F12)** → Veja qual arquivo está sendo carregado
4. **Deve ser:** `page-144a616044619ace.js` ✅

---

**Faça upload AGORA e teste!** 🚀

