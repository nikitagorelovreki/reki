#!/bin/bash

# Import logger
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/shell-logger.sh"

# Initialize logger
init_logger "health-check"

# Скрипт для проверки здоровья всех сервисов Reki

echo "🏥 Проверка здоровья сервисов Reki"
echo "=================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода с логированием
print_header() {
    log_info "HEADER: $1"
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    log_success "$1"
    echo -e "✅ ${GREEN}$1${NC}"
}

print_error() {
    log_error "$1"
    echo -e "❌ ${RED}$1${NC}"
}

print_warning() {
    log_warn "$1"
    echo -e "⚠️  ${YELLOW}$1${NC}"
}

print_info() {
    log_info "$1"
    echo -e "ℹ️  $1"
}

# Функция для проверки HTTP эндпоинта
check_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    log_step "Checking endpoint: $name ($url)"
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        print_success "$name: Доступен ($url)"
        return 0
    else
        print_error "$name: Недоступен ($url)"
        return 1
    fi
}

# Функция для проверки API с JSON ответом
check_api_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    if response=$(curl -s --max-time $timeout "$url" 2>/dev/null) && echo "$response" | jq . > /dev/null 2>&1; then
        echo "✅ $name: Доступен и отвечает ($url)"
        return 0
    else
        echo "❌ $name: Недоступен или не отвечает ($url)"
        return 1
    fi
}

# Проверка инфраструктуры
echo "🗄️  Проверка инфраструктуры:"
if docker exec reki-db-1 pg_isready -h localhost -p 5432 -U reki > /dev/null 2>&1; then
    echo "✅ PostgreSQL: Готов к работе (localhost:5432)"
else
    echo "❌ PostgreSQL: Недоступен (localhost:5432)"
fi

check_endpoint "http://localhost:8080" "Adminer"

# Проверка основных приложений Reki
echo ""
echo "🚀 Проверка приложений Reki:"
check_endpoint "http://localhost:3004" "Control Panel (Frontend)"
check_api_endpoint "http://localhost:3002/api/health" "Core API Server"
check_api_endpoint "http://localhost:3001/api/health" "Auth API Server"

# Проверка документации API
echo ""
echo "📚 Проверка документации:"
check_endpoint "http://localhost:3002/api/docs" "Core API Docs (Swagger)"
check_endpoint "http://localhost:3001/api/docs" "Auth API Docs (Swagger)"

# Проверка дополнительных сервисов (если запущены)
echo ""
echo "📡 Проверка дополнительных сервисов:"
check_endpoint "http://localhost:3003" "Telegram Bot API" || echo "ℹ️  Telegram Bot: Опционально (не запущен)"

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

# Проверка процессов Node.js
echo ""
echo "⚙️  Проверка запущенных процессов:"
if pgrep -f "app-core-server" > /dev/null; then
    echo "✅ Core Server процесс запущен"
else
    echo "❌ Core Server процесс не найден"
fi

if pgrep -f "app-auth-server" > /dev/null; then
    echo "✅ Auth Server процесс запущен"
else
    echo "❌ Auth Server процесс не найден"
fi

if pgrep -f "app-control-panel.*dev" > /dev/null; then
    echo "✅ Control Panel процесс запущен"
else
    echo "❌ Control Panel процесс не найден"
fi

echo ""
echo "🔍 Сводка проверки завершена"
echo ""
print_info "Для запуска всех сервисов используйте:"
print_info "   npm run dev:start"

# Finish logging
log_finish "true"
