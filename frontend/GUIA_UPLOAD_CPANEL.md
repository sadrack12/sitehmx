# Guia de Upload para cPanel - Correção de Imagens

## Problema Resolvido ✅

O problema das imagens não abrirem foi corrigido adicionando `images: { unoptimized: true }` no `next.config.js`. Agora você precisa fazer um novo build e upload.

## Passos para Upload Correto

### 1. Fazer Novo Build (já feito)

```bash
cd frontend
npm run build
```

### 2. Upload para cPanel

**IMPORTANTE:** Você precisa fazer upload de **TODA** a pasta `out/` para o `public_html` do seu cPanel.

#### Opção A: Upload via File Manager do cPanel

1. Acesse o **File Manager** no cPanel
2. Navegue até `public_html`
3. **Delete tudo** que está lá (ou faça backup primeiro)
4. Faça upload de **TODOS** os arquivos e pastas da pasta `frontend/out/`:
   - `index.html`
   - `404.html`
   - Pasta `_next/` (completa)
   - Pasta `images/` (completa) ⚠️ **MUITO IMPORTANTE**
   - Pasta `gestao/` (completa)
   - Pasta `sobre/` (completa)
   - Pasta `documents/` (se existir)
   - Todos os outros arquivos `.html`

#### Opção B: Upload via FTP

1. Conecte-se via FTP ao seu servidor
2. Navegue até `public_html`
3. Faça upload de **TODA** a pasta `out/` mantendo a estrutura:
   ```
   public_html/
   ├── index.html
   ├── 404.html
   ├── _next/
   ├── images/          ← TODAS as imagens devem estar aqui
   ├── gestao/
   ├── sobre/
   └── ...
   ```

### 3. Verificar Estrutura de Pastas

Após o upload, a estrutura deve ficar assim:

```
public_html/
├── index.html
├── 404.html
├── _next/
│   └── static/
├── images/                    ← Deve conter todas as imagens
│   ├── logo.jpeg
│   ├── governo.png
│   ├── 481337255_122150224724343844_4470774594386885664_n.jpg
│   └── ... (todas as outras imagens)
├── gestao/
│   ├── admin/
│   ├── consultas/
│   └── ...
├── sobre/
└── ...
```

### 4. Verificar Permissões

Certifique-se de que as pastas têm permissão 755 e arquivos têm permissão 644:

```bash
# Via Terminal do cPanel ou SSH
chmod -R 755 public_html/images
chmod -R 644 public_html/images/*
```

### 5. Testar

1. Acesse seu site: `https://seudominio.com`
2. Verifique se as imagens aparecem:
   - Logo no topo
   - Imagens da galeria
   - Imagens dos eventos/notícias
   - Fotos do corpo diretivo

### 6. Se as Imagens Ainda Não Aparecerem

#### Verificar no Navegador (F12)

1. Abra o DevTools (F12)
2. Vá na aba **Network**
3. Recarregue a página
4. Procure por requisições de imagens que falharam (status 404)
5. Verifique o caminho que está sendo solicitado

#### Possíveis Problemas e Soluções

**Problema:** Imagens retornam 404
- **Solução:** Verifique se a pasta `images/` está em `public_html/images/` e não em `public_html/out/images/`

**Problema:** Caminhos começam com `/_next/image`
- **Solução:** Isso não deve acontecer mais com `unoptimized: true`, mas se acontecer, verifique se o `next.config.js` foi atualizado

**Problema:** Site está em subpasta (ex: `/site/`)
- **Solução:** Configure `basePath` no `next.config.js`:
  ```js
  basePath: '/site',
  ```

### 7. Arquivo .htaccess (Opcional)

Se você quiser garantir que os caminhos funcionem corretamente, crie um `.htaccess` na raiz do `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Redirecionar para index.html se arquivo não existir
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

## Checklist Final

- [ ] Build executado com sucesso (`npm run build`)
- [ ] Toda a pasta `out/` foi enviada para `public_html`
- [ ] Pasta `images/` está em `public_html/images/`
- [ ] Todas as imagens estão na pasta `images/`
- [ ] Permissões estão corretas (755 para pastas, 644 para arquivos)
- [ ] Site está acessível e imagens aparecem

## Nota Importante

Se você já fez upload anteriormente e as imagens não funcionavam, você precisa:
1. **Deletar tudo** do `public_html`
2. Fazer upload novamente de **TODA** a pasta `out/` (com o novo build que tem `unoptimized: true`)

