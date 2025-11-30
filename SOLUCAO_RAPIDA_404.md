# ⚡ SOLUÇÃO RÁPIDA - Erro 404 com `/public/`

## 🎯 Problema

O erro `api/public/consulta-online/buscar:1  Failed to load resource: 404` significa que:

1. ✅ O código fonte está correto (sem `/public/`)
2. ✅ O build local está correto
3. ❌ **O servidor ainda está servindo arquivos JavaScript ANTIGOS**

---

## 🔥 SOLUÇÃO IMEDIATA

### Opção 1: Upload Completo (Recomendado)

**Via FTP/SFTP:**

1. **Conecte ao servidor**
2. **Vá em:** `public_html/`
3. **Delete a pasta `_next/` COMPLETA**
4. **Faça upload de:**
   - `frontend/out/_next/` → `public_html/_next/`
   - Todos os arquivos `.html` de `frontend/out/` → `public_html/`
   - `frontend/out/.htaccess` → `public_html/.htaccess`

### Opção 2: Upload via cPanel File Manager

1. **No cPanel**, vá em `public_html/`
2. **Delete:** Pasta `_next/` completa
3. **Upload:**
   - Selecione a pasta `frontend/out/_next/` → Extraia para `public_html/`
   - Selecione todos os arquivos `.html` de `frontend/out/` → Faça upload
   - Selecione `frontend/out/.htaccess` → Faça upload

---

## ✅ Verificar Após Upload

### 1. Verificar Arquivos JavaScript

No servidor, verifique que os arquivos corretos existem:
- `public_html/_next/static/chunks/app/consulta-online/page-144a616044619ace.js`
- `public_html/_next/static/chunks/app/page-00c05994153ff2c2.js`
- `public_html/_next/static/chunks/app/agendar/page-60b4fbbb33a6c106.js`

### 2. Verificar HTML

No servidor, abra `consulta-online.html` e verifique que referencia:
```html
<script src="/_next/static/chunks/app/consulta-online/page-144a616044619ace.js" async=""></script>
```

**NÃO deve referenciar:** `page-226037320b154a03.js`

### 3. Limpar Cache

**No navegador:**
- Modo anônimo: `Ctrl+Shift+N` (Chrome) ou `Ctrl+Shift+P` (Firefox)
- OU limpar cache: F12 → Application → Clear site data

---

## 🧪 Teste

1. **Abra modo anônimo**
2. **Acesse:** `https://clamatec.com/consulta-online`
3. **Abra Console (F12) → Network**
4. **Tente buscar consultas**
5. **Verifique a URL na requisição**

**Deve aparecer:** `https://clamatec.com/api/consulta-online/buscar` (SEM `/public/`)

---

## ❓ Se Ainda Não Funcionar

Verifique se há cache do servidor/CDN:
- Alguns servidores têm cache de arquivos estáticos
- Aguarde alguns minutos após o upload
- Tente acessar diretamente: `https://clamatec.com/_next/static/chunks/app/consulta-online/page-144a616044619ace.js`

**Se esse arquivo não existir no servidor, o upload não foi completo!**

---

**Faça upload completo AGORA e teste!** 🚀

