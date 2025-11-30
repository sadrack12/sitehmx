# 🧹 Como Limpar localStorage

## ✅ Método 1: Via Interface (Mais Fácil)

1. **Pressione F12** para abrir as DevTools
2. **Vá na aba "Application"** (ou "Armazenamento" no Firefox)
3. No menu lateral esquerdo, expanda **"Local Storage"**
4. Clique em **`https://clamatec.com`**
5. **Selecione os itens** `token` e `user` (se existirem)
6. **Pressione Delete** no teclado ou clique com botão direito → "Delete"
7. **Recarregue a página** (F5 ou Ctrl+R)

---

## ✅ Método 2: Via Console (Digite Manualmente)

**⚠️ ATENÇÃO:** Digite SEM ponto após "local"

1. **Pressione F12**
2. **Vá na aba "Console"**
3. Digite exatamente (copie e cole se preferir):
   ```
   localStorage.clear()
   ```
4. **Pressione Enter**
5. Digite:
   ```
   location.reload()
   ```
6. **Pressione Enter**

---

## ❌ ERRO COMUM

**ERRADO:** `local.Storage.clear()` ❌  
**CORRETO:** `localStorage.clear()` ✅

Sem ponto após "local"!

---

## 📋 Checklist

- [ ] Abri o Console (F12)
- [ ] Limpei o localStorage (método 1 ou 2)
- [ ] Recarreguei a página
- [ ] Testei o login novamente

---

**Agora tente novamente!** 🚀

