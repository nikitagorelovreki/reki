#!/bin/bash

# Скрипт для запуска только базы данных и Adminer
set -e

echo "🚀 Запуск базы данных..."

# Запуск Docker контейнеров
echo "🐳 Запуск PostgreSQL и Adminer..."
docker-compose up -d

# Ожидание готовности базы данных
echo "⏳ Ожидание готовности базы данных..."
sleep 5

# Проверка подключения
if docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "✅ База данных запущена и готова к работе!"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo "📊 Adminer: http://localhost:8080"
else
    echo "❌ Ошибка при запуске базы данных"
    exit 1
fi
