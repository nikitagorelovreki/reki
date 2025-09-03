# @reki/auth-api

Authentication API package containing authentication controllers and DTOs for the Reki system.

## Features

- **Authentication API** - Login, logout, token management
- **User API** - User profile management endpoints
- **Auth DTOs** - Authentication-related data transfer objects

## Usage

```typescript
import { AuthApiModule } from '@reki/auth-api';

@Module({
  imports: [AuthApiModule],
})
export class AppModule {}
```

## Development

```bash
# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```
