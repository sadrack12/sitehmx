# 🚨 REBUILD OBRIGATÓRIO DO FRONTEND

## ⚠️ Situação

O erro mostra que o servidor ainda tem código antigo com `/public/`:
- ❌ `POST https://clamatec.com/api/public/consulta-online/buscar 404`

O código local já está correto (sem `/public/`), mas o build no servidor está desatualizado.

---

## ✅ SOLUÇÃO: Rebuild Completo

### Passo 1: Limpar Tudo

```bash
cd frontend
rm -rf out
rm -rf .next
npm run build
```

### Passo 2: Upload Completo

No cPanel:
1. Vá em `public_html/`
2. **Delete TUDO** (exceto a pasta `api/`)
3. Faça upload de **TODA** a pasta `frontend/out/`
4. Certifique-se que o `.htaccess` está incluído

### Passo 3: Limpar Cache do Navegador

- **Hard Refresh:** `Ctrl+Shift+R` ou `Cmd+Shift+R`
- **OU:** DevTools (F12) → Application → Clear Storage

---

## 📋 Verificar

Após rebuild e upload:

1. Abra Console (F12) → Network
2. Tente buscar consultas
3. Veja a URL na requisição

**Deve aparecer:** `https://clamatec.com/api/consulta-online/buscar` (SEM `/public/`)

---

**FAÇA O REBUILD COMPLETO AGORA!** 🚀

