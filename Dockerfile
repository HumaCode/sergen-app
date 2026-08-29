FROM dunglas/frankenphp:latest-php8.3

# Set working directory
WORKDIR /var/www/html

# Install system dependencies & Node.js 22.x
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required for Laravel, Spatie Media Library & Redis
RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    zip \
    opcache \
    redis

# Configure PHP upload limits & memory limit for Spatie Media Library
RUN echo "upload_max_filesize = 32M" > /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size = 32M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

# Expose App Port and Vite Dev Port
EXPOSE 8000 5178

CMD ["frankenphp", "php-server", "--root", "public/", "--listen", "0.0.0.0:8000"]
