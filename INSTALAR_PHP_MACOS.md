# 🍎 Instalar PHP e Composer no macOS

## 🚀 Opção 1: Homebrew (Recomendado)

### 1. Instalar Homebrew (se não tiver):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar PHP 8.1:

```bash
brew install php@8.1
```

### 3. Adicionar ao PATH:

```bash
echo 'export PATH="/opt/homebrew/opt/php@8.1/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php@8.1/sbin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 4. Instalar Composer:

```bash
brew install composer
```

### 5. Verificar instalação:

```bash
php -v
composer --version
```

---

## 🚀 Opção 2: XAMPP (Mais Simples)

### 1. Baixar XAMPP:

https://www.apachefriends.org/download.html

### 2. Instalar e iniciar:

- Abrir XAMPP Control Panel
- Iniciar Apache e MySQL

### 3. PHP já vem incluído:

```bash
/Applications/XAMPP/bin/php -v
```

### 4. Adicionar ao PATH:

```bash
echo 'export PATH="/Applications/XAMPP/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 5. Instalar Composer:

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

---

## ✅ Verificar

```bash
php -v        # Deve mostrar PHP 8.1+
composer -v   # Deve mostrar Composer
```

---

**Depois de instalar, execute: `./scripts/verificar-local.sh`**

