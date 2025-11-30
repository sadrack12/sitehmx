# ✅ Verificar se Está Funcionando

## 🧪 TESTE AGORA

### Passo 1: Limpar Cache Completamente

**No navegador:**

1. **Abra modo anônimo/privado:**
   - Chrome: `Ctrl+Shift+N` (Windows/Linux) ou `Cmd+Shift+N` (Mac)
   - Firefox: `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)

2. **OU limpe cache completamente:**
   - F12 → Application → Clear site data
   - Marque TODAS as opções
   - Clique em "Clear"

### Passo 2: Testar Cada Página

**Teste em modo anônimo:**

1. **Página inicial:**
   - Acesse: `https://clamatec.com/`
   - Abra Console (F12)
   - Verifique se há erros 404 com `/public/`
   - ✅ **Deve funcionar sem erros**

2. **Página de agendamento:**
   - Acesse: `https://clamatec.com/agendar`
   - Abra Console (F12)
   - Verifique se há erros 404 com `/public/`
   - ✅ **Deve funcionar sem erros**

3. **Página de consulta online:**
   - Acesse: `https://clamatec.com/consulta-online`
   - Abra Console (F12) → Network
   - Tente buscar uma consulta
   - Verifique a URL da requisição
   - ✅ **Deve ser:** `https://clamatec.com/api/consulta-online/buscar` (SEM `/public/`)

### Passo 3: Verificar Arquivos no Console

**No Console (F12), execute:**

```javascript
// Ver qual arquivo está sendo carregado
console.log('Verificando arquivos carregados...')
const scripts = Array.from(document.querySelectorAll('script[src*="page-"]'))
scripts.forEach(s => {
  console.log('Arquivo:', s.src)
  
  // Verificar se é arquivo antigo
  if (s.src.includes('page-226037320b154a03') || 
      s.src.includes('page-bc5274d425e3bf2c') ||
      s.src.includes('page-25b165d0131b226b')) {
    console.error('❌ ARQUIVO ANTIGO ENCONTRADO:', s.src)
  } else {
    console.log('✅ Arquivo correto:', s.src)
  }
})
```

**Resultados esperados:**
- ✅ `page-00c05994153ff2c2.js` (index.html)
- ✅ `page-60b4fbbb33a6c106.js` (agendar.html)
- ✅ `page-144a616044619ace.js` (consulta-online.html)

---

## 🔍 Se Ainda Há Erro

### Verificar no Servidor

**No cPanel, verifique:**

1. **Arquivo:** `public_html/consulta-online.html`
   - Deve referenciar: `page-144a616044619ace.js`
   - ❌ **NÃO deve referenciar:** `page-226037320b154a03.js`

2. **Arquivo:** `public_html/_next/static/chunks/app/consulta-online/page-144a616044619ace.js`
   - Deve existir
   - Data de modificação deve ser recente (hoje)

3. **Conteúdo do arquivo JavaScript:**
   - Abra o arquivo no cPanel
   - Procure por: `/public/consulta-online/buscar`
   - ❌ **NÃO deve encontrar** (arquivo antigo)
   - ✅ **Deve encontrar:** `/consulta-online/buscar` (sem `/public/`)

### Verificar Cache do Servidor

Alguns servidores têm cache:
- Aguarde 2-3 minutos após upload
- Tente acessar diretamente: `https://clamatec.com/_next/static/chunks/app/consulta-online/page-144a616044619ace.js`
- Se retornar 404, o arquivo não foi enviado corretamente

---

## ✅ Checklist Final

- [ ] Limpei cache do navegador (modo anônimo)
- [ ] Testei página inicial - sem erros
- [ ] Testei página agendar - sem erros
- [ ] Testei página consulta-online - sem erros
- [ ] Verifiquei que as URLs são corretas (sem `/public/`)
- [ ] Verifiquei no servidor que os arquivos estão corretos

---

**Teste AGORA e me diga o resultado!** 🚀

Se ainda houver erro, me diga:
1. Qual página tem erro?
2. Qual é a mensagem de erro exata?
3. Qual arquivo JavaScript está sendo carregado? (veja no Console)

