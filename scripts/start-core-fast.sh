#!/bin/bash

# Скрипт для быстрого запуска Core Server без проверок
set -e

echo "🚀 Быстрый запуск Core Server..."

# Проверка готовности базы данных
echo "🔍 Проверка базы данных..."
if ! docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "⚠️  База данных не готова. Запуск Docker контейнеров..."
    docker-compose up -d
    echo "⏳ Ожидание готовности базы данных..."
    sleep 3
fi

# Быстрый запуск Core Server
echo "🔧 Запуск Core Server..."
TURBO_FORCE=true npm run core:dev

echo "✅ Core Server запущен!"
echo "🌐 API доступен на: http://localhost:3002"
