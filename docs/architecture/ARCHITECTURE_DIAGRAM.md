# Диаграмма архитектуры Reki Control Panel

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                          │
│                    (packages/frontend/)                        │
├─────────────────────────────────────────────────────────────────┤
│ Types:                                                          │
│ - Client (from domain)                                         │
│ - Device (from domain)                                         │
│ - CreateClientDto (simplified)                                 │
│ - CreateDeviceDto (simplified)                                 │
│                                                                 │
│ Components:                                                     │
│ - ClientsPage.tsx                                              │
│ - DevicesPage.tsx                                              │
│ - FormsPage.tsx                                                │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP API
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│                      (packages/api/)                            │
├─────────────────────────────────────────────────────────────────┤
│ Controllers:                                                    │
│ - ClientsController                                             │
│ - DevicesController                                             │
│ - FormsController                                               │
│                                                                 │
│ Services:                                                       │
│ - ClientsService                                               │
│ - DevicesService                                               │
│ - FormsService                                                  │
│                                                                 │
│ DTOs:                                                           │
│ - CreateClientDto (validation)                                │
│ - UpdateClientDto (validation)                                 │
│ - ClientResponseDto (response)                                 │
│ - PaginatedClientsResponseDto (response)                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │ Domain Models
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DOMAIN LAYER                              │
│                     (packages/domain/)                          │
├─────────────────────────────────────────────────────────────────┤
│ Models:                                                         │
│ - Client (business logic)                                      │
│ - Device (business logic)                                      │
│ - Form (business logic)                                         │
│ - FormEntry (business logic)                                   │
│ - Examination (business logic)                                 │
│                                                                 │
│ Enums:                                                          │
│ - ClientStatus                                                  │
│ - DeviceStatus                                                  │
│ - FormStatus                                                    │
│ - ExaminationFormType                                           │
│                                                                 │
│ Ports:                                                          │
│ - ClientRepositoryPort                                          │
│ - DeviceRepositoryPort                                          │
│ - FormRepositoryPort                                            │
└─────────────────┬───────────────────────────────────────────────┘
                  │ Repository Implementation
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                            │
│                   (packages/persistence/)                       │
├─────────────────────────────────────────────────────────────────┤
│ Repositories:                                                   │
│ - ClientRepository                                              │
│ - DeviceRepository                                             │
│ - FormRepository                                               │
│                                                                 │
│ Database:                                                       │
│ - PostgreSQL                                                    │
│ - Knex.js (query builder)                                      │
│ - Migrations                                                    │
└─────────────────┬───────────────────────────────────────────────┘
                  │ SQL
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
│                    PostgreSQL Tables                            │
├─────────────────────────────────────────────────────────────────┤
│ Tables:                                                         │
│ - clients                                                       │
│ - devices                                                       │
│ - clinics                                                       │
│ - users                                                         │
│ - form_templates                                                │
│ - form_entries                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Маппинг данных между слоями:

### Client Flow:

```
Frontend: CreateClientDto { firstName, lastName, middleName, dateOfBirth, phone, email, address, diagnosis }
    ↓
API: CreateClientDto { firstName, lastName, middleName, dateOfBirth, phone, email, address, diagnosis }
    ↓
Domain: Client { fullName: "lastName firstName middleName", dob: Date, contacts: { phone, email, address } }
    ↓
Database: clients { full_name, first_name, last_name, middle_name, dob, contacts: JSONB }
    ↓
Response: ClientResponseDto { firstName, lastName, middleName, dateOfBirth, phone, email, address, diagnosis }
    ↓
Frontend: Client { firstName, lastName, middleName, dob, contacts }
```

### Device Flow:

```
Frontend: CreateDeviceDto { serial, model, status, currentLocation, clinicId }
    ↓
API: CreateDeviceDto { serial, model, status, currentLocation, clinicId }
    ↓
Domain: Device { serial, model, status, currentLocation, clinicId }
    ↓
Database: devices { serial, model, status, current_location, clinic_id }
    ↓
Response: DeviceResponseDto { serial, model, status, currentLocation, clinicId }
    ↓
Frontend: Device { serial, model, status, currentLocation, clinicId }
```
