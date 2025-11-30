# 🌐 Como Ver o Host/Domínio no cPanel

## 🔍 Métodos para Descobrir seu Domínio

---

## 🎯 Método 1: No cPanel (Mais Fácil)

### 1.1 Ver no Topo do cPanel

1. **Acesse o cPanel**
2. **Veja no canto superior direito** - geralmente mostra seu domínio ou username
3. Ou procure por **"Account Information"** ou **"Account Details"**

### 1.2 Ver em Domains

1. No cPanel, procure por **"Domains"** ou **"Domain Manager"**
2. Clique em **"Domains"**
3. Você verá uma lista com todos os domínios configurados
4. O domínio principal geralmente está marcado como **"Primary Domain"**

### 1.3 Ver em Stats

1. No cPanel, procure por **"Stats"** ou **"Metrics"**
2. Veja a seção **"Domain Information"**
3. O domínio principal estará listado lá

---

## 🎯 Método 2: Via Terminal/SSH

### 2.1 Ver Variáveis de Ambiente

```bash
# Ver domínio principal
echo $HOSTNAME

# Ver informações do sistema
hostname -f

# Ver domínio do servidor
hostname
```

### 2.2 Ver Configurações do Apache/Nginx

```bash
# Ver configurações do Apache
cat /etc/httpd/conf/httpd.conf | grep ServerName

# OU
grep -r "ServerName" /etc/httpd/conf/
```

### 2.3 Ver em Arquivos do cPanel

```bash
# Ver domínio principal do usuário
cat ~/.cpanel/datastore/_main_domain

# OU
cat ~/etc/userdatadomains 2>/dev/null | grep -v "^#" | head -5
```

---

## 🎯 Método 3: Ver no File Manager

1. No cPanel, abra **File Manager**
2. Veja a barra de endereço - geralmente mostra o caminho
3. O domínio está na URL

---

## 🎯 Método 4: Ver Variáveis do cPanel

```bash
# Ver informações da conta
/usr/local/cpanel/bin/whmapi1 accountsummary user=seu_usuario | grep domain

# OU mais simples
cat ~/.cpanel/contactinfo | grep domain 2>/dev/null
```

---

## 🎯 Método 5: Ver em public_html

```bash
# Ir para public_html
cd ~/public_html

# Ver configurações
ls -la

# Ver se há arquivo de configuração
cat .htaccess 2>/dev/null | grep -i domain
```

---

## 📝 Para Configurar no .env

Depois de descobrir seu domínio, configure no `.env`:

```env
APP_URL=https://seu-dominio.com/api
FRONTEND_URL=https://seu-dominio.com
SANCTUM_STATEFUL_DOMAINS=seu-dominio.com
```

---

## 🔍 Exemplos de Como Pode Aparecer

- `seudominio.com`
- `www.seudominio.com`
- `site.com.br`
- `meusite.com`

**O importante é usar o domínio principal configurado no cPanel!**

---

## ✅ Método Mais Rápido

Execute no terminal:

```bash
# Tentar vários métodos
echo "=== Método 1 ==="
cat ~/.cpanel/datastore/_main_domain 2>/dev/null

echo ""
echo "=== Método 2 ==="
hostname -f

echo ""
echo "=== Método 3 ==="
echo $HOSTNAME
```

---

**O método mais fácil é ver no cPanel → Domains!** ✅

