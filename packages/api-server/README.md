# @cuis/api-server

Main API server application for the CUIS system.

## Overview

This is the runnable API server that brings together all the CUIS packages to provide a complete REST API service. Built with NestJS and configured for production deployment.

## Features

- **Complete REST API**: All CUIS functionality via HTTP endpoints
- **Swagger Documentation**: Auto-generated API docs at `/api/docs`
- **Database Integration**: PostgreSQL with migrations
- **Production Ready**: Optimized for deployment
- **Health Checks**: Monitoring and status endpoints

## Running the Server

### Development
```bash
npm run api:dev
```

### Production
```bash
npm run api:build
npm run api:start
```

## API Documentation

When the server is running, visit:
**http://localhost:3002/api/docs**

## Configuration

Set environment variables:

```bash
PORT=3002
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=cuis
POSTGRES_PASSWORD=cuis
POSTGRES_DB=cuis
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

## Dependencies

This package integrates all CUIS packages:
- `@cuis/domain` - Core business logic
- `@cuis/persistence` - Data access layer
- `@cuis/use-cases` - Application services
- `@cuis/api` - REST controllers and DTOs

## Documentation

For complete system documentation, see:
**[CUIS Documentation Hub](../../docs/README.md)**