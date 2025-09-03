#!/bin/bash

# Скрипт для запуска отдельного сервиса
set -e

if [ $# -eq 0 ]; then
    echo "Использование: ./service-start.sh <service-name>"
    echo "Доступные сервисы:"
    echo "  core     - Core Server"
    echo "  app      - Control Panel"
    echo "  telegram - Telegram Bot"
    echo "  auth     - Auth Server"
    exit 1
fi

SERVICE=$1

case $SERVICE in
    "core")
        echo "🚀 Запуск Core Server..."
        npm run core:dev
        ;;
    "app")
        echo "🚀 Запуск Control Panel..."
        npm run app:dev
        ;;
    "telegram")
        echo "🚀 Запуск Telegram Bot..."
        npm run telegram:dev
        ;;
    "auth")
        echo "🚀 Запуск Auth Server..."
        npm run auth:dev
        ;;
    *)
        echo "❌ Неизвестный сервис: $SERVICE"
        echo "Доступные сервисы: core, app, telegram, auth"
        exit 1
        ;;
esac
