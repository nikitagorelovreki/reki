#!/bin/bash

# Скрипт для запуска Auth Server
set -e

echo "🚀 Запуск Auth Server..."

# Проверка готовности базы данных
echo "🔍 Проверка базы данных..."
if ! docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "⚠️  База данных не готова. Запуск Docker контейнеров..."
    docker-compose up -d
    echo "⏳ Ожидание готовности базы данных..."
    sleep 5
fi

# Запуск Auth Server
echo "🔐 Запуск Auth Server..."
npm run auth:dev

echo "✅ Auth Server запущен!"
echo "🌐 Сервер авторизации готов к работе"
