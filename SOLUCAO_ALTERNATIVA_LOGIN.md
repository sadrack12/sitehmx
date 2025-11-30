# 🔧 Solução Alternativa: .htaccess dentro da pasta gestao/

## ⚠️ Se o .htaccess principal não funcionar

Crie um `.htaccess` **dentro da pasta `gestao/`** para forçar o redirecionamento.

---

## ✅ Passo a Passo

### No cPanel File Manager:

1. **Navegue até `public_html/gestao/`**

2. **Crie um novo arquivo chamado `.htaccess`**

3. **Cole este conteúdo:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Redirecionar /gestao/login para login.html
  RewriteRule ^login/?$ login.html [L]
  
  # Para outras rotas, tentar adicionar .html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]
</IfModule>
```

4. **Salve o arquivo**

5. **Configure permissões: `644`**

---

## 🔍 Verificações Importantes

### 1. Verificar se o arquivo existe

No File Manager, confirme:
```
public_html/gestao/login.html
```
- Deve existir e ter aproximadamente 11KB

### 2. Verificar estrutura

```
public_html/
├── .htaccess          ← Arquivo principal (deve existir)
├── gestao/
│   ├── .htaccess     ← NOVO: Crie este arquivo!
│   ├── login.html    ← Deve existir!
│   └── ...
└── index.html
```

### 3. Testar acesso direto

Tente acessar:
```
https://clamatec.com/gestao/login.html
```

- **Se funcionar:** O arquivo existe, só precisa do `.htaccess`
- **Se não funcionar:** O arquivo não foi feito upload ou está em lugar errado

---

## 🚨 Se o arquivo login.html não existir no servidor

Você precisa fazer upload dele:

1. No seu computador, localize: `frontend/out/gestao/login.html`

2. Faça upload para: `public_html/gestao/login.html`

3. Configure permissões: `644`

---

## 📋 Checklist

- [ ] Arquivo `gestao/login.html` existe em `public_html/gestao/`
- [ ] Criei o arquivo `.htaccess` em `public_html/gestao/`
- [ ] Permissões do `.htaccess` estão em `644`
- [ ] Testei acessar `https://clamatec.com/gestao/login.html` diretamente
- [ ] Cache do navegador foi limpo
- [ ] Testei acessar `https://clamatec.com/gestao/login`

---

## 💡 Por que esta solução funciona?

Criando um `.htaccess` dentro da pasta `gestao/`, ele só afeta as rotas dentro dessa pasta. Isso evita conflitos com outras regras no `.htaccess` principal.

A regra é simples e direta:
```apache
RewriteRule ^login/?$ login.html [L]
```

Traduzindo: "Quando alguém acessar `/gestao/login`, mostre `login.html`".

---

## ✅ Após criar o .htaccess

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Acesse: `https://clamatec.com/gestao/login`
3. Deve funcionar! 🎉

