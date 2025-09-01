# @reki/api-server

Main API server application for the Reki system.

## Overview

This is the runnable API server that brings together all the Reki packages to provide a complete REST API service. Built with NestJS and configured for production deployment.

## Features

- **Complete REST API**: All Reki functionality via HTTP endpoints
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
POSTGRES_USER=reki
POSTGRES_PASSWORD=reki
POSTGRES_DB=reki
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

## Dependencies

This package integrates all Reki packages:

- `@reki/domain` - Core business logic
- `@reki/persistence` - Data access layer
- `@reki/use-cases` - Application services
- `@reki/api` - REST controllers and DTOs

## Documentation

For complete system documentation, see:
**[Reki Documentation Hub](../../docs/README.md)**
