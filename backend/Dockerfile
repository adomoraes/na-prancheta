# ==============================================================================
# ⚽ Na Prancheta — Dockerfile de Produção (Laravel 11 API)
# ==============================================================================

# Estágio 1: Instalação das dependências PHP via Composer
FROM composer:2 AS composer_stage
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts \
    --ignore-platform-req=ext-bcmath

# Estágio 2: Runtime PHP 8.2-FPM + Nginx em Alpine Linux
FROM php:8.2-fpm-alpine

# Dependências do sistema e extensões PHP necessárias para PostgreSQL e Laravel
RUN apk add --no-cache \
    nginx \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql opcache bcmath zip

WORKDIR /var/www/html

# Copia configurações personalizadas do Nginx, PHP e Supervisord
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-custom.ini
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copia código da aplicação e pacotes instalados pelo Composer
COPY . /var/www/html
COPY --from=composer_stage /app/vendor /var/www/html/vendor

# Cria pastas do framework e define permissões para www-data
RUN mkdir -p \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
