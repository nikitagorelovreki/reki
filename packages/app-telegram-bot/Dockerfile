FROM node:18-alpine

WORKDIR /app

# Install turbo globally
RUN npm install -g turbo@latest

# Copy root package files
COPY package.json package-lock.json turbo.json ./

# Copy all package.json files to resolve workspace dependencies
COPY packages/*/package.json ./packages/*/

# Install root dependencies first
RUN npm install --include=dev

# Copy source code for all needed packages
COPY packages/app-telegram-bot/ ./packages/app-telegram-bot/
COPY packages/core-domain/ ./packages/core-domain/
COPY packages/core-service/ ./packages/core-service/
COPY packages/core-persistence/ ./packages/core-persistence/
COPY packages/auth-domain/ ./packages/auth-domain/
COPY packages/auth-service/ ./packages/auth-service/
COPY packages/auth-persistence/ ./packages/auth-persistence/
COPY packages/persistence-commons/ ./packages/persistence-commons/

# Build the telegram bot
WORKDIR /app/packages/app-telegram-bot
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
