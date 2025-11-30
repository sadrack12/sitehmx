# 🧪 Testar Arquivos no Servidor

## 🔍 Verificar se Arquivos Foram Substituídos

### No cPanel File Manager:

1. **Vá em:** `public_html/_next/static/chunks/app/consulta-online/`
2. **Procure por arquivo:** `page-*.js`
3. **Abra o arquivo** e procure por `/public/consulta-online/buscar`

**Se encontrar:** Os arquivos não foram substituídos - precisa fazer upload novamente  
**Se não encontrar:** O problema é outro

---

## 🧪 Teste Rápido no Navegador

Abra o Console (F12) e execute:

```javascript
// Verificar URL da API
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://clamatec.com/api')

// Verificar se há código antigo
fetch('https://clamatec.com/_next/static/chunks/app/consulta-online/page-*.js')
  .then(r => r.text())
  .then(text => {
    if (text.includes('/public/consulta-online')) {
      console.log('❌ Código antigo ainda presente!')
    } else {
      console.log('✅ Código novo!')
    }
  })
```

---

## 🔍 Verificar Data dos Arquivos

No cPanel, verifique a **data de modificação** dos arquivos:
- `public_html/_next/static/chunks/app/consulta-online/page-*.js`

**Deve ser de hoje** (após o upload)

---

**Me diga o que você encontra!** 🔍

