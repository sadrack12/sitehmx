# 🔍 Verificar Arquivos no Servidor

## ✅ Arquivo Local Está Correto!

O arquivo JavaScript compilado localmente está correto:
- ✅ Usa: `/consulta-online/buscar` (sem `/public/`)
- ✅ Nome do arquivo: `page-144a616044619ace.js`

---

## 🎯 O Problema Está no Servidor

Como o código local está correto mas o erro persiste, o problema é que:

1. **Os arquivos no servidor não foram substituídos** completamente
2. **O servidor tem cache** (cPanel/CDN)

---

## 📋 Verificar no Servidor (cPanel)

### 1. Verificar se Arquivo Foi Substituído

No **File Manager do cPanel**, vá em:
```
public_html/_next/static/chunks/app/consulta-online/
```

Procure o arquivo `page-*.js` e verifique:
- **Data de modificação:** Deve ser de hoje (após seu upload)
- **Nome do arquivo:** Deve ser `page-144a616044619ace.js` (igual ao local)

### 2. Verificar Conteúdo do Arquivo

Abra o arquivo no cPanel e procure por `/public/consulta-online/buscar`:
- ❌ **Se encontrar:** O arquivo é antigo - precisa fazer upload novamente
- ✅ **Se não encontrar:** O arquivo está correto - problema é cache do servidor

---

## 🔧 Soluções

### Solução 1: Fazer Upload Novamente (Substituir Todos)

1. **No File Manager**, vá em `public_html/_next/static/chunks/app/consulta-online/`
2. **Delete o arquivo** `page-*.js` antigo
3. **Faça upload** do novo arquivo `page-144a616044619ace.js`

### Solução 2: Limpar Cache do cPanel

Alguns cPanels têm cache:
1. **cPanel → Software → PHP Selector → OpCache**
2. **Desabilite OpCache temporariamente** ou limpe o cache

### Solução 3: Adicionar Versionamento na URL

Adicione um parâmetro de versão para forçar recarregamento:

```javascript
// No navegador (Console):
localStorage.setItem('forceRefresh', Date.now())
location.reload()
```

---

## 🧪 Teste Final

1. **Após substituir arquivo**, abra o navegador em **modo anônimo**
2. **Acesse:** `https://clamatec.com/consulta-online`
3. **Abra Console (F12) → Network**
4. **Tente buscar consultas**
5. **Veja a URL exata** na requisição

**Deve aparecer:** `https://clamatec.com/api/consulta-online/buscar` (SEM `/public/`)

---

## ❓ Verificar Agora

**Me diga:**
1. Qual é a **data de modificação** do arquivo `page-*.js` no servidor?
2. Qual é o **nome do arquivo** no servidor? (deve ser `page-144a616044619ace.js`)
3. Você encontrou `/public/` ao procurar dentro do arquivo no servidor?

---

**O arquivo local está correto - agora precisamos garantir que o servidor também está!** 🚀

