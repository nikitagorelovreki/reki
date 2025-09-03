# @reki/core-api

Core API package containing business logic controllers and DTOs for the Reki system.

## Features

- **Devices API** - Device management endpoints
- **Clients API** - Client management endpoints  
- **Forms API** - Form and form submission management
- **Common utilities** - Shared DTOs and mappers

## Usage

```typescript
import { CoreApiModule } from '@reki/core-api';

@Module({
  imports: [CoreApiModule],
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
