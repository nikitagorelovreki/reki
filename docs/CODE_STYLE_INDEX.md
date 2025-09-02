# Code Style Configuration Index

This file provides a complete index of all code style and development configuration files created for the Reki Control Panel project.

## 📋 Configuration Files Overview

### Core Style Configuration

| File               | Purpose              | Description                                                   |
| ------------------ | -------------------- | ------------------------------------------------------------- |
| `.cursorrules`     | Cursor AI Guidelines | Comprehensive coding guidelines for Cursor AI development     |
| `.prettierrc.js`   | Code Formatting      | Unified Prettier configuration for consistent code formatting |
| `.prettierignore`  | Prettier Exclusions  | Files and directories to exclude from Prettier formatting     |
| `eslint.config.js` | Code Linting         | ESLint rules for React, NestJS, and TypeScript                |
| `.editorconfig`    | Editor Settings      | Cross-editor configuration for consistent editing experience  |

### TypeScript Configuration

| File                     | Purpose                | Description                                      |
| ------------------------ | ---------------------- | ------------------------------------------------ |
| `tsconfig.base.json`     | Base TypeScript Config | Shared TypeScript configuration for all packages |
| `tsconfig.frontend.json` | Frontend TypeScript    | React/Vite specific TypeScript configuration     |
| `tsconfig.backend.json`  | Backend TypeScript     | NestJS specific TypeScript configuration         |

### Git and Version Control

| File                | Purpose              | Description                                         |
| ------------------- | -------------------- | --------------------------------------------------- |
| `.husky/pre-commit` | Pre-commit Hook      | Automated code quality checks before commits        |
| `.lintstagedrc.js`  | Staged Files Linting | Configuration for lint-staged pre-commit processing |
| `.gitattributes`    | Git File Handling    | Git configuration for consistent file handling      |

### IDE Integration

| File                      | Purpose                 | Description                                          |
| ------------------------- | ----------------------- | ---------------------------------------------------- |
| `.vscode/settings.json`   | VS Code/Cursor Settings | IDE configuration for optimal development experience |
| `.vscode/extensions.json` | Recommended Extensions  | List of recommended VS Code/Cursor extensions        |

### Build and Development

| File           | Purpose               | Description                                  |
| -------------- | --------------------- | -------------------------------------------- |
| `turbo.json`   | Monorepo Build Config | Updated Turbo configuration with new scripts |
| `package.json` | Root Package Config   | Updated with comprehensive script commands   |

### Documentation

| File                  | Purpose           | Description                                 |
| --------------------- | ----------------- | ------------------------------------------- |
| `CODE_STYLE_GUIDE.md` | Style Guidelines  | Comprehensive coding standards and patterns |
| `SETUP.md`            | Development Setup | Step-by-step setup instructions             |
| `CODE_STYLE_INDEX.md` | This File         | Index of all configuration files            |

## 🚀 Quick Start Commands

### Initial Setup

```bash
# Install dependencies
npm install

# Setup git hooks
npx husky install

# Verify configuration
npm run lint:fix && npm run format && npm run type-check
```

### Development Workflow

```bash
# Start development (all packages)
npm run dev

# Start specific packages
npm run frontend:dev    # React frontend
npm run api:dev        # NestJS backend

# Code quality checks
npm run lint:fix       # Fix linting issues
npm run format         # Format all code
npm run type-check     # TypeScript validation
```

## 🎯 Technology Stack Supported

### Frontend (React)

- ✅ React 18 + TypeScript
- ✅ Vite bundling and development
- ✅ Ant Design component library
- ✅ React Router for navigation
- ✅ Axios for API calls

### Backend (NestJS)

- ✅ NestJS framework
- ✅ TypeScript with decorators
- ✅ Class-validator for validation
- ✅ Swagger/OpenAPI documentation
- ✅ PostgreSQL integration

### Architecture

- ✅ Clean Architecture principles
- ✅ Domain-Driven Design (DDD)
- ✅ Dependency injection
- ✅ Repository pattern
- ✅ Monorepo with Turbo

## 🔧 Configuration Features

### Automated Code Quality

- **Pre-commit hooks** automatically run linting and formatting
- **Real-time linting** in your editor
- **Automatic formatting** on file save
- **Type checking** integration
- **Import organization** and cleanup

### Monorepo Support

- **Package-specific** configurations
- **Shared base** configurations
- **Turbo caching** for faster builds
- **Cross-package** type definitions

### Clean Architecture Enforcement

- **Layer-specific** ESLint rules
- **Domain purity** enforcement
- **Dependency direction** validation
- **Naming convention** consistency

## 📁 File Locations

All configuration files are placed in the project root for maximum compatibility:

```
reki/
├── .cursorrules              # Cursor AI coding guidelines
├── .editorconfig            # Editor configuration
├── .prettierrc.js           # Prettier configuration
├── .prettierignore          # Prettier ignore patterns
├── eslint.config.js         # ESLint configuration
├── .lintstagedrc.js        # Pre-commit linting
├── .gitattributes          # Git file handling
├── tsconfig.base.json      # Base TypeScript config
├── tsconfig.frontend.json  # Frontend TypeScript
├── tsconfig.backend.json   # Backend TypeScript
├── turbo.json              # Monorepo build config
├── .husky/                 # Git hooks
│   └── pre-commit
├── .vscode/                # IDE settings
│   ├── settings.json
│   └── extensions.json
├── CODE_STYLE_GUIDE.md     # Detailed guidelines
├── SETUP.md                # Setup instructions
└── CODE_STYLE_INDEX.md     # This index file
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes without errors
- [ ] `npm run format` runs successfully
- [ ] `npm run type-check` passes
- [ ] `npm run dev` starts all services
- [ ] Pre-commit hooks work: make a test commit
- [ ] Editor shows real-time linting and formatting
- [ ] TypeScript errors are highlighted in IDE

## 🔄 Integration with Cursor

The `.cursorrules` file provides Cursor AI with:

- **Project context** - Understanding of architecture and tech stack
- **Coding patterns** - Consistent code generation
- **Best practices** - Following Clean Architecture and DDD principles
- **Language guidelines** - Proper use of Russian and English
- **Error handling** - Consistent error patterns
- **Testing approaches** - Proper test structure

## 🎉 What's Automated

With this configuration, the following happens automatically:

1. **Code formatting** on every save
2. **Linting** with auto-fix on save
3. **Import organization** on save
4. **Type checking** in real-time
5. **Pre-commit validation** before each commit
6. **Consistent code style** across the entire team
7. **AI assistance** with proper patterns via Cursor

## 📚 Learning Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

✨ **Happy Coding!** The configuration is now ready to support consistent, high-quality development across the entire Reki Control Panel project.
