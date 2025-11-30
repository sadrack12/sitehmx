# Solução para o Problema do Backend Laravel

## Problema Identificado

O container do backend está em loop de reinicialização devido ao erro:
```
Target class [files] does not exist
```

Este erro ocorre quando o Laravel Sanctum tenta resolver um serviço que não está configurado corretamente.

## Solução Manual

Execute os seguintes comandos para resolver:

### 1. Pare os containers
```bash
cd /Users/sadraquemassala/sitehmx
docker-compose down
```

### 2. Acesse o container do backend (sem iniciar via docker-compose)
```bash
docker run -it --rm \
  -v $(pwd)/backend:/var/www/html \
  -w /var/www/html \
  php:8.2-cli bash
```

### 3. Dentro do container, execute:
```bash
# Instalar Composer se necessário
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Instalar dependências
composer install --no-scripts

# Criar .env
cp .env.example .env

# Gerar chave
php artisan key:generate

# Limpar cache
php artisan config:clear
php artisan cache:clear

# Executar migrações (quando MySQL estiver rodando)
php artisan migrate
php artisan db:seed
```

### 4. Alternativa: Usar Laravel sem Sanctum temporariamente

Comente temporariamente o SanctumServiceProvider no `config/app.php`:

```php
// Laravel\Sanctum\SanctumServiceProvider::class,
```

Depois reinicie o container e adicione o Sanctum novamente quando tudo estiver funcionando.

## Status Atual

- ✅ Frontend Next.js: Funcionando
- ✅ MySQL: Funcionando  
- ⚠️ Backend Laravel: Precisa de configuração manual

## Próximos Passos

1. Resolver o problema do Sanctum seguindo os passos acima
2. Executar as migrações
3. Testar a API em http://localhost:8001/api
4. Acessar o frontend em http://localhost:3000

