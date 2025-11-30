# 🚨 URGENTE: Limpar Cache do Navegador

## ⚠️ Problema

O erro ainda mostra `/api/public/consulta-online/buscar`, mesmo depois do rebuild.

**Isso significa que o navegador está usando cache do código antigo!**

---

## ✅ SOLUÇÃO: Limpar Cache Completamente

### Opção 1: Hard Refresh (Mais Rápido)

1. **Pressione e segure:** `Shift` + `Ctrl` + `R` (Windows/Linux)
2. **OU:** `Shift` + `Cmd` + `R` (Mac)
3. Isso força o navegador a baixar tudo novamente

### Opção 2: Limpar Cache Manualmente

#### Chrome/Edge:
1. **F12** → Abra DevTools
2. **Clique com botão direito** no botão de recarregar (ao lado da barra de endereço)
3. **Escolha:** "Empty Cache and Hard Reload"

#### Firefox:
1. **F12** → Abra DevTools
2. **Clique com botão direito** no botão de recarregar
3. **Escolha:** "Empty Cache and Hard Reload"

### Opção 3: Limpar Tudo

1. **F12** → Abra DevTools
2. **Vá na aba "Application"** (ou "Armazenamento")
3. **Clique em "Clear site data"** (ou "Limpar dados do site")
4. **Marque tudo**
5. **Clique em "Clear"** (ou "Limpar")
6. **Recarregue a página**

---

## 🧪 Testar

Depois de limpar o cache:

1. Abra **Console (F12) → Network**
2. Tente buscar consultas online
3. Veja a URL que aparece na requisição

**Deve ser:** `https://clamatec.com/api/consulta-online/buscar` (SEM `/public/`)

---

## 📋 Importante

Se você já fez upload do novo build mas ainda vê o erro:

1. **Verifique se o upload foi completo** - todos os arquivos foram substituídos?
2. **Limpe o cache do navegador** (muito importante!)
3. **Teste em modo anônimo/privado** para verificar

---

**LIMPE O CACHE DO NAVEGADOR AGORA!** 🚀

