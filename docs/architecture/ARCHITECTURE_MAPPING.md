# Обновленная схема 4-слойной архитектуры Reki Control Panel

## Архитектурные слои

### 1. Database Layer (База данных)

**Назначение**: Хранение данных в PostgreSQL
**Файлы**: `packages/persistence/database/migrations/`

#### Таблицы:

- `clients` - клиенты
- `devices` - устройства
- `clinics` - клиники
- `users` - пользователи
- `form_templates` - шаблоны форм
- `form_entries` - заполненные формы

#### Поля (snake_case):

```sql
clients: id, full_name, first_name, last_name, middle_name, dob, contacts, status, clinic_id, created_at, updated_at
devices: id, serial, model, status, current_location, clinic_id, assigned_patient_id, created_at, updated_at
```

---

### 2. Domain Layer (Доменная модель)

**Назначение**: Бизнес-логика и основные классы
**Файлы**: `packages/domain/src/models/*.model.ts`

#### Модели:

- `Client` - доменная модель клиента
- `Device` - доменная модель устройства
- `Form` - доменная модель формы
- `FormEntry` - доменная модель заполнения формы

#### Enums:

- `ClientStatus` - статусы клиентов
- `DeviceStatus` - статусы устройств
- `FormStatus` - статусы форм

#### Особенности:

- Богатые модели с бизнес-методами
- Используют TypeScript классы
- Содержат валидацию и бизнес-логику

---

### 3. Service Layer (Слой сервисов)

**Назначение**: Бизнес-операции и оркестрация
**Файлы**: `packages/use-cases/src/services/*.service.ts`

#### Сервисы:

- `ClientService` - операции с клиентами
- `DeviceService` - операции с устройствами
- `FormService` - операции с формами

#### Особенности:

- Работают только с domain моделями
- Создают новые domain модели
- Не знают про API или базу данных
- Содержат бизнес-логику

---

### 4. API Layer (API слой)

**Назначение**: HTTP API, валидация, документация
**Файлы**: `packages/api/src/*/`

#### Компоненты:

- `Controllers` - HTTP endpoints
- `DTOs` - Data Transfer Objects
- `Services` - API сервисы (адаптеры)

#### Особенности:

- Преобразуют domain модели в DTOs
- Валидируют входящие данные
- Документируют API (Swagger)

---

## Схема потока данных

### Создание клиента:

```
HTTP Request (CreateClientDto)
    ↓
API Controller (валидация DTO)
    ↓
API Service (преобразование DTO → Domain)
    ↓
Domain Client (бизнес-логика)
    ↓
Service Layer (операции с клиентом)
    ↓
Repository (сохранение в базу)
    ↓
Database (PostgreSQL)
    ↓
Domain Client (результат)
    ↓
API Service (преобразование Domain → ResponseDto)
    ↓
HTTP Response (ClientResponseDto)
```

### Получение списка клиентов:

```
HTTP Request (GET /api/clients)
    ↓
API Controller
    ↓
API Service
    ↓
Service Layer (получение клиентов)
    ↓
Repository (запрос к базе)
    ↓
Database (PostgreSQL)
    ↓
Domain Client[] (результат)
    ↓
API Service (преобразование Domain[] → ResponseDto[])
    ↓
HTTP Response (ClientResponseDto[])
```

---

## Маппинг между слоями

### Database ↔ Domain:

```typescript
// Repository преобразует
Database: { full_name: "Иванов Иван", first_name: "Иван", last_name: "Иванов" }
    ↓
Domain: Client { fullName: "Иванов Иван", firstName: "Иван", lastName: "Иванов" }
```

### Domain ↔ API DTOs:

```typescript
// API Service преобразует
Domain: Client { fullName: "Иванов Иван", dob: Date, contacts: { phone: "123" } }
    ↓
API: ClientResponseDto { firstName: "Иван", lastName: "Иванов", dateOfBirth: "1990-01-01", phone: "123" }
```

### API DTOs ↔ HTTP:

```typescript
// Controller валидирует
HTTP: { firstName: "Иван", lastName: "Иванов", dateOfBirth: "1990-01-01" }
    ↓
API: CreateClientDto { firstName: "Иван", lastName: "Иван", dateOfBirth: "1990-01-01" }
```

---

## Принципы разделения:

1. **Database Layer** - только хранение, snake_case
2. **Domain Layer** - бизнес-логика, camelCase, TypeScript классы
3. **Service Layer** - оркестрация, работает только с domain
4. **API Layer** - HTTP, валидация, DTOs

## Преимущества:

- **Четкое разделение ответственности**
- **Легкое тестирование** (каждый слой отдельно)
- **Гибкость** (можно заменить любой слой)
- **Масштабируемость** (добавлять новые слои легко)
