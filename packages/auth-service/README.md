# Auth Service

Сервис аутентификации и авторизации для системы Reki.

## Описание

Auth Service предоставляет API для:
- Аутентификации пользователей (логин/пароль)
- Управления пользователями (CRUD)
- Управления ролями и разрешениями
- Проверки прав доступа

## Запуск

### Разработка
```bash
npm run auth:dev
```

### Продакшн
```bash
npm run auth:build
npm run auth:start
```

## API Endpoints

### Аутентификация
- `POST /auth/login` - Вход в систему
- `GET /auth/profile` - Получение профиля пользователя

### Пользователи
- `POST /auth/users` - Создание пользователя
- `GET /auth/users` - Список пользователей
- `GET /auth/users/:id` - Получение пользователя
- `POST /auth/users/:id` - Обновление пользователя

### Роли
- `POST /auth/roles` - Создание роли
- `GET /auth/roles` - Список ролей

### Разрешения
- `POST /auth/permissions` - Создание разрешения
- `GET /auth/permissions` - Список разрешений

### Проверка прав
- `GET /auth/check-permission` - Проверка разрешения

## Переменные окружения

- `PORT` - Порт сервиса (по умолчанию 3003)
- `JWT_SECRET` - Секретный ключ для JWT
- `ALLOWED_ORIGINS` - Разрешенные домены для CORS

## Архитектура

Сервис построен на принципах Clean Architecture:
- Domain - доменные модели и интерфейсы
- Persistence - реализация репозиториев
- Use Cases - бизнес-логика
- API - REST API endpoints
