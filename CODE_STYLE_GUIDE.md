# Reki Control Panel - Code Style Guide

This document outlines the comprehensive code style configuration for the Reki Control Panel project.

## Overview

The Reki Control Panel uses a monorepo structure with strict code style enforcement through multiple tools:
- **ESLint**: Code linting and quality rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety and modern JavaScript features
- **EditorConfig**: Consistent editor settings
- **Husky + lint-staged**: Pre-commit hooks

## Quick Start

### Install Dependencies
```bash
npm install
```

### Available Scripts

#### Global Commands (run from root)
```bash
# Development
npm run dev                    # Start all packages in development mode
npm run build                  # Build all packages

# Code Quality
npm run lint                   # Lint all packages
npm run lint:fix              # Lint and fix all packages
npm run format                # Format all code with Prettier
npm run format:check          # Check if code is properly formatted
npm run type-check            # Run TypeScript type checking

# Testing
npm run test                  # Run all tests

# Package-specific commands
npm run frontend:dev          # Start frontend only
npm run api:dev               # Start API server only
```

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically:
1. Run ESLint with auto-fix
2. Format code with Prettier
3. Run TypeScript type checking
4. Ensure code quality before commits

## Configuration Files

### 📝 `.cursorrules`
Comprehensive coding guidelines specifically for Cursor AI, including:
- Architecture patterns (Clean Architecture + DDD)
- Technology-specific guidelines
- Naming conventions
- Code organization principles
- Russian language support guidelines

### 🎯 `eslint.config.js`
Root ESLint configuration with specific rules for:
- **Frontend (React)**: React hooks, JSX, browser globals
- **Backend (NestJS)**: Node.js patterns, stricter typing
- **Domain Layer**: Pure functions, no side effects
- **Test Files**: Relaxed rules for testing scenarios

### 💅 `.prettierrc.js`
Unified Prettier configuration:
- 2-space indentation
- Single quotes
- Semicolons
- 80-character line length
- Trailing commas (ES5 style)
- Language-specific overrides

### ⚙️ `.editorconfig`
Editor-agnostic settings:
- UTF-8 encoding
- LF line endings
- Trim trailing whitespace
- Consistent indentation

### 🔧 TypeScript Configurations
- `tsconfig.base.json`: Shared base configuration
- `tsconfig.frontend.json`: Frontend-specific settings
- `tsconfig.backend.json`: Backend-specific settings

### 🪝 `.lintstagedrc.js`
Pre-commit hook configuration:
- Auto-fix ESLint issues
- Format with Prettier
- Type-check TypeScript

## Architecture Guidelines

### Clean Architecture Layers

1. **Domain** (`packages/domain/`)
   - Pure business logic
   - No external dependencies
   - Entities, value objects, ports
   - Strictest TypeScript rules

2. **Use Cases** (`packages/use-cases/`)
   - Application business logic
   - Depends only on domain
   - Services and application flows

3. **Infrastructure** (`packages/persistence/`, `packages/api/`)
   - External concerns
   - Database, API implementations
   - Depends on use-cases and domain

4. **Presentation** (`packages/frontend/`, `packages/api-server/`)
   - User interface and API endpoints
   - Depends on use-cases

### Naming Conventions

#### TypeScript
```typescript
// Interfaces and Types
interface UserProfile {}
type UserStatus = 'active' | 'inactive';

// Classes
class UserService {}
class UserModel {}

// Enums
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Constants
const API_BASE_URL = 'https://api.example.com';

// Functions and variables
const getUserById = (id: string) => {};
const userData = { name: 'John' };
```

#### Files and Directories
```
// React components
UserProfile.tsx
UserProfileCard.tsx

// Services and utilities
user.service.ts
string.utils.ts

// Types and interfaces
user.types.ts
api.interfaces.ts

// Directories
user-management/
device-monitoring/
```

### Import Organization

Always organize imports in this order:
```typescript
// 1. External libraries
import React, { useState } from 'react';
import { Injectable } from '@nestjs/common';
import { Button, Card } from 'antd';

// 2. Internal packages (monorepo)
import { User, UserStatus } from '@reki/domain';
import { UserService } from '@reki/use-cases';

// 3. Relative imports
import { UserCard } from './UserCard';
import { formatDate } from '../utils/date';
import type { UserProps } from '../types';
```

## React Guidelines

### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import type { User } from '@reki/domain';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  onDelete 
}) => {
  // State hooks
  const [loading, setLoading] = useState(false);

  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [user.id]);

  // Event handlers
  const handleEdit = () => {
    onEdit?.(user);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete?.(user.id);
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <Card>
      <h3>{user.name}</h3>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete} loading={loading}>
        Delete
      </Button>
    </Card>
  );
};

export default UserCard;
```

### Hooks Usage
```typescript
// Custom hooks
const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  return { user, loading };
};

