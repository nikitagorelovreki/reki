# 🏗️ System Architecture - Reki Medical Device Management

## 📋 Overview

Reki is a comprehensive medical device management system built with Clean Architecture principles. The system manages medical devices, patient assessments, and provides field operations support through a Telegram bot.

## 🎯 Business Domain

### Core Entities

- **Medical Devices**: Equipment tracking, status management, location tracking
- **Patients/Clients**: Medical records, assessment history, device assignments
- **Assessment Forms**: LFK and FIM evaluation forms for patient assessment
- **Form Entries**: Completed assessments with data visualization
- **Support Tickets**: Issue tracking and resolution via Telegram bot

### Key Workflows

1. **Device Registration**: Field workers register devices via Telegram bot
2. **Patient Assessment**: Medical staff complete assessment forms
3. **Data Visualization**: Radar charts show patient progress
4. **Support Management**: Issues reported and tracked through bot

## 🏛️ Clean Architecture Implementation

### Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)  │  API Server (NestJS)  │  Telegram Bot  │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│              Use Cases & Application Services               │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
├─────────────────────────────────────────────────────────────┤
│              Entities, Value Objects, Ports                │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)  │  External APIs  │  File System   │
└─────────────────────────────────────────────────────────────┘
```

### Package Organization

```
packages/
├── domain/              # Core business logic
│   ├── entities/        # Business entities
│   ├── value-objects/   # Value objects
│   └── ports/           # Interface definitions
├── use-cases/           # Application business logic
│   ├── services/        # Application services
│   └── interfaces/      # Use case interfaces
├── persistence/         # Data access implementation
│   ├── repositories/    # Repository implementations
│   ├── migrations/      # Database migrations
│   └── models/          # Data models
├── api/                 # API layer
│   ├── controllers/     # HTTP controllers
│   ├── dto/            # Data transfer objects
│   └── middleware/     # API middleware
├── api-server/         # NestJS application
│   ├── modules/        # Feature modules
│   ├── config/         # Application config
│   └── main.ts         # Application entry
├── frontend/           # React application
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── utils/         # Utilities
└── telegram-bot/      # Telegram bot
    ├── services/      # Bot services
    ├── handlers/      # Command handlers
    └── types/         # Bot types
```

## 🔄 Data Flow Architecture

### Device Registration Flow

```
Telegram Bot → API Server → Use Case → Domain → Repository → Database
     ↓              ↓           ↓         ↓         ↓         ↓
   User Input   Validation  Business   Entity   Data Access  Storage
```

### Assessment Form Flow

```
Frontend → API Server → Use Case → Domain → Repository → Database
    ↓           ↓           ↓         ↓         ↓         ↓
Form Data   Validation  Business   Entity   Data Access  Storage
```

### Data Visualization Flow

```
Frontend → API Server → Use Case → Repository → Database
    ↓           ↓           ↓         ↓         ↓
