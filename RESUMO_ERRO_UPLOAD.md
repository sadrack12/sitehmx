# 🔧 Solução Rápida: Erro HTTP 500 no Upload do cPanel

## ❌ Problema

Você está tentando fazer upload de arquivos no cPanel e recebe:
> "The upload failed. The server indicated HTTP error 500 ()"

## ✅ Soluções Imediatas

### 🥇 Solução 1: Use FTP/SFTP (Mais Rápido)

**O File Manager do cPanel tem limites.** Use FTP/SFTP:

1. **Baixe um cliente FTP:**
   - FileZilla (grátis): https://filezilla-project.org/
   - WinSCP (Windows): https://winscp.net/

2. **Conecte ao servidor:**
   - Host: `ftp.seudominio.com` ou IP do servidor
   - Usuário: seu usuário do cPanel
   - Senha: sua senha do cPanel
   - Porta: 21 (FTP) ou 22 (SFTP - mais seguro)

3. **Faça upload normalmente** - é muito mais estável!

---

### 🥈 Solução 2: NÃO Faça Upload de `vendor/`

A pasta `vendor/` do Laravel pode ter **centenas de MB**. 

**❌ NÃO faça upload dela!**

**✅ Instale no servidor:**

1. Faça upload apenas da estrutura básica (sem `vendor/`)
2. No Terminal do cPanel:
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev
   ```

Muito mais rápido e confiável!

---

### 🥉 Solução 3: Compacte em ZIP

Se ainda assim tiver problemas:

1. **Compacte localmente:**
   ```bash
   cd backend
   zip -r backend.zip . -x "vendor/*" ".git/*" ".env"
   ```

2. **Faça upload do ZIP** (arquivo único é mais fácil)

3. **Extraia no servidor:**
   - Via File Manager: Clique com botão direito → Extract
   - Ou via Terminal: `unzip backend.zip`

---

## 🎯 Estratégia Recomendada

### Para Backend:

```
✅ Faça upload de:
   - app/
   - bootstrap/
   - config/
   - database/
   - routes/
   - public/
   - composer.json
   - composer.lock
   - artisan

❌ NÃO faça upload de:
   - vendor/ ← Instale no servidor
   - .env ← Crie manualmente no servidor
   - .git/
```

Depois no servidor:
```bash
cd ~/public_html/api
composer install --optimize-autoloader --no-dev
```

### Para Frontend:

Se usar build estático:
- Compacte a pasta `out/` em ZIP
- Faça upload do ZIP
- Extraia no servidor

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- **`SOLUCAO_UPLOAD_CPANEL.md`** - Guia completo com todas as soluções
- **`DEPLOY_CPANEL.md`** - Guia completo de deploy

---

## 💡 Dica Final

**A maneira mais confiável é:**
1. Fazer upload apenas dos arquivos essenciais
2. Instalar dependências diretamente no servidor via Terminal/SSH
3. Usar FTP/SFTP para arquivos grandes

Isso evita 99% dos problemas de upload! 🚀

