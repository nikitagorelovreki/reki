#!/bin/bash

# Скрипт для запуска Core Server
set -e

echo "🚀 Запуск Core Server..."

# Проверка готовности базы данных
echo "🔍 Проверка базы данных..."
if ! docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "⚠️  База данных не готова. Запуск Docker контейнеров..."
    docker-compose up -d
    echo "⏳ Ожидание готовности базы данных..."
    sleep 5
fi

# Запуск Core Server
echo "🔧 Запуск Core Server..."
npm run core:dev

echo "✅ Core Server запущен!"
echo "🌐 API доступен на: http://localhost:3002"
echo "📚 Документация: http://localhost:3002/api/docs"
