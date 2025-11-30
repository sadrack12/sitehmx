# 🧪 TESTE EM MODO ANÔNIMO

## 🎯 Teste Rápido

Como o arquivo antigo foi deletado, o problema é **cache do navegador**.

---

## ✅ TESTE AGORA

### Passo 1: Abrir Modo Anônimo

**Chrome:**
- `Ctrl+Shift+N` (Windows/Linux)
- `Cmd+Shift+N` (Mac)

**Firefox:**
- `Ctrl+Shift+P` (Windows/Linux)
- `Cmd+Shift+P` (Mac)

### Passo 2: Acessar o Site

1. **Acesse:** `https://clamatec.com/consulta-online`
2. **Abra Console (F12)**
3. **Vá em Network**
4. **Marque "Disable cache"**

### Passo 3: Verificar Arquivo

**No Console, execute:**

```javascript
const scripts = Array.from(document.querySelectorAll('script[src*="consulta-online"]'))
scripts.forEach(s => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Arquivo:', s.src)
  if (s.src.includes('page-226037320b154a03')) {
    console.error('❌ ARQUIVO ANTIGO - CACHE DO NAVEGADOR!')
  } else if (s.src.includes('page-144a616044619ace')) {
    console.log('✅ Arquivo correto!')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})
```

### Passo 4: Testar Buscar Consultas

1. **Tente buscar consultas**
2. **Veja a requisição no Network**
3. **A URL deve ser:** `https://clamatec.com/api/consulta-online/buscar` (SEM `/public/`)

---

## ✅ Resultado Esperado

**Se funcionar em modo anônimo:**
- ✅ O problema é cache do navegador
- ✅ Limpe o cache completamente (veja guia anterior)
- ✅ Depois funcionará normalmente

**Se ainda não funcionar:**
- Pode ser cache do servidor/CDN
- Aguarde alguns minutos
- Ou me diga o resultado do teste

---

**Teste em modo anônimo AGORA e me diga o resultado!** 🚀

