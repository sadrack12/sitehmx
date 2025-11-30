FROM php:8.2-cli

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY . .

# Instalar dependências (sem --no-dev para desenvolvimento)
# Pular scripts durante o build para evitar erros sem .env
RUN composer install --no-scripts

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 8000

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD php artisan serve --host=0.0.0.0 --port=8000

