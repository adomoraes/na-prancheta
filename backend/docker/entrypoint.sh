#!/bin/sh
set -e

echo "⚽ [Na Prancheta] Inicializando Backend Laravel..."

# Blindagem: Sanitiza variáveis de ambiente e neutraliza qualquer injeção do host coolify-redis
export REDIS_HOST="127.0.0.1"
export REDIS_URL=""
if [ "$CACHE_STORE" = "redis" ] || [ "$CACHE_DRIVER" = "redis" ] || [ -z "$CACHE_STORE" ]; then
    export CACHE_STORE="database"
    export CACHE_DRIVER="database"
fi
if [ "$SESSION_DRIVER" = "redis" ] || [ -z "$SESSION_DRIVER" ]; then
    export SESSION_DRIVER="database"
fi
if [ "$QUEUE_CONNECTION" = "redis" ] || [ -z "$QUEUE_CONNECTION" ]; then
    export QUEUE_CONNECTION="database"
fi

# Garante permissões em tempo de execução
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Limpa manifests de pacotes cacheados para regenerar no ambiente atual
rm -f /var/www/html/bootstrap/cache/*.php
php artisan package:discover --ansi || true

# Otimizações de Cache do Laravel para Produção
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Otimizando caches de configuração e rotas..."
    php artisan config:clear || true
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Aguarda o banco de dados estar disponível e executa migrations
if [ -n "$DB_HOST" ]; then
    echo "🐘 Verificando conexão e aplicando migrations do banco de dados ($DB_HOST:$DB_PORT)..."
    retries=15
    until php artisan migrate --force > /dev/null 2>&1 || [ $retries -eq 0 ]; do
        echo "   Aguardando banco de dados responder... ($retries tentativas restantes)"
        retries=$((retries - 1))
        sleep 2
    done

    if [ $retries -eq 0 ]; then
        echo "⚠️  Aviso: Não foi possível executar migrations imediatamente. Verifique a conexão com o banco."
    else
        echo "✔ Migrations aplicadas com sucesso!"
        
        # Seed inicial se o banco estiver sem partidas cadastradas
        PARTIDA_COUNT=$(php artisan tinker --execute="echo App\\Models\\Partida::count();" 2>/dev/null || echo "1")
        if [ "$PARTIDA_COUNT" = "0" ]; then
            echo "🌱 Banco recém-criado: executando seeder com dados de teste/partida piloto..."
            php artisan db:seed --class=LegacyInitialDataSeeder --force || true
        fi

        # Seed de planos padrão caso a tabela de planos esteja vazia
        PLANO_COUNT=$(php artisan tinker --execute="echo App\\Models\\Plano::count();" 2>/dev/null || echo "1")
        if [ "$PLANO_COUNT" = "0" ]; then
            echo "💎 Catálogo de planos vazio: executando seeder de planos padrão (Amador, Campeão, Liga)..."
            php artisan db:seed --class=PlanosSeeder --force || true
        fi
    fi
fi

echo "🚀 Iniciando Nginx e PHP-FPM via Supervisord..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
