#!/usr/bin/env bash
# Render build script for Laravel backend
set -o errexit

echo "--> Installing PHP dependencies"
composer install --no-dev --optimize-autoloader --no-interaction

echo "--> Caching Laravel config/routes/views"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "--> Creating storage symlink"
php artisan storage:link || true

echo "--> Build complete"
