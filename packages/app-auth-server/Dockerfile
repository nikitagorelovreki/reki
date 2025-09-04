FROM node:18-alpine

WORKDIR /app

# Install basic dependencies and nestjs cli
RUN apk add --no-cache curl && \
    npm install -g @nestjs/cli

# Copy package.json files
COPY packages/app-auth-server/package.json packages/app-auth-server/
COPY package.json .

# Install dependencies in auth-server directory
WORKDIR /app/packages/app-auth-server
RUN npm install --production

# Copy source code
COPY packages/app-auth-server/src ./src
COPY packages/app-auth-server/nest-cli.json .
COPY packages/app-auth-server/tsconfig*.json ./

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reki -u 1001

# Change ownership
RUN chown -R reki:nodejs /app

USER reki

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "run", "start:prod"]
