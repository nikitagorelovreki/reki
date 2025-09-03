#!/bin/bash

# Скрипт для создания резервной копии базы данных
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/reki_backup_$TIMESTAMP.sql"

echo "💾 Создание резервной копии базы данных..."

# Создание директории для бэкапов
mkdir -p "$BACKUP_DIR"

# Создание дампа базы данных
echo "📦 Экспорт данных..."
docker-compose exec -T db pg_dump -U reki -d reki > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Резервная копия создана: $BACKUP_FILE"
    echo "📊 Размер файла: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Ошибка при создании резервной копии"
    exit 1
fi

# Очистка старых бэкапов (оставляем последние 10)
echo "🧹 Очистка старых бэкапов..."
ls -t "$BACKUP_DIR"/reki_backup_*.sql 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true

echo "✅ Резервное копирование завершено!"
