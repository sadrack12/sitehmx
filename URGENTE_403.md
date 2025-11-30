# 🚨 URGENTE: Erro 403 Forbidden - Correção

## ⚠️ O que significa

O servidor está bloqueando o acesso à pasta `api/`. Pode ser permissões ou configuração.

---

## ✅ SOLUÇÃO 1: Verificar Permissões (Primeiro)

### No cPanel File Manager:

1. **Vá em `public_html/api/`**
2. **Clique com botão direito em `.htaccess`** → "Change Permissions" (ou "Alterar Permissões")
3. **Marque:** `644` (ou digite: `0644`)
4. **Clique em "Change Permissions"**

### Também verifique:

- **Pasta `api/`:** Permissão `755`
- **Pasta `api/public/`:** Permissão `755`
- **Arquivo `api/public/index.php`:** Permissão `644`

---

## ✅ SOLUÇÃO 2: Modificar .htaccess

Se o erro persistir, modifique o `.htaccess` em `public_html/api/` para:

```apache
<IfModule mod_rewrite.c>
    Options +FollowSymLinks -Indexes
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**Salve e teste novamente.**

---

## ✅ SOLUÇÃO 3: Verificar Estrutura

Certifique-se que existe:

```
public_html/
└── api/
    ├── .htaccess (com permissão 644)
    └── public/
        ├── .htaccess (já existe)
        └── index.php (com permissão 644)
```

---

## 🧪 Testar

1. **Acesse:** `https://clamatec.com/api/`
2. **Se funcionar:** Deve aparecer mensagem do Laravel
3. **Se ainda der 403:** Continue com Solução 4

---

## ✅ SOLUÇÃO 4: Remover .htaccess Temporariamente

Se nada funcionar:

1. **Renomeie** o arquivo `.htaccess` em `api/` para `.htaccess.backup`
2. **Acesse:** `https://clamatec.com/api/public/`
3. **Se funcionar:** O problema é o `.htaccess`
4. **Restaure** e use o conteúdo da Solução 2

---

## 📋 Checklist

- [ ] Permissões corretas (arquivos: 644, pastas: 755)
- [ ] `.htaccess` com conteúdo correto
- [ ] Pasta `public/` existe
- [ ] Arquivo `public/index.php` existe

---

**Comece pela Solução 1 (permissões) e me diga o resultado!** 🚀

