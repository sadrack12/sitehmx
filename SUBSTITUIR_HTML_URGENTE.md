# 🚨 SUBSTITUIR HTML URGENTE

## ⚠️ Situação Crítica

O servidor ainda está servindo o HTML antigo que referencia `page-226037320b154a03.js`.

**O arquivo `consulta-online.html` no servidor precisa ser substituído!**

---

## 🔥 SOLUÇÃO IMEDIATA

### Passo 1: Verificar Arquivo Local

O arquivo local está correto:
- **Arquivo:** `frontend/out/consulta-online.html`
- **Referencia:** `page-144a616044619ace.js` ✅

### Passo 2: Substituir no Servidor

**Via cPanel File Manager:**

1. **Vá em:** `public_html/consulta-online.html`
2. **Delete o arquivo** (ou renomeie para backup: `consulta-online.html.old`)
3. **Faça upload de:** `frontend/out/consulta-online.html`
4. **Verifique permissões:** `644`

**Via FTP/SFTP:**

1. **Conecte ao servidor**
2. **Vá em:** `public_html/`
3. **Substitua:** `consulta-online.html` pelo arquivo local

### Passo 3: Verificar Após Upload

**No servidor, abra `consulta-online.html` e verifique:**

**Deve conter:**
```html
<script src="/_next/static/chunks/app/consulta-online/page-144a616044619ace.js" async=""></script>
```

**NÃO deve conter:**
```html
page-226037320b154a03.js
```

### Passo 4: Limpar Cache e Testar

1. **Modo anônimo do navegador**
2. **Acesse:** `https://clamatec.com/consulta-online`
3. **Veja código fonte:** `Ctrl+U`
4. **Procure por:** `page-144a616044619ace.js` ✅

---

## ⚠️ IMPORTANTE

**Se você fez upload mas o erro persiste:**

1. **Verifique se o arquivo foi realmente substituído:**
   - Data de modificação deve ser recente
   - Tamanho do arquivo deve corresponder ao local

2. **Verifique se há múltiplos arquivos:**
   - Pode haver `consulta-online.html` e `consulta-online.html.bak`
   - Delete todos os backups

3. **Verifique cache do servidor:**
   - Alguns servidores têm cache de arquivos estáticos
   - Aguarde 2-3 minutos após upload

---

**Substitua o arquivo HTML no servidor AGORA!** 🚀

