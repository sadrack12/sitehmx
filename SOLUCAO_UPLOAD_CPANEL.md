# 🔧 Solução para Erro HTTP 500 ao Fazer Upload no cPanel

O erro "HTTP error 500" durante upload no cPanel geralmente é causado por limites de configuração. Aqui estão as soluções:

## 🎯 Soluções Rápidas

### Solução 1: Usar FTP/SFTP (Recomendado)

O File Manager do cPanel tem limitações. Use FTP/SFTP para arquivos grandes:

**1. Configurar cliente FTP:**

- **FileZilla** (Windows/Mac/Linux): https://filezilla-project.org/
- **WinSCP** (Windows): https://winscp.net/
- **Cyberduck** (Mac): https://cyberduck.io/

**2. Obter credenciais FTP:**

No cPanel:
- Acesse **FTP Accounts** ou **File Manager**
- Crie uma conta FTP ou use a principal
- Anote: Host, Usuário, Senha, Porta (geralmente 21 ou 22)

**3. Conectar via FTP:**

```
Host: ftp.seudominio.com ou IP do servidor
Usuário: seu_usuario_cpanel
Senha: sua_senha
Porta: 21 (FTP) ou 22 (SFTP - mais seguro)
```

**4. Upload via FTP:**

- Navegue até `public_html/api/` (backend)
- Navegue até `public_html/` (frontend)
- Arraste e solte os arquivos
- Mais estável para arquivos grandes

---

### Solução 2: Aumentar Limites do PHP

No cPanel, aumente os limites de upload:

**1. Via Select PHP Version:**

1. cPanel → **Select PHP Version**
2. Clique em **Options** ou **Extensions**
3. Procure por:
   - `upload_max_filesize` → Mude para `256M` ou `512M`
   - `post_max_size` → Mude para `256M` ou `512M`
   - `memory_limit` → Mude para `512M` ou `1024M`
   - `max_execution_time` → Mude para `300` ou `600`
   - `max_input_time` → Mude para `300` ou `600`
4. Clique em **Save**

**2. Ou via .htaccess:**

Crie/edite `.htaccess` na raiz do `public_html/`:

```apache
php_value upload_max_filesize 256M
php_value post_max_size 256M
php_value memory_limit 512M
php_value max_execution_time 600
php_value max_input_time 600
```

---

### Solução 3: Upload em Partes

Se os arquivos são muito grandes, faça upload em partes:

**Backend:**

1. **Primeira parte - Estrutura básica:**
   - `app/`
   - `bootstrap/`
   - `config/`
   - `database/`
   - `routes/`
   - `artisan`
   - `composer.json`
   - `composer.lock`

2. **Segunda parte - Dependências:**
   - `vendor/` (pode fazer upload compactado primeiro)
   - Ou instalar via Composer no servidor (veja Solução 4)

3. **Terceira parte - Resto:**
   - `public/`
   - `resources/`
   - `storage/` (apenas estrutura, sem logs)
   - Outros arquivos

**Frontend:**

1. Se usar build estático (`out/`):
   - Faça upload da pasta `out/` compactada (ZIP)
   - Extraia no servidor via File Manager ou Terminal

2. Se usar Node.js:
   - Faça upload dos arquivos pequenos primeiro
   - Instale dependências via `npm install` no servidor

---

### Solução 4: Instalar Dependências no Servidor (Melhor Opção)

Ao invés de fazer upload de `vendor/` e `node_modules/`, instale no servidor:

#### Backend - Instalar Composer no Servidor

**1. Via Terminal/SSH do cPanel:**

```bash
cd ~/public_html/api

# Se Composer não estiver instalado globalmente:
curl -sS https://getcomposer.org/installer | php
php composer.phar install --optimize-autoloader --no-dev
```

**2. Ou via cPanel Terminal:**

- Acesse **Terminal** no cPanel
- Navegue até o diretório
- Execute os comandos acima

**Vantagens:**
- ✅ Não precisa fazer upload de milhares de arquivos
- ✅ Mais rápido
- ✅ Evita problemas de timeout

#### Frontend - Instalar Node.js no Servidor

**1. Preparar arquivos localmente:**

Faça upload apenas de:
- `package.json`
- `package-lock.json`
- `next.config.js`
- `.next/` (se já fez build)
- `public/`
- `server.js` (se usar Node.js)

**2. No servidor via Terminal:**

```bash
cd ~/public_html
npm install --production
```

---

### Solução 5: Compactar e Extrair no Servidor

**1. Compactar localmente:**

