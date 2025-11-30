# 🔍 Verificar e Criar .env

## ⚠️ Arquivos .env são OCULTOS!

Arquivos que começam com ponto (`.`) são ocultos no Linux. Use `ls -a` para vê-los.

---

## 🔍 Verificar se .env Existe

```bash
# Listar TODOS os arquivos (incluindo ocultos)
ls -la | grep .env

# OU verificar diretamente
ls -la .env

# Se existir, você verá algo como:
# -rw-r--r-- 1 usuario usuario 1234 data .env
```

---

## ✅ Criar .env se Não Existir

```bash
# Verificar se existe
if [ -f .env ]; then
    echo "✅ Arquivo .env existe!"
    ls -la .env
else
    echo "❌ Arquivo .env não existe. Criando..."
    
    # Criar a partir do .env.example se existir
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Copiado de .env.example"
    else
        # Criar arquivo .env básico
        touch .env
        echo "✅ Arquivo .env criado (vazio)"
    fi
    
    # Verificar que foi criado
    ls -la .env
fi
```

---

## 📝 Criar .env Manualmente

Se preferir criar manualmente:

```bash
# Criar arquivo .env
cat > .env << 'EOF'
APP_NAME="Hospital Geral do Moxico"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seudominio.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

FRONTEND_URL=https://seudominio.com
SANCTUM_STATEFUL_DOMAINS=seudominio.com
EOF

# Verificar que foi criado
ls -la .env
cat .env
```

---

## 🔍 Ver Conteúdo do .env

```bash
# Ver conteúdo do arquivo
cat .env

# OU usar less (melhor para arquivos grandes)
less .env
# Para sair: pressione 'q'
```

---

## 📝 Editar .env

```bash
# Editar com nano
nano .env

# OU editar com vi
vi .env

# Para ver arquivos ocultos no File Manager do cPanel:
# Ative "Show Hidden Files" nas configurações
```

---

**Execute: `ls -la | grep .env` para ver se o arquivo existe!** ✅

