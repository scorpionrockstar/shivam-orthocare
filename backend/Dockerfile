FROM php:8.3-cli

# System deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps first (cached layer)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# App source
COPY . .

RUN composer dump-autoload --optimize --no-dev \
    && php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Storage perms
RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

# Render provides $PORT; fall back to 8000 locally
CMD php artisan config:cache \
    && php artisan route:cache \
    && php artisan storage:link || true \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
