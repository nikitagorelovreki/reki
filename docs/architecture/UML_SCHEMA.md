# UML Schema Documentation

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        FE[Frontend<br/>React App]
        API[API Layer<br/>NestJS REST]
    end

    subgraph "Application Layer"
        DS[DeviceService]
        CS[ClientService]
        FS[FormService]
        FES[FormEntryService]
    end

    subgraph "Domain Layer"
        D[Device]
        C[Client]
        F[Form]
        FE_MODEL[FormEntry]

        DRP[DeviceRepositoryPort]
        CRP[ClientRepositoryPort]
        FRP[FormRepositoryPort]
        FERP[FormEntryRepositoryPort]
    end

    subgraph "Infrastructure Layer"
        DR[DeviceRepository]
        CR[ClientRepository]
        FR[FormRepository]
        FER[FormEntryRepository]
        DB[(PostgreSQL<br/>Database)]
    end

    FE --> API
    API --> DS
    API --> CS
    API --> FS
    API --> FES

    DS --> D
    DS --> DRP
    CS --> C
    CS --> CRP
    FS --> F
    FS --> FRP
    FES --> FE_MODEL
    FES --> FERP

    DRP -.-> DR
    CRP -.-> CR
    FRP -.-> FR
    FERP -.-> FER

    DR --> DB
    CR --> DB
    FR --> DB
    FER --> DB
