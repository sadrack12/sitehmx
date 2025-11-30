# 🔧 Solução: Rota /gestao/login não funciona

## ❌ Problema

Apenas a rota `/gestao/login` não está funcionando, enquanto outras rotas funcionam normalmente.

## ✅ Solução 1: Verificar se o arquivo existe no servidor

No cPanel File Manager:

1. Vá até `public_html/gestao/`
2. Verifique se o arquivo `login.html` existe
3. Se não existir, faça upload novamente

## ✅ Solução 2: Testar acesso direto

Tente acessar diretamente:
```
https://clamatec.com/gestao/login.html
```

- **Se funcionar:** O problema é o `.htaccess` não está redirecionando corretamente
- **Se não funcionar:** O arquivo não foi feito upload ou está em lugar errado

## ✅ Solução 3: Verificar se há conflito com a API

Se você tem uma rota `/api/` configurada, pode estar interferindo. Verifique o `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Permitir acesso direto a arquivos existentes
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # IMPORTANTE: Não reescrever requisições para a API (backend Laravel)
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]

  # Não reescrever assets do Next.js
  RewriteCond %{REQUEST_URI} ^/_next/
  RewriteRule ^ - [L]

  # Tentar adicionar .html à URL se o arquivo existir
  # IMPORTANTE: Verificar se o arquivo existe ANTES de tentar
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.+)$ $1.html [L]

  # Se não encontrou arquivo .html, redirecionar para index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

## ✅ Solução 4: Adicionar regra específica para login

Se as outras soluções não funcionarem, adicione uma regra específica no `.htaccess`:

```apache
# Regra específica para login
RewriteRule ^gestao/login$ /gestao/login.html [L]

# Depois as outras regras...
```

## ✅ Solução 5: Verificar permissões

No cPanel, verifique as permissões:

1. Arquivo `gestao/login.html`: deve ser `644`
2. Pasta `gestao/`: deve ser `755`

Para corrigir via SSH:
```bash
cd ~/public_html
chmod 644 gestao/login.html
chmod 755 gestao/
```

## ✅ Solução 6: Refazer upload do arquivo específico

1. No seu computador, localize: `frontend/out/gestao/login.html`
2. Faça upload apenas deste arquivo para `public_html/gestao/login.html`
3. Verifique permissões: `644`

## 🔍 Diagnóstico

### Teste 1: Verificar arquivo
No File Manager do cPanel, confirme que existe:
- `public_html/gestao/login.html` ✅

### Teste 2: Acessar diretamente
```
https://clamatec.com/gestao/login.html
```
Deve mostrar a página de login.

### Teste 3: Verificar estrutura
```
public_html/
├── gestao/
│   ├── login.html      ← Deve existir!
│   ├── dashboard.html
│   └── ...
```

## 📋 Checklist

- [ ] Arquivo `gestao/login.html` existe em `public_html/`
- [ ] Permissões corretas: arquivo `644`, pasta `755`
- [ ] Testou acessar `https://clamatec.com/gestao/login.html` diretamente
- [ ] `.htaccess` está configurado corretamente
- [ ] Não há conflito com rotas da API

## 🚨 Se nada funcionar

1. **Delete o arquivo atual:**
   - Delete `public_html/gestao/login.html`

2. **Refaça upload:**
   - Faça upload novamente de `frontend/out/gestao/login.html`
   - Verifique permissões: `644`

3. **Teste novamente:**
   ```
   https://clamatec.com/gestao/login
   ```

