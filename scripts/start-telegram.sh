#!/bin/bash

# Скрипт для запуска Telegram Bot
set -e

echo "🚀 Запуск Telegram Bot..."

# Проверка готовности базы данных
echo "🔍 Проверка базы данных..."
if ! docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "⚠️  База данных не готова. Запуск Docker контейнеров..."
    docker-compose up -d
    echo "⏳ Ожидание готовности базы данных..."
    sleep 5
fi

# Запуск Telegram Bot
echo "🤖 Запуск Telegram Bot..."
npm run telegram:dev

echo "✅ Telegram Bot запущен!"
echo "📱 Бот готов к работе"
