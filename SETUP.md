# Reki Control Panel - Development Setup

## Quick Setup

### 1. Clone and Install
```bash
git clone https://github.com/nikitagorelovreki/reki.git
cd reki
npm install
```

### 2. Setup Development Environment
```bash
# Install git hooks
npx husky install

# Verify configuration
npm run lint:fix
npm run format
npm run type-check
```

### 3. Start Development
```bash
# Start all services
npm run dev

# Or start specific services
npm run frontend:dev    # Frontend only
npm run api:dev        # Backend only
```

## Code Style Integration

### Automatic Setup
The project includes comprehensive code style configuration that works automatically with:
- ✅ **Cursor** - Uses `.cursorrules` for AI-assisted development
- ✅ **VS Code** - Uses `.vscode/settings.json` for editor configuration
- ✅ **Git** - Pre-commit hooks ensure code quality
- ✅ **CI/CD** - Automated checks on pull requests

### Manual Configuration (if needed)

#### Cursor Settings
1. Open Cursor settings
2. Ensure "Format on Save" is enabled
3. Set Prettier as default formatter
4. Enable ESLint auto-fix

#### VS Code Settings
1. Install recommended extensions from `.vscode/extensions.json`
2. Settings are automatically applied from `.vscode/settings.json`
3. Restart VS Code if needed

## Verification Commands

### Check Code Quality
```bash
# Lint all code
npm run lint

# Format all code
npm run format

# Type check all packages
npm run type-check

# Run all tests
npm run test
```

### Package-Specific Commands
```bash
# Frontend
npm run frontend:lint
npm run frontend:format

# Backend
npm run api:lint  
npm run api:format
```

## File Structure

```
reki/
├── .cursorrules              # Cursor AI coding guidelines
├── .prettierrc.js           # Prettier configuration
├── .editorconfig            # Editor settings
├── eslint.config.js         # ESLint rules
├── tsconfig.base.json       # Base TypeScript config
├── tsconfig.frontend.json   # Frontend TypeScript config
├── tsconfig.backend.json    # Backend TypeScript config
├── .lintstagedrc.js        # Pre-commit hook configuration
├── .husky/                  # Git hooks
├── .vscode/                 # VS Code/Cursor settings
│   ├── settings.json
│   └── extensions.json
└── packages/
    ├── frontend/            # React frontend
    ├── api-server/          # NestJS backend
    ├── domain/              # Domain models
    ├── use-cases/           # Business logic
    ├── persistence/         # Data access
    └── api/                 # API controllers
```

## Architecture Overview

The project follows **Clean Architecture** principles with **Domain-Driven Design**:

1. **Domain Layer** - Pure business logic, no dependencies
2. **Use Cases Layer** - Application business logic
3. **Infrastructure Layer** - External concerns (DB, API)
4. **Presentation Layer** - UI and API endpoints

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/user-management

# Start development
npm run dev

# Code automatically formatted and linted on save
# Pre-commit hooks ensure quality
```

### 2. Code Quality Checks
- ESLint runs automatically on save and pre-commit
- Prettier formats code automatically
- TypeScript type checking on save
- Tests run before commits

### 3. Commit Process
```bash
git add .
git commit -m "feat: add user management functionality"
# Pre-commit hooks run automatically:
# ✅ ESLint auto-fix
# ✅ Prettier formatting  
# ✅ TypeScript type check
# ✅ Tests (if configured)
```

## Troubleshooting

### Common Setup Issues

1. **Node Version**
   - Use Node.js 18+ 
   - Consider using nvm: `nvm use`

2. **Dependencies**
   ```bash
   # Clear caches if issues
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Git Hooks Not Working**
   ```bash
   # Reinstall husky
   npx husky install
   chmod +x .husky/pre-commit
   ```

4. **ESLint/Prettier Conflicts**
   ```bash
   # Run format first, then lint
   npm run format
   npm run lint:fix
   ```

### IDE Issues

1. **Cursor/VS Code Not Formatting**
   - Check if Prettier extension is installed
   - Verify "Format on Save" is enabled
   - Restart editor

2. **TypeScript Errors Not Showing**
   - Ensure TypeScript extension is enabled
   - Check if workspace uses correct tsconfig
   - Restart TypeScript service: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

3. **Import Path Issues**
   - Verify tsconfig path mapping
   - Check if packages are built: `npm run packages:build`

## Performance Tips

### Development
- Use `npm run frontend:dev` for frontend-only development
- Use `npm run api:dev` for backend-only development
- Use Turbo's `--filter` flag for specific packages

### Build Optimization
- Turbo caching speeds up repeated builds
- TypeScript incremental compilation
- ESLint caching for faster linting

## Support

For development setup issues:
1. Check this SETUP.md file
2. Review CODE_STYLE_GUIDE.md
3. Check `.cursorrules` for Cursor-specific guidelines
4. Verify all configuration files are properly set up