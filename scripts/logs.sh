#!/bin/bash

# Скрипт для просмотра логов сервисов
set -e

if [ $# -eq 0 ]; then
    echo "Использование: ./logs.sh <service-name> [lines]"
    echo "Доступные сервисы:"
    echo "  db       - PostgreSQL логи"
    echo "  adminer  - Adminer логи"
    echo "  all      - Все Docker логи"
    echo "Количество строк по умолчанию: 100"
    exit 1
fi

SERVICE=$1
LINES=${2:-100}

case $SERVICE in
    "db")
        echo "📊 Логи PostgreSQL (последние $LINES строк):"
        docker-compose logs --tail=$LINES db
        ;;
    "adminer")
        echo "📊 Логи Adminer (последние $LINES строк):"
        docker-compose logs --tail=$LINES adminer
        ;;
    "all")
        echo "📊 Все Docker логи (последние $LINES строк):"
        docker-compose logs --tail=$LINES
        ;;
    *)
        echo "❌ Неизвестный сервис: $SERVICE"
        echo "Доступные сервисы: db, adminer, all"
        exit 1
        ;;
esac
