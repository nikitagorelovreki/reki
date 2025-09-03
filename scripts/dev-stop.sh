#!/bin/bash

# Скрипт для остановки всех сервисов
set -e

echo "🛑 Остановка всех сервисов..."

# Остановка Node.js процессов
echo "📱 Остановка Node.js сервисов..."
pkill -f "turbo run dev" || true
pkill -f "npm run dev" || true
pkill -f "node.*dist" || true

# Остановка Docker контейнеров
echo "🐳 Остановка Docker контейнеров..."
docker-compose down

echo "✅ Все сервисы остановлены!"