// State management
const [users, setUsers] = useState<User[]>([]);
const [pagination, setPagination] = useState({
  current: 1,
  pageSize: 10,
  total: 0,
});
```

## NestJS Guidelines

### Service Structure
```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: Logger,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const user = new User(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new BadRequestException('Failed to create user');
    }
  }
}
```

### Controller Structure
```typescript
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: UserDto })
  async createUser(@Body() userData: CreateUserDto): Promise<UserDto> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserDto })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findById(id);
  }
}
```

## Error Handling Patterns

### Frontend
```typescript
// Service calls with error handling
const handleSubmit = async (formData: FormData) => {
  try {
    setLoading(true);
    await userService.createUser(formData);
    message.success('User created successfully');
    onSuccess?.();
  } catch (error) {
    console.error('Failed to create user:', error);
    message.error('Failed to create user. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Backend
```typescript
// Service error handling
async findById(id: string): Promise<User> {
  try {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    this.logger.error(`Failed to find user ${id}:`, error);
    throw new InternalServerErrorException('Failed to retrieve user');
  }
}
```

## Database and Model Patterns

### Domain Models
```typescript
export class User {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    this.id = data.id || uuidv4();
    this.email = data.email!;
    this.fullName = data.fullName!;
    this.status = data.status || UserStatus.ACTIVE;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  updateProfile(profileData: Partial<User>): void {
    Object.assign(this, {
      ...profileData,
      updatedAt: new Date(),
    });
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}
```

### Repository Implementation
```typescript
@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  async save(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, email, full_name, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `;
    
    const result = await this.db.query(query, [
      user.id,
      user.email,
      user.fullName,
      user.status,
      user.createdAt,
      user.updatedAt,
    ]);

    return new User(result.rows[0]);
  }
}
```

## Testing Patterns

### Unit Tests
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    const mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    
    service = new UserService(mockRepository);
    repository = mockRepository as jest.Mocked<UserRepositoryPort>;
  });

  it('should create user successfully', async () => {
    // Given
    const userData = { email: 'test@example.com', fullName: 'Test User' };
    const expectedUser = new User(userData);
    repository.save.mockResolvedValue(expectedUser);

    // When
    const result = await service.createUser(userData);

    // Then
    expect(result).toEqual(expectedUser);
    expect(repository.save).toHaveBeenCalledWith(expect.any(User));
  });
});
```

### React Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    fullName: 'Test User',
    status: UserStatus.ACTIVE,
  };

  it('should render user information', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Git Hooks**
   ```bash
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

3. **Configure Your Editor**
   - Install recommended extensions from `.vscode/extensions.json`
   - VS Code/Cursor will automatically use the settings from `.vscode/settings.json`

4. **Verify Configuration**
   ```bash
   npm run lint:fix          # Fix linting issues
   npm run format            # Format all code
   npm run type-check        # Verify TypeScript
   ```

## IDE Integration

### Cursor/VS Code
- Automatic formatting on save
- ESLint integration with auto-fix
- TypeScript error highlighting
- Import organization
- File nesting for better organization

### Recommended Extensions
- Prettier - Code formatter
- ESLint - Linting
- TypeScript and JavaScript Language Features
- EditorConfig
- Auto Rename Tag
- Path Intellisense

## Workflow

1. **Before Coding**
   - Pull latest changes
   - Run `npm install` if package.json changed
   - Ensure your editor is configured

2. **During Development**
   - Code is automatically formatted on save
   - ESLint errors are highlighted in real-time
   - TypeScript errors are shown immediately

3. **Before Committing**
   - Pre-commit hooks automatically run
   - Code is linted and formatted
   - TypeScript type checking passes
   - Only clean code can be committed

4. **Code Review**
   - Focus on logic and architecture
   - Style issues are automatically handled
   - Consistent formatting across team

## Troubleshooting

### Common Issues

1. **ESLint Errors**
   ```bash
   npm run lint:fix  # Auto-fix most issues
   ```

2. **Prettier Conflicts**
   ```bash
   npm run format    # Format all files
   ```

3. **TypeScript Errors**
   ```bash
   npm run type-check  # Check all packages
   ```

4. **Import Resolution Issues**
   - Check if path aliases are correctly configured in tsconfig
   - Ensure package dependencies are properly installed

### Package-Specific Debugging

```bash
# Frontend only
npm run frontend:lint
npm run frontend:format

# Backend only  
npm run api:lint
npm run api:format

# All packages
npm run packages:lint
npm run packages:format
```

## Best Practices Summary

✅ **DO**
- Use TypeScript for all new code
- Follow the established folder structure
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Use proper error handling patterns
- Test your code
- Use semantic import organization

❌ **DON'T**
- Commit code that doesn't pass linting
- Use `any` type without good reason
- Mix frontend and backend concerns
- Skip error handling
- Use console.log in production code (except backend logging)
- Ignore TypeScript errors

## Contributing

1. Follow the code style automatically enforced by tools
2. Write tests for new functionality
3. Update documentation when adding features
4. Use conventional commit messages
5. Ensure all CI checks pass

For questions about the code style, refer to this guide or check the inline comments in configuration files.