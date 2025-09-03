# Скрипты управления проектом Reki

Этот документ описывает все доступные скрипты для управления проектом Reki.

## Быстрый старт

```bash
# Настройка скриптов (выполнить один раз)
./scripts/setup-scripts.sh

# Запуск всех сервисов
npm run dev:start
```

## Управление сервисами

### Запуск и остановка
- `npm run dev:start` - Запуск всех сервисов в режиме разработки
- `npm run dev:restart` - Перезапуск всех сервисов
- `npm run dev:stop` - Остановка всех сервисов
- `npm run service:start <service>` - Запуск отдельного сервиса (core, app, telegram, auth)

### Примеры
```bash
npm run service:start telegram  # Запуск только Telegram бота
npm run service:start core      # Запуск только Core сервера
```

## Отладка и мониторинг

- `npm run debug` - Отладочная информация о системе
- `npm run health` - Проверка здоровья всех сервисов
- `npm run logs <service> [lines]` - Просмотр логов

### Примеры
```bash
npm run logs db 50      # Последние 50 строк логов PostgreSQL
npm run logs all        # Все Docker логи
```

## Управление базой данных

- `npm run db:reset` - Полный сброс базы данных
- `npm run db:backup` - Создание резервной копии
- `npm run db:restore <file>` - Восстановление из резервной копии

### Примеры
```bash
npm run db:backup                                    # Создать бэкап
npm run db:restore ./backups/reki_backup_20250903.sql  # Восстановить из файла
```

## Тестирование и качество кода

- `npm run test:all` - Запуск всех тестов и проверок
- `npm run lint:fix` - Автоматическое исправление проблем линтинга
- `npm run build:all` - Сборка всех пакетов
- `npm run ci:test` - Полный CI/CD пайплайн

## Структура скриптов

Все скрипты находятся в директории `scripts/`:

```
scripts/
├── setup-scripts.sh    # Настройка скриптов
├── dev-start.sh        # Запуск сервисов
├── dev-restart.sh      # Перезапуск сервисов
├── dev-stop.sh         # Остановка сервисов
├── service-start.sh    # Запуск отдельного сервиса
├── logs.sh             # Просмотр логов
├── debug.sh            # Отладочная информация
├── health-check.sh     # Проверка здоровья
├── db-reset.sh         # Сброс БД
├── db-backup.sh        # Резервная копия БД
├── db-restore.sh       # Восстановление БД
├── test-all.sh         # Все тесты
├── lint-fix.sh         # Исправление линтинга
├── build-all.sh        # Сборка пакетов
└── ci-test.sh          # CI/CD пайплайн
```

## Использование в CI/CD

Скрипт `ci-test.sh` предназначен для использования в CI/CD пайплайнах:

```yaml
# Пример для GitHub Actions
- name: Run CI tests
  run: npm run ci:test
```

## Полезные советы

1. **Первый запуск**: Всегда выполните `./scripts/setup-scripts.sh` после клонирования репозитория
2. **Отладка**: Используйте `npm run debug` для диагностики проблем
3. **Логи**: Регулярно проверяйте логи с помощью `npm run logs`
4. **Бэкапы**: Создавайте резервные копии перед важными изменениями
5. **Тесты**: Запускайте `npm run test:all` перед коммитами
