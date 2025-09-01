# CUIS Documentation Hub

Welcome to the comprehensive developer documentation for CUIS (Cosyma Unified Info-System). This documentation covers all aspects of the system architecture, development practices, and implementation details.

> **[🔙 Назад к главной странице проекта](../README.md)** | **[🏠 Project Overview](../README.md)**

## 📚 Documentation Index

### Getting Started
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Complete overview and getting started guide
- **[Architecture Overview](./ARCHITECTURE.md)** - System architecture and design patterns
- **[New Package Guide](./NEW_PACKAGE_GUIDE.md)** - How to create and integrate new packages

### Technical References  
- **[UML Schema](./UML_SCHEMA.md)** - Visual system diagrams and relationships
- **[Database Schema](./DATABASE_SCHEMA.md)** - Complete database structure and queries
- **[Package Reference](./PACKAGE_REFERENCE.md)** - Detailed package documentation
- **[Frontend Components](./FRONTEND_COMPONENTS.md)** - React component architecture

### Integration Guides
- **[Module Creation Guide](./module-creation-guide.md)** - Guide for creating new modules (if available)

### User Documentation
- **[📖 User Guide](./USER_GUIDE.md)** - End-user documentation (if available)
- **[📖 Руководство пользователя](./РУКОВОДСТВО_ПОЛЬЗОВАТЕЛЯ.md)** - Russian user guide (if available)
- **[⚡ Quick Reference](./QUICK_REFERENCE.md)** - Quick reference guide (if available)

### Meta Documentation
- **[README Structure Guide](./README_STRUCTURE.md)** - Guide to all README files in the repository

## 🏗️ System Overview

CUIS is a modular medical device and patient management system built with:

- **Clean Architecture** principles
- **Domain-Driven Design** (DDD) patterns  
- **TypeScript** for type safety
- **NestJS** for backend API
- **React** for frontend UI
- **PostgreSQL** for data persistence
- **Turborepo** for monorepo management

## 🎯 Quick Navigation

### For New Developers
1. Start with [Developer Guide](./DEVELOPER_GUIDE.md) for system overview
2. Review [Architecture](./ARCHITECTURE.md) to understand design principles
3. Explore [Package Reference](./PACKAGE_REFERENCE.md) for detailed package info
4. Check [Frontend Components](./FRONTEND_COMPONENTS.md) for UI development

### For System Architects
1. Review [UML Schema](./UML_SCHEMA.md) for visual system overview
2. Study [Architecture](./ARCHITECTURE.md) for design patterns and principles
3. Examine [Database Schema](./DATABASE_SCHEMA.md) for data modeling

### For DevOps Engineers
1. Check [Database Schema](./DATABASE_SCHEMA.md) for deployment requirements
2. Review [Architecture](./ARCHITECTURE.md) deployment patterns section
3. See main [README.md](../README.md) for setup instructions

### For Feature Developers
1. Start with [Package Reference](./PACKAGE_REFERENCE.md) to understand existing packages
2. Use [New Package Guide](./NEW_PACKAGE_GUIDE.md) when creating new features
3. Follow [Frontend Components](./FRONTEND_COMPONENTS.md) for UI development

### For End Users
1. Check [User Guide](./USER_GUIDE.md) for complete user documentation (if available)
2. Use [Quick Reference](./QUICK_REFERENCE.md) for daily tasks (if available)
3. See [Russian User Guide](./РУКОВОДСТВО_ПОЛЬЗОВАТЕЛЯ.md) for Russian documentation (if available)

## 📋 System Components

### Core Domain Entities
- **Device** - Medical device lifecycle management
- **Client** - Patient information and status tracking  
- **Form** - Assessment and examination form templates
- **FormEntry** - Individual form submissions and data

### Package Architecture
```
@cuis/
├── domain          # Core business logic (entities, interfaces)
├── persistence     # Data access layer (repositories, database)
├── use-cases       # Application services (business workflows)
├── api             # REST API layer (controllers, DTOs)
└── frontend        # React UI (components, pages, API clients)
```

### Key Technologies
- **Backend**: Node.js, NestJS, TypeScript, PostgreSQL, Knex.js
- **Frontend**: React, TypeScript, Ant Design, Vite
- **DevOps**: Docker, Turborepo, ESLint, Jest, Prettier
- **Integration**: Flower Form (iframe-based patient assessments)

## 🚀 Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Start development environment
docker-compose up -d postgres

# Run API server
npm run api:dev

# Run frontend (in separate terminal)
npm run frontend:dev
```

### Common Tasks

**Adding New Feature**:
1. Create domain entities in `@cuis/domain`
2. Implement repositories in `@cuis/persistence`  
3. Create services in `@cuis/use-cases`
4. Add API endpoints in `@cuis/api`
5. Build UI components in `@cuis/frontend`

**Database Changes**:
1. Create migration in `packages/persistence/database/migrations/`
2. Update domain models if needed
3. Modify repositories to handle new fields
4. Test migration on development data

**API Changes**:
1. Update DTOs in `@cuis/api`
2. Modify controllers as needed
3. Update Swagger documentation
4. Update frontend API clients

## 📊 System Metrics

### Package Sizes (Approximate)
- **Domain**: ~50KB (pure TypeScript)
- **Persistence**: ~200KB (database drivers)
- **Use Cases**: ~100KB (business logic)
- **API**: ~300KB (NestJS + validation)
- **Frontend**: ~2MB (React + UI library)

### Performance Targets
- API Response Time: < 200ms (95th percentile)
- Database Query Time: < 50ms (average)
- Frontend First Paint: < 2s
- Frontend Interactive: < 3s

## 🔧 Development Tools

### Available Scripts
```bash
# Development
npm run dev                    # Start all services
npm run api:dev               # Start API only
npm run frontend:dev          # Start frontend only

# Building
npm run build                 # Build everything
npm run packages:build        # Build all packages
npm run api:build            # Build API only
npm run frontend:build       # Build frontend only

# Testing
npm run test                 # Run all tests
npm run lint                 # Run linting

# Package Management
npm run create:package       # Create new package
```

### IDE Configuration
- **VSCode**: Recommended with ESLint and TypeScript extensions
- **Prettier**: Code formatting (configured in `.prettierrc`)
- **ESLint**: Code linting (configured in `eslint.config.js`)

## 🐛 Troubleshooting

### Common Issues

**Database Connection**:
- Check PostgreSQL is running: `docker-compose ps`
- Verify environment variables in `.env`
- Check network connectivity

**Build Issues**:
- Clear package caches: `npm run clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript compilation: `npm run build`

**Frontend Issues**:
- Check API server is running on port 3002
- Verify API base URL in frontend config
- Check browser console for JavaScript errors

## 🤝 Contributing

### Code Style
- Follow the [Code Style Guide](../CODE_STYLE_GUIDE.md) (if available)
- Use TypeScript for type safety
- Write comprehensive JSDoc comments
- Include unit tests for new features

### Documentation
- Update relevant documentation when making changes
- Include examples in complex features
- Keep README files current
- Document breaking changes

### Review Process
1. Create feature branch from main
2. Implement changes following architecture patterns
3. Add/update tests and documentation
4. Submit pull request for review
5. Address feedback and merge

## 📞 Support

### Getting Help
- Check this documentation first
- Review existing code patterns
- Consult API documentation: http://localhost:3002/api/docs
- Reach out to team members for architectural questions

### Reporting Issues
- Use clear, descriptive titles
- Include reproduction steps
- Provide relevant code snippets
- Tag with appropriate labels

---

**Last Updated**: January 2025  
**Documentation Version**: 1.0  
**System Version**: 0.9.0