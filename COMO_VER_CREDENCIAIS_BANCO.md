# 🗄️ Como Ver Credenciais do Banco de Dados no cPanel

## 🔍 Encontrar Host, Usuário, Nome e Senha do MySQL

---

## 📍 Método 1: No cPanel (MySQL Databases)

### Passo 1: Acessar MySQL Databases

1. **Acesse o cPanel**
2. Procure e clique em **"MySQL Databases"** ou **"MySQL Database Wizard"**
3. Você verá uma página com seus bancos de dados

### Passo 2: Ver Informações do Banco

Na página "MySQL Databases", você verá:

#### Seção "Current Databases"
- Lista todos os bancos de dados criados
- Mostra o **nome completo** (geralmente: `usuario_cpanel_nome_banco`)

#### Seção "Current Users"
- Lista todos os usuários MySQL criados
- Mostra o **nome completo** (geralmente: `usuario_cpanel_nome_user`)

#### Seção "Add User To Database"
- Mostra quais usuários têm acesso a quais bancos

### Passo 3: Ver Informações Completas

**Host do Banco:**
- Geralmente é: `localhost`
- Ou: `127.0.0.1`

**Porta:**
- Geralmente é: `3306` (padrão MySQL)

**Nome do Banco:**
- Você verá na lista "Current Databases"
- **IMPORTANTE:** Use o nome COMPLETO (com prefixo do usuário cPanel)

**Usuário:**
- Você verá na lista "Current Users"
- **IMPORTANTE:** Use o nome COMPLETO (com prefixo do usuário cPanel)

**Senha:**
- Você definiu quando criou o usuário
- Se esqueceu, você precisa **resetar a senha**
- Clique no usuário e escolha "Change Password"

---

## 📍 Método 2: Via Terminal/SSH

### Ver Bancos de Dados Criados

```bash
# Ver lista de bancos
mysql -u root -p -e "SHOW DATABASES;" 2>/dev/null || \
mysqlshow -u root -p 2>/dev/null || \
echo "Precisa verificar no cPanel"
```

### Ver Usuários MySQL

```bash
# Ver usuários
mysql -u root -p -e "SELECT User, Host FROM mysql.user;" 2>/dev/null || \
echo "Precisa verificar no cPanel"
```

---

## 📝 Informações Padrão do cPanel

### Host e Porta
```
DB_HOST=localhost
DB_PORT=3306
```

### Nome do Banco
- Formato: `usuario_cpanel_nome_banco`
- Exemplo: Se seu usuário cPanel é `ebvutbmy` e você criou `sitehmx_db`
- Nome completo: `ebvutbmy_sitehmx_db`

### Usuário
- Formato: `usuario_cpanel_nome_user`
- Exemplo: Se seu usuário cPanel é `ebvutbmy` e você criou `sitehmx_user`
- Nome completo: `ebvutbmy_sitehmx_user`

### Senha
- A senha que você definiu ao criar o usuário
- Se esqueceu, precisa resetar no cPanel

---

## 🎯 Como Encontrar no cPanel (Passo a Passo)

### 1. Encontrar Nome do Banco

1. cPanel → **MySQL Databases**
2. Na seção **"Current Databases"**
3. Você verá algo como:
   ```
   ebvutbmy_sitehmx_db
   ```
4. **Copie esse nome COMPLETO!**

### 2. Encontrar Usuário

1. Na mesma página, seção **"Current Users"**
2. Você verá algo como:
   ```
   ebvutbmy_sitehmx_user
   ```
3. **Copie esse nome COMPLETO!**

### 3. Ver/Resetar Senha

1. Na seção **"Current Users"**
2. Clique no usuário ou em **"Change Password"**
3. Se precisar, defina uma nova senha
4. **Anote a senha!**

### 4. Ver Host e Porta

- **Host:** `localhost` (sempre)
- **Porta:** `3306` (sempre)

---

## 📋 Exemplo de Configuração no .env

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=ebvutbmy_sitehmx_db
DB_USERNAME=ebvutbmy_sitehmx_user
DB_PASSWORD=sua_senha_aqui
```

**⚠️ IMPORTANTE:** Use os nomes COMPLETOS com o prefixo do usuário cPanel!

---

## 🔍 Verificar Credenciais no Terminal

Se você já tem as credenciais, teste a conexão:

```bash
# Testar conexão (substitua pelos seus valores)
mysql -h localhost -u seu_usuario_completo -pseu_banco_completo
```

---

## 📝 Comandos Úteis

```bash
# Ver qual é seu usuário cPanel (ajuda a descobrir o prefixo)
whoami

# Ver estrutura de pastas
ls -la ~ | head -10
```

---

## ✅ Checklist para Configurar .env

- [ ] Acessar cPanel → MySQL Databases
- [ ] Anotar nome COMPLETO do banco (da seção "Current Databases")
- [ ] Anotar nome COMPLETO do usuário (da seção "Current Users")
- [ ] Anotar/definir senha do usuário
- [ ] Usar Host: `localhost`
- [ ] Usar Porta: `3306`
- [ ] Configurar tudo no `.env`

---

**Acesse cPanel → MySQL Databases para ver todas as informações!** ✅

