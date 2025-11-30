# 🔧 Criar .htaccess no Servidor

## ⚠️ Problema

O arquivo `.htaccess` não está visível (é um arquivo oculto que começa com ponto).

---

## ✅ SOLUÇÃO: Criar Diretamente no Servidor

### Opção 1: Via cPanel File Manager

1. **Acesse:** cPanel → File Manager
2. **Vá em:** `public_html/`
3. **Clique em:** "New File" (ou "Criar Arquivo")
4. **Nome do arquivo:** `.htaccess` (com o ponto no início!)
5. **Cole o conteúdo abaixo:**

```apache
RewriteEngine On
RewriteBase /

# REGRA ESPECÍFICA PARA LOGIN (PRIMEIRA - MÁXIMA PRIORIDADE)
RewriteRule ^gestao/login/?$ /gestao/login.html [L,R=301]

# Não tocar na API
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^ - [L]

# Se arquivo existe, servir diretamente
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Se diretório existe, servir diretamente
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Não tocar em assets do Next.js
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^ - [L]

# Tentar adicionar .html para outras rotas
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/_next/
RewriteCond %{REQUEST_URI} !^/gestao/login
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Fallback para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

6. **Salve o arquivo**

---

### Opção 2: Renomear Arquivo

1. **Faça upload de:** `frontend/out/htaccess.txt` (arquivo visível)
2. **No servidor, renomeie:** `htaccess.txt` → `.htaccess`

---

### Opção 3: Ativar "Mostrar Arquivos Ocultos"

1. **No File Manager, clique em:** "Settings" (Configurações)
2. **Marque:** "Show Hidden Files" (Mostrar arquivos ocultos)
3. **Salve**
4. **Agora você verá o arquivo `.htaccess` se ele existir**

---

## ⚠️ IMPORTANTE

**O nome do arquivo DEVE ser exatamente:** `.htaccess` (com o ponto no início!)

**NÃO pode ser:**
- ❌ `htaccess`
- ❌ `.htaccess.txt`
- ❌ `htaccess.txt`

**DEVE ser:**
- ✅ `.htaccess` (apenas isso!)

---

## ✅ Verificar Após Criar

**Teste:**

1. **Acesse:** `https://clamatec.com/gestao/login`
2. **Deve funcionar corretamente**

---

**Crie o arquivo `.htaccess` diretamente no servidor usando uma das opções acima!** 🚀