```bash
# Backend (sem vendor/)
cd backend
zip -r backend.zip . -x "vendor/*" "node_modules/*" ".git/*" "*.log" ".env"

# Frontend - build estático
cd frontend/out
zip -r frontend.zip .

# Ou frontend - Node.js (sem node_modules)
cd frontend
zip -r frontend.zip . -x "node_modules/*" ".next/*" ".git/*"
```

**2. Upload do ZIP:**

- Upload via File Manager (arquivo único é mais fácil)
- Ou via FTP

**3. Extrair no servidor:**

- **Via File Manager:** Clique com botão direito → **Extract**
- **Via Terminal:**

```bash
cd ~/public_html/api
unzip backend.zip
rm backend.zip

# Para frontend
cd ~/public_html
unzip frontend.zip
rm frontend.zip
```

---

### Solução 6: Usar Git (Se Disponível)

Se o cPanel tem suporte a Git:

**1. No cPanel:**

- Acesse **Git Version Control**
- Clone seu repositório

**2. Ou via SSH:**

```bash
cd ~/public_html
git clone https://seu-repositorio.git .
```

**3. Instalar dependências:**

```bash
# Backend
cd ~/public_html/api
composer install --optimize-autoloader --no-dev

# Frontend
cd ~/public_html
npm install --production
```

---

## 🔍 Verificar Limites Atuais

Para ver quais são os limites atuais do seu servidor:

**Via Terminal/SSH:**

```bash
php -i | grep -E "upload_max_filesize|post_max_size|memory_limit|max_execution_time"
```

**Ou crie um arquivo `phpinfo.php`:**

```php
<?php phpinfo(); ?>
```

Acesse via navegador e procure pelas configurações.

---

## 📋 Checklist de Troubleshooting

Se ainda tiver problemas, verifique:

- [ ] **Tamanho dos arquivos:**
  - `vendor/` pode ter centenas de MB
  - Use Solução 4 (instalar no servidor)

- [ ] **Permissões:**
  - Pastas devem ter permissão 755
  - Arquivos devem ter permissão 644

- [ ] **Espaço em disco:**
  - Verifique espaço disponível no cPanel
  - Limpe arquivos temporários se necessário

- [ ] **Timeout:**
  - Arquivos muito grandes causam timeout
  - Use FTP ou instale dependências no servidor

- [ ] **Arquivos ocultos:**
  - Ative "Show Hidden Files" no File Manager
  - Verifique se `.env` não está sendo enviado

---

## 🎯 Estratégia Recomendada (Melhor Prática)

### Para Backend:

1. ✅ Fazer upload de estrutura básica (sem `vendor/`)
2. ✅ Criar `.env` manualmente no servidor
3. ✅ Instalar dependências via Composer no servidor:
   ```bash
   cd ~/public_html/api
   composer install --optimize-autoloader --no-dev
   ```

### Para Frontend (Estático):

1. ✅ Fazer build local
2. ✅ Compactar pasta `out/` em ZIP
3. ✅ Upload do ZIP via FTP
4. ✅ Extrair no servidor

### Para Frontend (Node.js):

1. ✅ Fazer build local
2. ✅ Upload de: `.next/`, `public/`, `package.json`, `next.config.js`, `server.js`
3. ✅ Instalar dependências no servidor:
   ```bash
   cd ~/public_html
   npm install --production
   ```

---

## 🚨 Se Nada Funcionar

1. **Contate o suporte da hospedagem:**
   - Eles podem aumentar limites temporariamente
   - Podem fazer upload direto via SSH

2. **Use serviços de staging:**
   - Faça deploy primeiro em um subdomínio de teste
   - Depois migre para produção

3. **Alternativa - VPS/Dedicated:**
   - Mais controle sobre configurações
   - Sem limitações do cPanel compartilhado

---

## 📞 Comandos Úteis

**Verificar espaço em disco:**
```bash
df -h
```

**Ver tamanho de pastas:**
```bash
du -sh ~/public_html/api/vendor
du -sh ~/public_html/api
```

**Limpar cache do Composer:**
```bash
composer clear-cache
```

**Limpar cache do npm:**
```bash
npm cache clean --force
```

---

## ✅ Resumo das Melhores Práticas

1. **NÃO faça upload de `vendor/`** → Instale via Composer no servidor
2. **NÃO faça upload de `node_modules/`** → Instale via npm no servidor
3. **Use FTP/SFTP** para arquivos grandes ao invés do File Manager
4. **Compacte arquivos** em ZIP antes de fazer upload
5. **Instale dependências no servidor** sempre que possível

---

**💡 Dica Final:** A maneira mais rápida e confiável é fazer upload apenas dos arquivos essenciais e instalar as dependências diretamente no servidor via Terminal/SSH.

