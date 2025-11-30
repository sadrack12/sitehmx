# 🔄 REBUILD COMPLETO NECESSÁRIO

## ⚠️ Problema Identificado

O servidor está usando arquivos JavaScript de um build ANTIGO:
- ❌ `page-bc5274d425e3bf2c.js` (página inicial - antiga)
- ❌ `page-25b165d0131b226b.js` (página agendar - antiga)

Esses arquivos **NÃO EXISTEM** no build local atual!

---

## ✅ SOLUÇÃO: Upload Completo de TODOS os Arquivos

### Passo 1: Verificar Build Local

O código fonte está correto, mas os arquivos compilados no servidor são antigos.

### Passo 2: Fazer Upload Completo

**Você precisa fazer upload de TODA a pasta `frontend/out/` para o servidor!**

1. **No cPanel File Manager:**
   - Vá em `public_html/`
   - **Delete completamente:**
     - Pasta `_next/` (inteira)
     - Todos os arquivos `.html` (ou faça backup)

2. **Faça upload completo:**
   - `frontend/out/` → `public_html/`
   - Isso inclui:
     - Todos os arquivos `.html`
     - Toda a pasta `_next/`
     - Todos os assets

### Passo 3: Verificar Após Upload

No servidor, verifique que os arquivos HTML referenciam os arquivos corretos:

**index.html deve referenciar um arquivo atual:**
- ✅ Nome deve ser algo como: `page-*.js` (diferente de `page-bc5274d425e3bf2c.js`)

**agendar.html deve referenciar um arquivo atual:**
- ✅ Nome deve ser algo como: `page-*.js` (diferente de `page-25b165d0131b226b.js`)

---

## 🚀 Método Recomendado: Upload via FTP/SFTP

1. **Conecte via FTP/SFTP**
2. **Vá em:** `public_html/`
3. **Delete:** Pasta `_next/` inteira
4. **Faça upload de:**
   - `frontend/out/_next/` → `public_html/_next/`
   - Todos os arquivos `.html` de `frontend/out/` → `public_html/`

---

## 📋 Checklist

- [ ] Deletei pasta `_next/` do servidor
- [ ] Fiz upload da pasta `_next/` completa do build local
- [ ] Fiz upload de todos os arquivos `.html`
- [ ] Verifiquei permissões (arquivos: 644, pastas: 755)
- [ ] Testei em modo anônimo do navegador

---

## ⚠️ IMPORTANTE

**NÃO faça upload de arquivos individuais!**

O problema é que o servidor tem um build ANTIGO completo. Você precisa substituir TODOS os arquivos compilados.

---

**Faça upload de TODA a pasta `out/` AGORA!** 🚀
