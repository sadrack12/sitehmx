# 🚨 UPLOAD COMPLETO URGENTE

## ⚠️ Problema Crítico

O servidor tem um **BUILD ANTIGO COMPLETO**! Todos os arquivos estão desatualizados.

**Arquivos antigos no servidor:**
- ❌ `page-bc5274d425e3bf2c.js` (index.html)
- ❌ `page-25b165d0131b226b.js` (agendar.html)  
- ❌ `page-226037320b154a03.js` (consulta-online.html)

**Arquivos corretos no build local:**
- ✅ `page-00c05994153ff2c2.js` (index.html)
- ✅ `page-60b4fbbb33a6c106.js` (agendar.html)
- ✅ `page-144a616044619ace.js` (consulta-online.html)

---

## 🔥 SOLUÇÃO: Upload Completo

### Passo 1: Backup (Opcional mas Recomendado)

No cPanel, faça backup da pasta `public_html/` antes de substituir.

### Passo 2: Deletar Arquivos Antigos

No cPanel File Manager, **delete:**
- Pasta `_next/` inteira (contém todos os arquivos JavaScript antigos)
- Todos os arquivos `.html` (ou substitua individualmente)

### Passo 3: Upload Completo

**Faça upload de TODA a pasta `frontend/out/` para `public_html/`:**

Isso inclui:
- ✅ Todos os arquivos `.html`
- ✅ Toda a pasta `_next/` (com todos os chunks atualizados)
- ✅ Todos os assets

---

## 📋 Método Recomendado: FTP/SFTP

1. **Conecte via FTP/SFTP ao servidor**
2. **Navegue para:** `public_html/`
3. **Delete:**
   - Pasta `_next/` completa
   - Todos os `.html` (ou mantenha e substitua)
4. **Upload de:**
   - `frontend/out/_next/` → `public_html/_next/`
   - Todos os arquivos `.html` de `frontend/out/` → `public_html/`
   - Todos os outros arquivos/pastas necessários

---

## ✅ Verificar Após Upload

1. **No servidor, abra `index.html`** → deve referenciar `page-00c05994153ff2c2.js`
2. **No servidor, abra `agendar.html`** → deve referenciar `page-60b4fbbb33a6c106.js`
3. **No servidor, abra `consulta-online.html`** → deve referenciar `page-144a616044619ace.js`

---

## 🧪 Teste Final

1. **Modo anônimo do navegador**
2. **Teste cada página:**
   - `https://clamatec.com/` → não deve ter erro 404
   - `https://clamatec.com/agendar` → não deve ter erro 404
   - `https://clamatec.com/consulta-online` → não deve ter erro 404

---

## ⚠️ IMPORTANTE

**NÃO faça upload de arquivos individuais!**

O problema é que o servidor tem um build antigo COMPLETO. Você precisa substituir TODOS os arquivos compilados.

---

**Faça upload completo de `frontend/out/` AGORA!** 🚀

