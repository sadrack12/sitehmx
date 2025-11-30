# 🔧 SOLUÇÃO DEFINITIVA: Imagens Não Aparecem no cPanel

## ✅ O que já foi corrigido no código:
1. ✅ Adicionado `images: { unoptimized: true }` no `next.config.js`
2. ✅ Build executado com sucesso
3. ✅ Todas as 21 imagens estão na pasta `out/images/`

## 📋 CHECKLIST DE UPLOAD NO cPanel

### Passo 1: Verificar o que você fez upload

No cPanel File Manager, verifique se a estrutura está assim:

```
public_html/
├── index.html          ← Deve existir
├── images/             ← DEVE EXISTIR E CONTER 21 ARQUIVOS
│   ├── logo.jpeg
│   ├── governo.png
│   └── ... (19 outras imagens)
├── _next/              ← Deve existir
│   └── static/
├── gestao/             ← Deve existir
└── ... (outras pastas)
```

### Passo 2: Verificar se a pasta images está no lugar certo

❌ **ERRADO:**
```
public_html/
└── out/
    └── images/  ← ERRADO! Não deve estar dentro de "out"
```

✅ **CORRETO:**
```
public_html/
└── images/  ← CORRETO! Diretamente em public_html
```

### Passo 3: Verificar permissões

No File Manager do cPanel:
1. Clique com botão direito na pasta `images`
2. Selecione "Change Permissions"
3. Configure: **755** (rwxr-xr-x)
4. Clique em "Change Permissions"

Para os arquivos dentro de `images`:
1. Selecione todos os arquivos dentro de `images`
2. Clique com botão direito → "Change Permissions"
3. Configure: **644** (rw-r--r--)

### Passo 4: Teste de acesso direto

No navegador, teste acessar diretamente:
```
https://seudominio.com/images/logo.jpeg
```

- ✅ Se a imagem aparecer → O problema está no código HTML/JavaScript
- ❌ Se retornar 404 → Problema de estrutura de pastas
- ❌ Se retornar 403 → Problema de permissões

### Passo 5: Verificar no DevTools do Navegador

1. Abra o site: `https://seudominio.com`
2. Pressione **F12** para abrir DevTools
3. Vá na aba **Network**
4. Recarregue a página (F5)
5. Filtre por "Img" ou "images"
6. Veja quais imagens estão falhando

**O que procurar:**
- Status **404** → Imagem não encontrada (problema de estrutura)
- Status **403** → Acesso negado (problema de permissões)
- Status **200** mas imagem não aparece → Problema no código

### Passo 6: Solução Rápida - Reupload

Se nada funcionar, tente fazer upload novamente:

1. **Delete** a pasta `images` atual no cPanel (se existir)
2. **Crie** uma nova pasta chamada `images` em `public_html`
3. **Faça upload** de TODAS as 21 imagens da pasta `frontend/out/images/` para `public_html/images/`
4. **Configure permissões**: 755 para pasta, 644 para arquivos
5. **Teste** novamente

### Passo 7: Verificar lista completa de imagens

Certifique-se de que TODAS estas imagens estão em `public_html/images/`:

**Obrigatórias (7):**
- logo.jpeg
- governo.png
- director-geral.jpeg
- director-clinico.jpeg
- director-administrativo.jpeg
- directora-enfermagem.jpeg
- director-cientifico.jpeg

**Galeria (14):**
- 481337255_122150224724343844_4470774594386885664_n.jpg
- 553280666_122180093228343844_698813316423067076_n.jpg
- 555962522_122180552600343844_8952583627148606697_n.jpg
- 556115116_122180553740343844_285671433319500312_n.jpg
- 560106632_122182100900343844_2963057808023442406_n.jpg
- 561520774_122182101518343844_1723576736119237803_n.jpg
- 573508682_122184405284343844_8911212578133461837_n.jpg
- 577400924_122184958010343844_1454223572060094970_n.jpg
- 577535754_122184719738343844_5257761701614180172_n.jpg
- 578003869_122184957962343844_5690754979362345545_n.jpg
- 578006101_122184957872343844_7574823498328585283_n.jpg
- 578488802_122184915152343844_2298168834801400220_n.jpg
- 579450528_122184957920343844_677704214275117552_n.jpg

**Total: 21 imagens**

## 🚨 Problemas Comuns e Soluções

### Problema: "Imagens aparecem como quebradas (ícone de imagem quebrada)"

**Causa:** Caminho incorreto ou imagem não existe

**Solução:**
1. Verifique se a estrutura está correta (veja Passo 1)
2. Teste acesso direto (veja Passo 4)
3. Verifique permissões (veja Passo 3)

### Problema: "Algumas imagens aparecem, outras não"

**Causa:** Upload incompleto

**Solução:**
1. Compare a lista do Passo 7 com o que está no servidor
2. Faça upload das imagens que estão faltando

### Problema: "Nenhuma imagem aparece"

**Causa:** Pasta `images/` não existe ou está no lugar errado

**Solução:**
1. Verifique se `public_html/images/` existe
2. Se não existir, crie e faça upload de todas as imagens
3. Se existir mas estiver vazia, faça upload novamente

## 📞 Informações para Debug

Se ainda não funcionar, forneça estas informações:

1. **URL do site:** `https://...`
2. **Screenshot da estrutura de pastas** no cPanel File Manager
3. **Screenshot do DevTools** (aba Network) mostrando os erros
4. **Resultado do teste de acesso direto** (ex: `seudominio.com/images/logo.jpeg`)

## ✅ Checklist Final

Antes de pedir ajuda, verifique:

- [ ] Pasta `images/` existe em `public_html/images/` (não dentro de `out/`)
- [ ] Todas as 21 imagens estão na pasta `images/`
- [ ] Permissões: 755 para pasta, 644 para arquivos
- [ ] Teste de acesso direto funciona (ex: `seudominio.com/images/logo.jpeg`)
- [ ] DevTools não mostra erros 404 ou 403
- [ ] Estrutura está correta (veja Passo 1)

---

**Lembre-se:** O código já está correto. O problema está no upload ou na estrutura de pastas no cPanel.

