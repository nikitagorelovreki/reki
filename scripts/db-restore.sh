#!/bin/bash

# Скрипт для восстановления базы данных из резервной копии
set -e

BACKUP_DIR="./backups"

if [ $# -eq 0 ]; then
    echo "Использование: ./db-restore.sh <backup-file>"
    echo "Доступные резервные копии:"
    ls -la "$BACKUP_DIR"/reki_backup_*.sql 2>/dev/null || echo "Резервные копии не найдены"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Файл резервной копии не найден: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Восстановление базы данных из: $BACKUP_FILE"

# Остановка сервисов
echo "🛑 Остановка сервисов..."
pkill -f "turbo run dev" || true

# Сброс базы данных
echo "🗑️  Сброс текущей базы данных..."
docker-compose exec -T db psql -U reki -d reki -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Восстановление из бэкапа
echo "📥 Восстановление данных..."
docker-compose exec -T db psql -U reki -d reki < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно восстановлена!"
else
    echo "❌ Ошибка при восстановлении базы данных"
    exit 1
fi
