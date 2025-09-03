#!/bin/bash

# Скрипт для быстрого запуска Telegram Bot без проверок
set -e

echo "🚀 Быстрый запуск Telegram Bot..."

# Проверка готовности базы данных
echo "🔍 Проверка базы данных..."
if ! docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "⚠️  База данных не готова. Запуск Docker контейнеров..."
    docker-compose up -d
    echo "⏳ Ожидание готовности базы данных..."
    sleep 3
fi

# Быстрый запуск Telegram Bot
echo "🤖 Запуск Telegram Bot..."
TURBO_FORCE=true npm run telegram:dev

echo "✅ Telegram Bot запущен!"
