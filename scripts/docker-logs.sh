#!/bin/bash

# Script para ver logs do Docker
# Uso: ./scripts/docker-logs.sh [serviço]

set -e

SERVICE=${1:-""}

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -z "$SERVICE" ]; then
    echo "📋 Logs de todos os serviços:"
    echo "=============================="
    docker-compose logs -f
else
    echo "📋 Logs do serviço: $SERVICE"
    echo "=============================="
    docker-compose logs -f "$SERVICE"
fi

