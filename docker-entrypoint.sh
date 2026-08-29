#!/bin/sh
set -e

if [ ! -f .env ] && [ -f .env.example ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    php artisan key:generate --force
fi

if [ ! -d vendor ] || [ ! -f vendor/autoload.php ]; then
    echo "Installing composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs
fi

exec "$@"
