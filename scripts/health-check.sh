#!/bin/bash

# Скрипт для проверки здоровья всех сервисов
set -e

echo "🏥 Проверка здоровья сервисов Reki"
echo "=================================="

# Функция для проверки HTTP эндпоинта
check_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        echo "✅ $name: Доступен"
        return 0
    else
        echo "❌ $name: Недоступен"
        return 1
    fi
}

# Проверка базы данных
echo "🗄️  Проверка базы данных:"
if docker-compose exec -T db pg_isready -U reki > /dev/null 2>&1; then
    echo "✅ PostgreSQL: Готов к работе"
else
    echo "❌ PostgreSQL: Недоступен"
fi

# Проверка Adminer
echo ""
echo "🔧 Проверка Adminer:"
check_endpoint "http://localhost:8080" "Adminer"

# Проверка файловой системы
echo ""
echo "📁 Проверка файловой системы:"
if [ -d "packages" ]; then
    echo "✅ Директория packages существует"
else
    echo "❌ Директория packages не найдена"
fi

if [ -f "package.json" ]; then
    echo "✅ Корневой package.json найден"
else
    echo "❌ Корневой package.json не найден"
fi

# Проверка зависимостей
echo ""
echo "📦 Проверка зависимостей:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules установлены"
else
    echo "❌ node_modules не найдены - выполните npm install"
fi

echo ""
echo "🔍 Сводка проверки завершена"
