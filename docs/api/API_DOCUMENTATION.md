# 🔌 API Documentation - Reki Medical Device Management

## 📋 Overview

The Reki API provides comprehensive endpoints for managing medical devices, patients, assessment forms, and support tickets. Built with NestJS and following RESTful principles.

## 🌐 Base Configuration

- **Development URL**: `http://localhost:3002/api`
- **Production URL**: Configure via environment variables
- **Content-Type**: `application/json`
- **Authentication**: Currently none (planned: JWT tokens)

## 📊 Response Format

### Standard Response

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

### Error Response

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
```

## 🏥 Medical Devices API

### List Devices

```http
GET /api/devices?page=1&limit=10&status=IN_STOCK
```

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by device status
- `search` (string, optional): Search in serial, model, location

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "serial": "DEV-001",
      "model": "Medical Device Model",
      "status": "IN_STOCK",
      "currentLocation": "Main Clinic",
      "clinicId": "uuid",
      "assignedPatientId": "uuid",
      "lastSeenAt": "2024-01-15T10:30:00Z",
      "maintenanceNotes": {
        "lastMaintenance": "2024-01-10",
        "nextMaintenance": "2024-04-10"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Create Device

```http
POST /api/devices
```

**Request Body:**

```json
{
  "serial": "DEV-001",
  "model": "Medical Device Model",
  "status": "REGISTERED",
  "currentLocation": "Main Clinic",
  "clinicId": "uuid",
  "maintenanceNotes": {
    "registeredVia": "telegram_bot",
    "registeredBy": "field_worker"
  }
}
```

**Response:** Device object (201 Created)

### Get Device by ID

```http
GET /api/devices/:id
```

**Response:** Device object (200 OK)

### Update Device

```http
PATCH /api/devices/:id
```

**Request Body:** Partial device object
**Response:** Updated device object (200 OK)

### Delete Device

```http
DELETE /api/devices/:id
```

**Response:** 204 No Content

### Get Device by Serial

```http
GET /api/devices/serial/:serial
```

**Response:** Device object (200 OK)

### Get Devices by Status

```http
GET /api/devices/status/:status?page=1&limit=10
```

**Response:** Paginated devices array (200 OK)

### Update Device Status

```http
PATCH /api/devices/:id/status/:status
```

**Status Values:** `REGISTERED`, `IN_STOCK`, `AT_CLINIC`, `AT_PATIENT_HOME`, `UNDER_SERVICE`, `RMA`, `DECOMMISSIONED`

**Response:** Updated device object (200 OK)

### Assign Device to Patient

```http
PATCH /api/devices/:id/assign-patient/:patientId
```

**Response:** Updated device object (200 OK)

## 👥 Patients/Clients API

### List Clients

```http
GET /api/clients?page=1&limit=10&status=active_therapy
```

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by client status
- `search` (string, optional): Search in first name, last name

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "Иван",
      "lastName": "Иванов",
      "dateOfBirth": "1980-05-15",
      "status": "active_therapy",
      "diagnosis": "Rehabilitation after stroke",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### Create Client

```http
POST /api/clients
```

**Request Body:**

```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "dateOfBirth": "1980-05-15",
  "status": "active_therapy",
  "diagnosis": "Rehabilitation after stroke"
}
```

**Response:** Client object (201 Created)

### Get Client by ID

```http
GET /api/clients/:id
```

**Response:** Client object (200 OK)

### Update Client

```http
PATCH /api/clients/:id
```

**Request Body:** Partial client object
**Response:** Updated client object (200 OK)

### Delete Client

```http
DELETE /api/clients/:id
```

**Response:** 204 No Content

### Update Client Status

```http
PATCH /api/clients/:id/status/:status
```

**Status Values:** `active_therapy`, `completed_therapy`, `discharged`, `transferred`

**Response:** Updated client object (200 OK)

## 📋 Assessment Forms API

### List Form Templates

```http
GET /api/forms?page=1&limit=10&type=LFK
```

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `type` (string, optional): Filter by form type (`LFK`, `FIM`)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "LFK Assessment Form",
      "type": "LFK",
      "schema": {
        "sections": [
          {
            "title": "Общие данные",
            "fields": [
              {
                "name": "patientName",
                "type": "text",
                "label": "Имя пациента",
                "required": true
              }
            ]
          }
        ]
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### Create Form Template

```http
POST /api/forms
```

**Request Body:**

```json
{
  "name": "Custom Assessment Form",
  "type": "LFK",
  "schema": {
    "sections": [
      {
        "title": "Section Title",
        "fields": [
          {
            "name": "fieldName",
            "type": "text",
            "label": "Field Label",
            "required": true
          }
        ]
      }
    ]
  }
}
```

**Response:** Form template object (201 Created)

### Get Forms by Type

```http
GET /api/forms/type/:type
```

**Response:** Form templates array (200 OK)

### Get Forms by Status

```http
GET /api/forms/status/:status
```

**Response:** Form templates array (200 OK)

## 📝 Form Entries API

### List Form Entries

```http
GET /api/form-entries?page=1&limit=10&status=completed&templateId=uuid
```

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by entry status
- `templateId` (string, optional): Filter by template ID
- `clientId` (string, optional): Filter by client ID

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "templateId": "uuid",
      "clientId": "uuid",
      "data": {
        "eatingScoreBefore": 4,
        "eatingScoreAfter": 6,
        "swallowingScoreBefore": 5,
        "swallowingScoreAfter": 7
      },
      "status": "completed",
      "completedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Create Form Entry

```http
POST /api/form-entries
```

**Request Body:**

```json
{
  "templateId": "uuid",
  "clientId": "uuid",
  "data": {
    "eatingScoreBefore": 4,
    "eatingScoreAfter": 6,
    "swallowingScoreBefore": 5,
    "swallowingScoreAfter": 7
  }
}
```

**Response:** Form entry object (201 Created)

### Get Form Entry by ID

```http
GET /api/form-entries/:id
```

**Response:** Form entry object (200 OK)

### Update Form Entry

```http
PATCH /api/form-entries/:id
```

**Request Body:** Partial form entry object
**Response:** Updated form entry object (200 OK)

### Delete Form Entry

```http
DELETE /api/form-entries/:id
```

**Response:** 204 No Content

### Mark Form Entry as Completed

```http
PATCH /api/form-entries/:id/complete
```

**Response:** Updated form entry object (200 OK)

### Mark Form Entry as Cancelled

```http
PATCH /api/form-entries/:id/cancel
```

**Response:** Updated form entry object (200 OK)

### Update Form Entry Data

```http
PATCH /api/form-entries/:id/data
```

**Request Body:**

```json
{
  "data": {
    "eatingScoreBefore": 4,
    "eatingScoreAfter": 6
  }
}
```

**Response:** Updated form entry object (200 OK)

## 🎯 Data Types

### Device Status Enum

```typescript
enum DeviceStatus {
  REGISTERED = "REGISTERED",
  IN_STOCK = "IN_STOCK",
  AT_CLINIC = "AT_CLINIC",
  AT_PATIENT_HOME = "AT_PATIENT_HOME",
  UNDER_SERVICE = "UNDER_SERVICE",
  RMA = "RMA",
  DECOMMISSIONED = "DECOMMISSIONED",
}
```

### Client Status Enum

```typescript
enum ClientStatus {
  ACTIVE_THERAPY = "active_therapy",
  COMPLETED_THERAPY = "completed_therapy",
  DISCHARGED = "discharged",
  TRANSFERRED = "transferred",
}
```

### Form Type Enum

```typescript
enum FormType {
  LFK = "LFK",
  FIM = "FIM",
}
```

### Form Entry Status Enum

```typescript
enum FormEntryStatus {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
```

## 🔍 Field Types for Forms

### Supported Field Types

- `text` - Text input
- `number` - Numeric input
- `email` - Email input
- `date` - Date picker
- `select` - Dropdown selection
- `radio-group` - Radio button group
- `checkbox-group` - Checkbox group
- `rating` - Rating scale (1-7)
- `textarea` - Multi-line text
- `file` - File upload

### Field Configuration

```typescript
interface FormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[]; // For select, radio-group, checkbox-group
  min?: number; // For number, rating
  max?: number; // For number, rating
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}
```

## 🚨 Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Validation Errors

```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/devices",
  "details": [
    {
      "field": "serial",
      "message": "Serial number is required"
    }
  ]
}
```

## 📊 Rate Limiting

Currently no rate limiting implemented. Planned:

- 100 requests per minute per IP
- 1000 requests per hour per IP

## 🔒 Security

### Current Security Measures

- Input validation using class-validator
- SQL injection prevention with parameterized queries
- CORS configuration for frontend access
- Error handling without sensitive data exposure

### Planned Security Enhancements

- JWT token authentication
- Role-based access control
- API rate limiting
- Request/response logging
- Data encryption at rest

## 📚 Swagger Documentation

Interactive API documentation available at:

- **Development**: `http://localhost:3002/api/docs`
- **Production**: `/api/docs`

## 🧪 Testing

### Test Endpoints

- **Health Check**: `GET /api/health`
- **API Status**: `GET /api/status`

### Test Data

Use the seed script to populate test data:

```bash
npm run seed
```

---

This API provides a comprehensive interface for managing medical devices, patients, and assessments while maintaining data integrity and following RESTful principles.
