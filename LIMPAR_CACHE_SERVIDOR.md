# 🧹 Limpar Cache do Servidor e Navegador

## ✅ Arquivo Antigo Deletado

O arquivo antigo foi deletado, mas o navegador ainda está carregando ele. Isso é **cache**!

---

## 🔥 SOLUÇÃO: Limpar Cache Completamente

### Passo 1: Limpar Cache do Navegador (CRÍTICO)

**Método 1: Modo Anônimo (Mais Fácil)**
1. **Abra janela anônima:**
   - Chrome: `Ctrl+Shift+N` (Windows/Linux) ou `Cmd+Shift+N` (Mac)
   - Firefox: `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
2. **Acesse:** `https://clamatec.com/consulta-online`
3. **Teste buscar consultas**

**Método 2: Limpar Tudo**
1. **F12** → Abra DevTools
2. **Vá em "Application"** (ou "Armazenamento")
3. **Clique em "Clear site data"** (ou "Limpar dados do site")
4. **Marque TODAS as opções:**
   - ✅ Cache
   - ✅ Cookies
   - ✅ Local Storage
   - ✅ Session Storage
   - ✅ Service Workers (se houver)
5. **Clique em "Clear"**
6. **Feche e reabra o navegador completamente**

**Método 3: Hard Refresh**
1. **Feche TODAS as abas** do site
2. **Pressione:** `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
3. **OU:** `Ctrl+F5` (Windows/Linux)

---

### Passo 2: Verificar Cache do Servidor/CDN

Alguns servidores têm cache de arquivos estáticos:

1. **Aguarde 2-3 minutos** após deletar o arquivo
2. **Tente acessar diretamente:**
   - `https://clamatec.com/_next/static/chunks/app/consulta-online/page-226037320b154a03.js`
   - **Deve retornar 404** (arquivo não existe)
3. **Se retornar 200:**
   - Cache do servidor ainda está servindo o arquivo
   - Aguarde mais alguns minutos
   - Ou contate o suporte do hosting para limpar cache

---

### Passo 3: Forçar Recarregamento

**No Console (F12), execute:**

```javascript
// Forçar recarregamento sem cache
location.reload(true)

// OU limpar cache e recarregar
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name))
    location.reload(true)
  })
} else {
  location.reload(true)
}
```

---

## 🧪 TESTE FINAL

1. **Modo anônimo do navegador**
2. **Acesse:** `https://clamatec.com/consulta-online`
3. **Abra Console (F12) → Network**
4. **Marque "Disable cache"** (para não usar cache durante os testes)
5. **Tente buscar consultas**
6. **Veja qual arquivo está sendo carregado**

**Execute no Console:**

```javascript
const scripts = Array.from(document.querySelectorAll('script[src*="consulta-online"]'))
scripts.forEach(s => {
  console.log('Arquivo:', s.src)
  if (s.src.includes('page-226037320b154a03')) {
    console.error('❌ ARQUIVO ANTIGO - CACHE!')
  } else if (s.src.includes('page-144a616044619ace')) {
    console.log('✅ Arquivo correto!')
  }
})
```

---

## ⚠️ Se Ainda Aparecer o Arquivo Antigo

**Verifique:**

1. [ ] Testou em modo anônimo?
2. [ ] Limpou cache completamente?
3. [ ] Aguardou alguns minutos (cache do servidor)?
4. [ ] Tentou acessar diretamente o arquivo antigo (deve dar 404)?

**Se ainda aparecer após tudo isso:**
- Pode ser cache do CDN (se houver)
- Aguarde 5-10 minutos
- Ou contate o suporte do hosting

---

**Limpe o cache do navegador AGORA e teste em modo anônimo!** 🚀

