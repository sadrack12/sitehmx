#!/bin/bash

# Script para executar comandos Artisan no container
# Uso: ./scripts/docker-artisan.sh [comando]
# Exemplo: ./scripts/docker-artisan.sh migrate

set -e

COMMAND=${1:-"list"}

echo "🔧 Executando: php artisan $COMMAND"
echo "===================================="

docker-compose exec backend php artisan "$COMMAND"

