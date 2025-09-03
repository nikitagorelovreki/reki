#!/bin/bash

# Скрипт для настройки всех скриптов проекта
set -e

echo "🔧 Настройка скриптов проекта Reki..."

# Делаем все скрипты исполняемыми
chmod +x scripts/*.sh

echo "✅ Все скрипты настроены!"
echo ""
echo "📋 Доступные команды:"
echo "  npm run dev:start     - Запуск всех сервисов"
echo "  npm run dev:restart   - Перезапуск всех сервисов"
echo "  npm run dev:stop      - Остановка всех сервисов"
echo "  npm run service:start - Запуск отдельного сервиса"
echo "  npm run logs          - Просмотр логов"
echo "  npm run debug         - Отладочная информация"
echo "  npm run health        - Проверка здоровья сервисов"
echo "  npm run db:reset      - Сброс базы данных"
echo "  npm run db:backup     - Резервная копия БД"
echo "  npm run db:restore    - Восстановление БД"
echo "  npm run test:all      - Запуск всех тестов"
echo "  npm run lint:fix      - Автоисправление линтинга"
echo "  npm run build:all     - Сборка всех пакетов"
echo "  npm run ci:test       - CI/CD пайплайн"
