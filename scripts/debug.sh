#!/bin/bash

# Скрипт для отладки проекта
set -e

echo "🔍 Отладочная информация проекта Reki"
echo "======================================"

# Проверка статуса Docker контейнеров
echo "🐳 Статус Docker контейнеров:"
docker-compose ps

echo ""
echo "📊 Использование ресурсов Docker:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "🔌 Проверка портов:"
echo "PostgreSQL (5432):"
nc -z localhost 5432 && echo "✅ Доступен" || echo "❌ Недоступен"
echo "Adminer (8080):"
nc -z localhost 8080 && echo "✅ Доступен" || echo "❌ Недоступен"

echo ""
echo "📦 Node.js процессы:"
ps aux | grep -E "(node|npm)" | grep -v grep || echo "Нет активных Node.js процессов"

echo ""
echo "💾 Использование диска:"
df -h | head -1
df -h | grep -E "/$|/Users"

echo ""
echo "🔧 Версии инструментов:"
echo "Node.js: $(node --version 2>/dev/null || echo 'Не установлен')"
echo "npm: $(npm --version 2>/dev/null || echo 'Не установлен')"
echo "Docker: $(docker --version 2>/dev/null || echo 'Не установлен')"
echo "Docker Compose: $(docker-compose --version 2>/dev/null || echo 'Не установлен')"