Chart Request  Query      Business   Data      Raw Data
```

## 🗄️ Database Architecture

### Core Tables

```sql
-- Medical Devices
devices (
  id UUID PRIMARY KEY,
  serial VARCHAR UNIQUE,
  model VARCHAR,
  status device_status_enum,
  current_location VARCHAR,
  clinic_id UUID,
  assigned_patient_id UUID,
  last_seen_at TIMESTAMP,
  maintenance_notes JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Patients/Clients
clients (
  id UUID PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  date_of_birth DATE,
  status client_status_enum,
  diagnosis TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Assessment Forms
form_templates (
  id UUID PRIMARY KEY,
  name VARCHAR,
  type form_type_enum,
  schema JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Completed Assessments
form_entries (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES form_templates(id),
  client_id UUID REFERENCES clients(id),
  data JSONB,
  status form_entry_status_enum,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Support Tickets
telegram_tickets (
  id UUID PRIMARY KEY,
  description TEXT,
  user_id BIGINT,
  user_name VARCHAR,
  device_id UUID REFERENCES devices(id),
  status ticket_status_enum,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Key Relationships

- Devices can be assigned to clients (many-to-one)
- Form entries reference form templates (many-to-one)
- Form entries reference clients (many-to-one)
- Telegram tickets can reference devices (many-to-one)

## 🔌 API Architecture

### RESTful Endpoints

```
/api/devices
├── GET /                    # List devices with pagination
├── POST /                   # Create new device
├── GET /:id                 # Get device by ID
├── PATCH /:id              # Update device
├── DELETE /:id              # Delete device
├── GET /serial/:serial      # Get device by serial
├── GET /status/:status      # Get devices by status
├── PATCH /:id/status/:status # Update device status
└── PATCH /:id/assign-patient/:patientId # Assign to patient

/api/clients
├── GET /                    # List clients with pagination
├── POST /                   # Create new client
├── GET /:id                 # Get client by ID
├── PATCH /:id              # Update client
├── DELETE /:id              # Delete client
└── PATCH /:id/status/:status # Update client status

/api/forms
├── GET /                    # List form templates
├── POST /                   # Create form template
├── GET /type/:type          # Get forms by type
└── GET /status/:status      # Get forms by status

/api/form-entries
├── GET /                    # List form entries
├── POST /                   # Create form entry
├── GET /:id                 # Get form entry by ID
├── PATCH /:id              # Update form entry
├── DELETE /:id              # Delete form entry
├── PATCH /:id/complete      # Mark as completed
├── PATCH /:id/cancel        # Mark as cancelled
└── PATCH /:id/data          # Update form data
```

### Response Format

```typescript
interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🤖 Telegram Bot Architecture

### Bot Structure

```
Telegram Bot
├── Command Handlers
│   ├── /start              # Initialize bot
│   ├── /help               # Show help
│   ├── /register_device    # Device registration flow
│   ├── /create_ticket      # Support ticket creation
│   ├── /device_status      # Device status check
│   └── /list_devices       # List recent devices
├── State Management
│   ├── User States         # Track user conversation state
│   └── Data Validation     # Validate user inputs
└── API Integration
    ├── HTTP Client         # Communicate with API server
    ├── Error Handling      # Handle API errors
    └── Response Formatting # Format responses for Telegram
```

### Integration Pattern

- Bot communicates with API server via HTTP
- Uses domain models for data consistency
- Implements conversation state management
- Provides user-friendly error messages

## 🎨 Frontend Architecture

### Component Structure

```
Frontend (React)
├── Pages
│   ├── Dashboard           # Main dashboard
│   ├── Devices            # Device management
│   ├── Clients            # Client management
│   ├── Forms              # Form management
│   └── Analytics          # Data visualization
├── Components
│   ├── Layout             # Page layout components
│   ├── Charts             # Data visualization
│   ├── Forms              # Form components
│   └── Common             # Reusable components
├── Services
│   ├── API Client         # HTTP client for API calls
│   ├── State Management   # Application state
│   └── Utilities          # Helper functions
└── Types
    ├── API Types          # TypeScript interfaces
    ├── Component Props    # Component prop types
    └── State Types        # State management types
```

### State Management

- React hooks for local state
- Context API for global state
- API service layer for data fetching
- Form state management with validation

## 🔒 Security Architecture

### Current Security Measures

- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for frontend access
- Error handling without sensitive data exposure

### Planned Security Enhancements

- JWT token authentication
- Role-based access control
- API rate limiting
- Data encryption at rest
- Audit logging

## 📊 Performance Architecture

### Optimization Strategies

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching for static data
- Lazy loading for components
- Image optimization for charts

### Monitoring

- API response time monitoring
- Database query performance
- Frontend bundle size tracking
- Error rate monitoring

## 🚀 Deployment Architecture

### Development Environment

- **API Server**: Port 3002
- **Frontend**: Port 3000
- **Telegram Bot**: Port 3001
- **Database**: PostgreSQL on port 5432

### Production Environment

- **Load Balancer**: Route traffic to multiple instances
- **API Servers**: Multiple instances for high availability
- **Database**: Primary and replica setup
- **CDN**: Static asset delivery
- **Monitoring**: Application and infrastructure monitoring

## 🔄 Data Flow Patterns

### Event-Driven Architecture

- Device status changes trigger notifications
- Form completion triggers data analysis
- Support ticket creation triggers alerts

### CQRS Pattern (Future)

- Separate read and write models
- Optimized queries for reporting
- Event sourcing for audit trails

## 📈 Scalability Considerations

### Horizontal Scaling

- Stateless API servers
- Database connection pooling
- Redis for session management
- Microservices decomposition (future)

### Vertical Scaling

- Database optimization
- Application performance tuning
- Resource allocation optimization

---

This architecture ensures maintainability, scalability, and adherence to Clean Architecture principles while providing a robust foundation for medical device management.
