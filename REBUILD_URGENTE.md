# 🚨 URGENTE: Rebuild do Frontend Necessário

## ⚠️ Problema

O erro mostra que ainda está usando URLs com `/public/`:
- ❌ `/api/public/consulta-online/buscar`

Mas as URLs corretas são:
- ✅ `/api/consulta-online/buscar`

**Isso significa que o build no servidor ainda tem código antigo!**

---

## ✅ SOLUÇÃO: Rebuild e Upload Completo

### Passo 1: Rebuild do Frontend

```bash
cd frontend
npm run build
```

### Passo 2: Verificar se o Build está Correto

Verifique se a pasta `out/` foi criada e tem os arquivos atualizados.

### Passo 3: Upload Completo

1. **No cPanel File Manager**, vá em `public_html/`
2. **Delete TUDO** dentro de `public_html/` (EXCETO a pasta `api/`)
3. **Faça upload de TODA** a pasta `frontend/out/` para `public_html/`
4. **Certifique-se** de que o arquivo `.htaccess` está incluído

### Passo 4: Limpar Cache do Navegador

- **Pressione:** `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
- **OU:** Abra DevTools (F12) → Application → Clear Storage → Clear site data

---

## 🔍 Verificar Código Local

O código local já está correto:

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api'
const response = await fetch(`${apiUrl}/consulta-online/buscar`, {
```

**Agora só precisa fazer o rebuild e upload!**

---

## 📋 Checklist

- [ ] Código local está correto (sem `/public/`)
- [ ] Fiz rebuild: `npm run build`
- [ ] Deletei arquivos antigos em `public_html/` (exceto `api/`)
- [ ] Fiz upload completo da pasta `out/`
- [ ] Limpei cache do navegador
- [ ] Testei novamente

---

**Faça o rebuild e upload AGORA!** 🚀

