# Установка Docker на macOS

1. Скачайте Docker Desktop для Mac с официального сайта: https://www.docker.com/products/docker-desktop/
2. Установите Docker Desktop, перетащив приложение в папку Applications.
3. Запустите Docker Desktop из папки Applications.
4. Дождитесь полной инициализации Docker (значок кита в строке меню должен стать активным).

# Запуск PostgreSQL с помощью Docker

После установки Docker выполните следующие шаги:

1. Откройте терминал и перейдите в корневую папку проекта:

   ```bash
   cd /Users/nikita/Projects/reki
   ```

2. Запустите контейнеры с помощью docker-compose:

   ```bash
   docker compose up -d
   ```

3. Проверьте, что контейнеры запущены:

   ```bash
   docker compose ps
   ```

4. Создайте таблицы в базе данных:

   ```bash
   cd packages/api-server
   npm run migrate
   ```

5. Заполните базу данных тестовыми данными:
   ```bash
   npm run seed
   ```

# Доступ к Adminer (веб-интерфейс для управления базой данных)

После запуска контейнеров вы можете получить доступ к Adminer по адресу:
http://localhost:8080

Используйте следующие данные для входа:

- Система: PostgreSQL
- Сервер: db
- Пользователь: cuis
- Пароль: cuis
- База данных: cuis
