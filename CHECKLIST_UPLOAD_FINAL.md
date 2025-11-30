# ✅ CHECKLIST - Upload Final Completo

## 🎯 Objetivo

Fazer upload completo de TODOS os arquivos atualizados para o servidor.

---

## 📋 CHECKLIST DE ARQUIVOS

### ✅ Arquivos Necessários

**1. Arquivos HTML:**
- [ ] `frontend/out/index.html`
- [ ] `frontend/out/consulta-online.html`
- [ ] `frontend/out/agendar.html`
- [ ] Todos os outros arquivos `.html` em `frontend/out/`

**2. Pasta JavaScript:**
- [ ] `frontend/out/_next/` (PASTA COMPLETA)

**3. Arquivo de Configuração:**
- [ ] `frontend/out/.htaccess` (RECRIADO AGORA)

**4. Outros Assets:**
- [ ] `frontend/out/images/` (se existir)
- [ ] Outros arquivos/pastas necessários

---

## 🚀 PASSOS PARA UPLOAD

### Passo 1: Preparar Localmente

Verifique que você tem:
- ✅ Pasta `frontend/out/` completa
- ✅ Arquivo `.htaccess` em `frontend/out/`
- ✅ Todos os arquivos HTML atualizados

### Passo 2: Backup (Opcional)

No cPanel, faça backup de `public_html/` antes de substituir.

### Passo 3: Deletar no Servidor

No cPanel File Manager, delete:
- [ ] Pasta `_next/` completa (em `public_html/`)
- [ ] Todos os arquivos `.html` antigos (ou mantenha e substitua)

### Passo 4: Upload

**Via FTP/SFTP (Recomendado):**

1. Conecte ao servidor
2. Vá em `public_html/`
3. Faça upload de:
   - [ ] Pasta `frontend/out/_next/` → `public_html/_next/`
   - [ ] Todos os `.html` de `frontend/out/` → `public_html/`
   - [ ] `frontend/out/.htaccess` → `public_html/.htaccess`

**Via cPanel File Manager:**

1. Vá em `public_html/`
2. Upload de arquivos individuais:
   - [ ] Cada arquivo `.html`
   - [ ] Arquivo `.htaccess`
3. Upload da pasta `_next/` (pode precisar compactar primeiro)

---

## ✅ VERIFICAÇÃO PÓS-UPLOAD

### No Servidor, Verifique:

**1. Arquivos JavaScript corretos existem:**
- [ ] `public_html/_next/static/chunks/app/page-00c05994153ff2c2.js`
- [ ] `public_html/_next/static/chunks/app/agendar/page-60b4fbbb33a6c106.js`
- [ ] `public_html/_next/static/chunks/app/consulta-online/page-144a616044619ace.js`

**2. HTML referencia arquivos corretos:**
- [ ] `index.html` → `page-00c05994153ff2c2.js` ✅
- [ ] `agendar.html` → `page-60b4fbbb33a6c106.js` ✅
- [ ] `consulta-online.html` → `page-144a616044619ace.js` ✅

**3. Arquivo `.htaccess` existe:**
- [ ] `public_html/.htaccess` existe e tem conteúdo

---

## 🧪 TESTE FINAL

1. [ ] Limpar cache do navegador (modo anônimo)
2. [ ] Acessar: `https://clamatec.com/`
   - Verificar que não há erros 404 com `/public/`
3. [ ] Acessar: `https://clamatec.com/agendar`
   - Verificar que não há erros 404 com `/public/`
4. [ ] Acessar: `https://clamatec.com/consulta-online`
   - Tentar buscar consultas
   - Verificar que a URL é `/api/consulta-online/buscar` (SEM `/public/`)

---

## ❌ Se Ainda Houver Erro

**Verifique:**

1. [ ] Arquivos foram realmente substituídos no servidor?
2. [ ] Data de modificação dos arquivos no servidor é recente?
3. [ ] Cache do navegador foi limpo completamente?
4. [ ] Testou em modo anônimo?

**Se os arquivos no servidor têm data antiga:**
- O upload não foi completo
- Faça upload novamente

---

**Siga este checklist e marque cada item!** ✅

