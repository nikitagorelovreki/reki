# Reki Control Panel

Комплексная система управления медицинскими устройствами и оценки пациентов с модульной архитектурой на основе DDD (Domain-Driven Design).

## 🏗️ Архитектура проекта

Проект построен на принципах Clean Architecture и DDD с разделением на домены:

### Доменные пакеты (Domain Packages)
- **`@reki/auth-domain`** - Домен аутентификации и авторизации
- **`@reki/core-domain`** - Основной домен (устройства, клиенты, формы)

### Слой персистентности (Persistence Layer)
- **`@reki/persistence-commons`** - Общие компоненты для работы с БД
- **`@reki/auth-persistence`** - Репозитории для auth домена
- **`@reki/core-persistence`** - Репозитории для core домена

### Прикладные сервисы (Application Services)
- **`@reki/auth-service`** - Микросервис аутентификации
- **`@reki/api-server`** - Основной API сервер
- **`@reki/app-control-panel`** - React панель управления
- **`@reki/telegram-bot`** - Telegram бот

### Слой API
- **`@reki/api`** - API контроллеры и DTOs

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Сборка всех доменных пакетов
npm run persistence-commons:build
npm run auth-domain:build
npm run auth-persistence:build
npm run core-domain:build
npm run core-persistence:build

# Запуск сервисов
npm run auth:dev      # Auth сервис на порту 3003
npm run api:dev       # API сервер на порту 3000
npm run app:dev       # Панель управления на порту 5173
npm run telegram:dev  # Telegram бот
```

## 📁 Структура проекта

```
packages/
├── persistence-commons/    # Общие компоненты для работы с БД
├── auth-domain/           # Домен аутентификации
├── auth-persistence/      # Репозитории auth домена
├── core-domain/           # Основной домен (устройства, клиенты, формы)
├── core-persistence/      # Репозитории core домена
├── auth-service/          # Auth микросервис
├── api-server/           # Основной API сервер
├── app-control-panel/    # React панель управления
├── telegram-bot/         # Telegram бот
└── api/                  # API контроллеры
```

## 🔐 Аутентификация

Система использует JWT токены с ролевой моделью доступа:

- **ADMIN** - Полный доступ ко всем функциям
- **USER** - Базовый доступ к чтению и созданию устройств

### Создание администратора
```bash
cd packages/auth-service
npm run seed
```

Данные для входа:
- Username: `admin`
- Password: `admin123`

## 🛠️ Технологический стек

### Backend
- **NestJS** - Основной фреймворк
- **TypeScript** - Язык программирования
- **PostgreSQL** - База данных
- **Knex.js** - Query builder
- **JWT** - Аутентификация

### Frontend
- **React 18** - UI библиотека
- **Ant Design** - Компоненты
- **Vite** - Сборщик
- **TypeScript** - Типизация

### Инфраструктура
- **Turborepo** - Монорепозиторий
- **Docker** - Контейнеризация
- **ESLint** - Линтинг
- **Prettier** - Форматирование

## 📚 Документация

Подробная документация находится в папке `docs/`:

- `docs/architecture/` - Архитектурная документация
- `docs/api/` - API документация
- `docs/development/` - Руководство разработчика
- `docs/user-guides/` - Пользовательские руководства

## 🔧 Разработка

### Создание нового домена
1. Создать пакет `packages/{domain-name}-domain/`
2. Определить модели и порты
3. Создать репозитории в `packages/{domain-name}-persistence/`
4. Добавить в turbo.json и package.json

### Добавление новых функций
1. Обновить доменные модели
2. Создать миграции базы данных
3. Реализовать репозитории
4. Добавить API endpoints
5. Обновить фронтенд

## 📄 Лицензия

MIT License