#!/bin/bash

# Скрипт для сброса базы данных
set -e

echo "🗄️  Сброс базы данных..."

# Остановка и удаление контейнеров
echo "🛑 Остановка контейнеров..."
docker-compose down

# Удаление volume с данными
echo "🗑️  Удаление данных..."
docker volume rm reki_db_data 2>/dev/null || true

# Запуск контейнеров заново
echo "🚀 Запуск новых контейнеров..."
docker-compose up -d

# Ожидание готовности базы данных
echo "⏳ Ожидание готовности базы данных..."
sleep 10

# Проверка подключения
if docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "✅ База данных успешно сброшена и готова к работе!"
else
    echo "❌ Ошибка при сбросе базы данных"
    exit 1
fi
