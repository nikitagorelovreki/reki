# Vercel Deployment Guide for Reki

## Quick Setup Steps

### 1. Frontend Deployment (Vercel)
```bash
# Deploy Control Panel
cd packages/app-control-panel
npx vercel --prod

# Environment variables to set in Vercel dashboard:
REACT_APP_AUTH_API_URL=https://your-auth-api.railway.app
REACT_APP_CORE_API_URL=https://your-core-api.railway.app
```

### 2. Backend Services (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy services
railway up --service core-server
railway up --service auth-server
railway up --service telegram-bot
```

### 3. Database (Neon)
```bash
# Create database instance at neon.tech
# Copy connection string to environment variables
DATABASE_URL=postgresql://user:pass@hostname:5432/dbname
```

## Environment Configuration

### Production (.env.production)
```env
# Database
DATABASE_URL=postgresql://user:pass@neon.tech:5432/reki_prod

# APIs
AUTH_API_URL=https://reki-auth.railway.app
CORE_API_URL=https://reki-core.railway.app

# Security
JWT_SECRET=your-secure-jwt-secret-here
ENCRYPT_SECRET=your-encryption-secret-here

# External Services
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

### Staging (.env.staging)
```env
# Database (separate Neon branch)
DATABASE_URL=postgresql://user:pass@neon.tech:5432/reki_staging

# APIs
AUTH_API_URL=https://reki-auth-staging.railway.app
CORE_API_URL=https://reki-core-staging.railway.app

# Security (different secrets)
JWT_SECRET=staging-jwt-secret
ENCRYPT_SECRET=staging-encryption-secret
```

## AI Tools Integration

### Vercel AI SDK Setup
```bash
cd packages/app-control-panel
npm install ai @ai-sdk/openai

# Add to your components:
import { useChat } from 'ai/react';
```

### Example AI Integration
```typescript
// packages/app-control-panel/src/components/AI/ChatBot.tsx
import { useChat } from 'ai/react';

export function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## Easy Product Copies

### Branch-based Environments
- `main` → Production
- `staging` → Staging environment  
- `feature/*` → Preview deployments

### One-click Deploy Button
Add to README.md:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nikitagorelovreki/reki)
```

### Environment Cloning
```bash
# Clone production to new environment
railway environment create --name client-demo --from production
railway up --environment client-demo
```
