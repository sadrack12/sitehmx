# 📤 Instruções para Upload no cPanel

## ✅ Build Local Pronto

- ✅ Build concluído
- ✅ Arquivos na pasta `frontend/out/`
- ✅ `.htaccess` incluído

---

## 📤 Upload no cPanel

### Método 1: Upload de Pasta Completa

1. **No cPanel, vá em "File Manager"**
2. **Navegue até:** `public_html/`
3. **Selecione e delete** todos os arquivos/pastas antigas (EXCETO a pasta `api/`)
4. **Vá em "Upload"**
5. **Selecione TODA** a pasta `frontend/out/` do seu computador
6. **Extraia** o arquivo ZIP se necessário
7. **Mova todos os arquivos** de `out/` para `public_html/`

### Método 2: Via FTP/SFTP

Se tiver acesso FTP:
1. Conecte via FTP/SFTP
2. Vá até `public_html/`
3. Delete arquivos antigos (exceto `api/`)
4. Faça upload de todos os arquivos de `frontend/out/`

---

## ⚠️ IMPORTANTE

- ✅ Deve substituir **TODOS** os arquivos
- ✅ Incluir a pasta `_next/` completa
- ✅ Incluir o arquivo `.htaccess`
- ❌ NÃO deletar a pasta `api/`

---

## 🧪 Depois do Upload

1. **Limpe cache do navegador:** `Ctrl+Shift+R` ou `Cmd+Shift+R`
2. **Teste:** Acesse o site e veja se funciona

---

**Faça o upload completo AGORA!** 🚀

