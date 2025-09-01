# Clients API Module

## Overview

This module provides REST API endpoints for client management in the Reki Medical Device Management System.

## Files Structure

- `clients.controller.ts` - Main controller with REST endpoints
- `clients.module.ts` - NestJS module configuration
- `dto/client.dto.ts` - Data Transfer Objects for validation and documentation

## Available Endpoints

### Client Management

- `POST /api/clients` - Create a new client
- `GET /api/clients` - Get all clients with pagination and filtering
- `GET /api/clients/:id` - Get client by ID
- `PATCH /api/clients/:id` - Update client information
- `DELETE /api/clients/:id` - Delete client

### Client Search & Filtering

- `GET /api/clients/clinic/:clinicId` - Get clients by clinic
- `GET /api/clients/status/:status` - Get clients by status
- `GET /api/clients/search?q=query` - Search clients by name/criteria

### Client Status Management

- `PATCH /api/clients/:id/status/:status` - Update client status

## Client Status Values

- `intake` - Initial client registration
- `diagnostics` - Assessment phase
- `active_therapy` - Active treatment
- `paused` - Therapy temporarily paused
- `discharged` - Treatment completed
- `followup` - Post-treatment follow-up
- `archived` - Historical record

## DTOs

### CreateClientDto

Used for creating new clients. Required fields:

- `fullName` (string) - Client's full name

Optional fields:

- `firstName`, `lastName`, `middleName` (string)
- `dob` (date) - Date of birth
- `diagnosis` (string) - Medical diagnosis
- `contacts` (object) - Contact information
- `status` (ClientStatus) - Initial status (defaults to 'intake')
- `clinicId` (string) - Associated clinic

### UpdateClientDto

Extends CreateClientDto - all fields are optional for updates.

### ClientResponseDto

Response format including all client data plus system fields:

- All input fields
- `id` (string) - System generated ID
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

## Integration

The module is integrated into the main API through:

1. Import in `api.module.ts`
2. Export in `index.ts`
3. Controller tagged for Swagger documentation

## Dependencies

- Uses `ClientService` from `@reki/use-cases` package
- Client model and types from `@reki/domain` package
- Common DTO converter for date handling
