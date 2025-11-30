# Guia de Verificação e Correção de Imagens no cPanel

## Problema: Imagens não aparecem após upload

### Passo 1: Verificar Estrutura no cPanel

Após fazer upload, verifique se a estrutura está assim:

```
public_html/
├── index.html
├── images/                    ← DEVE EXISTIR
│   ├── logo.jpeg
│   ├── governo.png
│   ├── 481337255_122150224724343844_4470774594386885664_n.jpg
│   └── ... (todas as outras imagens)
├── _next/
└── ...
```

### Passo 2: Verificar Permissões

No File Manager do cPanel ou via Terminal:

```bash
# Navegar até public_html
cd public_html

# Verificar permissões da pasta images
ls -la images/

# Corrigir permissões se necessário
chmod 755 images
chmod 644 images/*
```

### Passo 3: Testar Acesso Direto

No navegador, teste acessar diretamente:
- `https://seudominio.com/images/logo.jpeg`
- `https://seudominio.com/images/governo.png`

Se retornar 404, o problema é de estrutura de pastas.
Se retornar 403, o problema é de permissões.

### Passo 4: Verificar no DevTools

1. Abra o site no navegador
2. Pressione F12 para abrir DevTools
3. Vá na aba **Network**
4. Recarregue a página (F5)
5. Procure por requisições de imagens que falharam
6. Veja qual é o caminho que está sendo solicitado

### Passo 5: Possíveis Problemas e Soluções

#### Problema 1: Imagens retornam 404

**Causa:** Pasta `images/` não está no lugar correto

**Solução:**
- Verifique se você fez upload de `out/images/` para `public_html/images/`
- NÃO deve estar em `public_html/out/images/`

#### Problema 2: Imagens retornam 403

**Causa:** Permissões incorretas

**Solução:**
```bash
chmod 755 public_html/images
find public_html/images -type f -exec chmod 644 {} \;
```

#### Problema 3: Site está em subpasta (ex: `/site/`)

**Causa:** Caminhos absolutos não funcionam em subpastas

**Solução:** Configure `basePath` no `next.config.js` e refaça o build:

```js
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/site',  // ← Adicione esta linha se o site estiver em subpasta
  images: {
    unoptimized: true,
  },
  // ...
}
```

Depois refaça o build:
```bash
npm run build
```

#### Problema 4: Imagens não foram enviadas

**Causa:** Upload incompleto

**Solução:**
1. Verifique se TODAS as imagens estão na pasta `out/images/`
2. Faça upload novamente de TODA a pasta `images/`
3. Certifique-se de que nenhuma imagem foi esquecida

### Passo 6: Checklist Final

- [ ] Pasta `images/` existe em `public_html/images/`
- [ ] Todas as imagens estão na pasta `images/`
- [ ] Permissões estão corretas (755 para pasta, 644 para arquivos)
- [ ] Teste de acesso direto funciona (ex: `seudominio.com/images/logo.jpeg`)
- [ ] DevTools não mostra erros 404 ou 403 para imagens
- [ ] Se site está em subpasta, `basePath` está configurado

### Passo 7: Se Nada Funcionar

Se após todas as verificações as imagens ainda não aparecem:

1. **Verifique o console do navegador** (F12 → Console) para erros JavaScript
2. **Verifique a aba Network** para ver exatamente qual URL está sendo solicitada
3. **Teste com uma imagem simples**: Crie um arquivo `test.jpg` e coloque em `public_html/images/test.jpg`, depois acesse `seudominio.com/images/test.jpg`
4. **Verifique se há arquivo `.htaccess`** que possa estar bloqueando acesso a imagens

### Informações para Debug

Se precisar de ajuda, forneça:
1. URL exata do site
2. Screenshot do erro no DevTools (aba Network)
3. Estrutura de pastas no cPanel (screenshot)
4. Resultado do teste de acesso direto à imagem

