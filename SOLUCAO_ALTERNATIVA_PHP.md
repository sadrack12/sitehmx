# ✅ Solução Alternativa: Usar PHP para Redirect

## 🔧 Se o .htaccess Não Funcionar

Se mesmo com o `.htaccess` correto ainda não funcionar, podemos criar um arquivo PHP que faz o redirect.

---

## ✅ Solução: Criar index.php na Pasta login/

### Passo a Passo no cPanel:

1. **No File Manager, vá até `public_html/gestao/`**
2. **Crie uma pasta chamada `login/`** (se não existir)
3. **Dentro de `login/`, crie um arquivo chamado `index.php`**
4. **Cole este conteúdo:**

```php
<?php
// Redirect permanente para login.html
header("Location: /gestao/login.html", true, 301);
exit;
```

5. **Salve o arquivo**
6. **Defina permissões:** `644` para o arquivo

---

## ✅ Como Funciona

- Quando alguém acessa `/gestao/login/`, o servidor procura por `index.php`
- O PHP faz um redirect 301 (permanente) para `/gestao/login.html`
- O navegador carrega o arquivo HTML corretamente

---

## ⚠️ Limitação

Esta solução só funciona se acessarem `/gestao/login/` (com barra final).

Para `/gestao/login` (sem barra), ainda precisamos do `.htaccess`.

---

## ✅ Solução Híbrida: .htaccess + PHP

### 1. Mantenha o .htaccess atualizado

### 2. Crie também o `index.php` como backup

Assim funciona em ambos os casos:
- `/gestao/login` → .htaccess redireciona
- `/gestao/login/` → index.php redireciona

---

## 📋 Checklist

- [ ] Criou pasta `public_html/gestao/login/`
- [ ] Criou arquivo `public_html/gestao/login/index.php`
- [ ] Colou o código PHP acima
- [ ] Salvou o arquivo
- [ ] Testou: `https://clamatec.com/gestao/login/`

---

## 💡 Vantagens desta Solução

- ✅ Funciona mesmo se `.htaccess` tiver problemas
- ✅ Compatível com qualquer servidor
- ✅ Redirect permanente (SEO-friendly)
- ✅ Funciona imediatamente, sem configuração extra

---

## 🚨 Desvantagem

- ❌ Precisa criar um arquivo extra
- ❌ Não é tão "limpo" quanto usar apenas `.htaccess`

Mas **funciona!** 🎯