```

## Domain Model Relationships

```mermaid
erDiagram
    Device {
        UUID id PK
        string serial UK
        string qr_code UK
        string model
        DeviceStatus status
        string current_location
        UUID clinic_id FK
        UUID owner_id FK
        UUID assigned_patient_id FK
        UUID responsible_user_id FK
        timestamp warranty_until
        string purchase_order
        timestamp last_seen_at
        timestamp last_sync_at
        string telemetry_endpoint
        json maintenance_notes
        json external_ids
        timestamp created_at
        timestamp updated_at
    }

    Client {
        UUID id PK
        string full_name
        string first_name
        string last_name
        string middle_name
        date date_of_birth
        string primary_diagnosis
        json contacts
        ClientStatus status
        UUID clinic_id FK
        timestamp created_at
        timestamp updated_at
    }

    FormTemplate {
        UUID id PK
        string title
        string description
        FormType type
        FormStatus status
        integer version
        json schema
        timestamp created_at
        timestamp updated_at
        UUID created_by FK
        UUID updated_by FK
    }

    FormEntry {
        UUID id PK
        UUID form_id FK
        UUID patient_id FK
        UUID device_id FK
        UUID clinic_id FK
        FormEntryStatus status
        json data
        numeric score
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
        UUID created_by FK
        UUID updated_by FK
    }

    FormSubmission {
        UUID id PK
        UUID form_id FK
        UUID client_id FK
        UUID therapist_id FK
        string therapist_name
        date submission_date
        json data
        timestamp created_at
        timestamp updated_at
    }

    Device ||--o{ Client : "assigned_to"
    Client ||--o{ FormEntry : "has_entries"
    Client ||--o{ FormSubmission : "has_submissions"
    FormTemplate ||--o{ FormEntry : "template_for"
    FormTemplate ||--o{ FormSubmission : "template_for"
    Device ||--o{ FormEntry : "used_with"
```

## Status Enumerations

### DeviceStatus

```mermaid
stateDiagram-v2
    [*] --> REGISTERED
    REGISTERED --> AT_CLINIC
    AT_CLINIC --> AT_PATIENT_HOME
    AT_PATIENT_HOME --> AT_CLINIC
    AT_CLINIC --> MAINTENANCE
    MAINTENANCE --> AT_CLINIC
    AT_CLINIC --> DECOMMISSIONED
    AT_PATIENT_HOME --> DECOMMISSIONED
    MAINTENANCE --> DECOMMISSIONED
    DECOMMISSIONED --> [*]
```

### ClientStatus

```mermaid
stateDiagram-v2
    [*] --> INTAKE
    INTAKE --> DIAGNOSTICS
    DIAGNOSTICS --> ACTIVE_THERAPY
    ACTIVE_THERAPY --> PAUSED
    PAUSED --> ACTIVE_THERAPY
    ACTIVE_THERAPY --> DISCHARGED
    DISCHARGED --> FOLLOWUP
    FOLLOWUP --> ARCHIVED
    PAUSED --> DISCHARGED
    DIAGNOSTICS --> DISCHARGED
    INTAKE --> ARCHIVED
    ARCHIVED --> [*]
```

### FormEntryStatus

```mermaid
stateDiagram-v2
    [*] --> IN_PROGRESS
    IN_PROGRESS --> COMPLETED
    IN_PROGRESS --> CANCELLED
    COMPLETED --> [*]
    CANCELLED --> [*]
```

## API Architecture

```mermaid
sequenceDiagram
    participant Client as Frontend Client
    participant API as API Controller
    participant Service as Use Case Service
    participant Domain as Domain Entity
    participant Repo as Repository
    participant DB as Database

    Client->>+API: HTTP Request
    API->>+Service: Call business method
    Service->>+Domain: Create/modify entity
    Domain-->>-Service: Domain object
    Service->>+Repo: Persist/retrieve data
    Repo->>+DB: SQL query
    DB-->>-Repo: Result set
    Repo-->>-Service: Domain object
    Service-->>-API: Business result
    API-->>-Client: HTTP Response (JSON)
```

## Form System Architecture

```mermaid
graph LR
    subgraph "Form Templates"
        FT[Form Template<br/>JSON Schema]
    end

    subgraph "Form Rendering"
        FF[Flower Form<br/>Standalone App]
        FI[Form Integration<br/>React Component]
    end

    subgraph "Data Storage"
        FE[Form Entry<br/>JSON Data]
        FS[Form Submission<br/>Legacy Support]
    end

    FT --> FF
    FT --> FI
    FF --> FE
    FI --> FS

    FE --> |"New System"| PostgreSQL[(PostgreSQL)]
    FS --> |"Legacy Support"| PostgreSQL
```

## Package Dependency Graph

```mermaid
graph TD
    API[📦 @reki/api]
    UC[📦 @reki/use-cases]
    DOMAIN[📦 @reki/domain]
    PERSISTENCE[📦 @reki/persistence]
    FRONTEND[📦 @reki/frontend]

    API --> UC
    API --> DOMAIN
    UC --> DOMAIN
    PERSISTENCE --> DOMAIN
    FRONTEND --> API

    subgraph "External Dependencies"
        NESTJS[NestJS]
        KNEX[Knex.js]
        REACT[React]
        PG[PostgreSQL]
    end

    API --> NESTJS
    UC --> NESTJS
    PERSISTENCE --> KNEX
    PERSISTENCE --> PG
    FRONTEND --> REACT

    style DOMAIN fill:#e1f5fe
    style API fill:#f3e5f5
    style UC fill:#e8f5e8
    style PERSISTENCE fill:#fff3e0
    style FRONTEND fill:#fce4ec
```

## Integration Patterns

### Repository Pattern Implementation

```mermaid
classDiagram
    class ClientRepositoryPort {
        <<interface>>
        +create(client: Client) Promise~Client~
        +findById(id: string) Promise~Client~
        +findAll(options: PaginationOptions) Promise~PaginatedResult~
        +update(id: string, data: Partial~Client~) Promise~Client~
        +delete(id: string) Promise~void~
    }

    class ClientRepository {
        -tableName: string
        -fieldMappings: Record~string, string~
        +create(client: Client) Promise~Client~
        +findById(id: string) Promise~Client~
        +findAll(options: PaginationOptions) Promise~PaginatedResult~
        +update(id: string, data: Partial~Client~) Promise~Client~
        +delete(id: string) Promise~void~
    }

    class DatabaseService {
        -_knex: Knex
        +knex: Knex
        +onModuleInit() void
        +onModuleDestroy() void
    }

    ClientRepositoryPort <|-- ClientRepository
    ClientRepository --> DatabaseService
```

### Service Layer Pattern

```mermaid
classDiagram
    class ClientService {
        -clientRepository: ClientRepositoryPort
        +createClient(data: Partial~Client~) Promise~Client~
        +getClientById(id: string) Promise~Client~
        +getAllClients(options: PaginationOptions) Promise~PaginatedResult~
        +updateClient(id: string, data: Partial~Client~) Promise~Client~
        +deleteClient(id: string) Promise~void~
        +updateClientStatus(id: string, status: ClientStatus) Promise~Client~
    }

    class Client {
        +id: string
        +fullName: string
        +status: ClientStatus
        +updateStatus(status: ClientStatus) void
        +isActive() boolean
    }

    ClientService --> ClientRepositoryPort
    ClientService --> Client
```

## Data Flow Patterns

### Form Submission Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant FlowerForm
    participant API
    participant FormEntryService
    participant Repository
    participant Database

    User->>Frontend: Select form type
    Frontend->>FlowerForm: Load form in iframe
    FlowerForm-->>Frontend: Form loaded
    User->>FlowerForm: Fill out form
    FlowerForm->>Frontend: Send form data via postMessage
    Frontend->>API: POST /api/form-entries
    API->>FormEntryService: createFormEntry()
    FormEntryService->>Repository: save()
    Repository->>Database: INSERT form_entries
    Database-->>Repository: Success
    Repository-->>FormEntryService: FormEntry
    FormEntryService-->>API: FormEntry
    API-->>Frontend: 201 Created
    Frontend-->>User: Success message
```

This UML documentation provides visual representations of the system architecture, relationships between components, and data flow patterns to help developers understand the system structure and interactions.
