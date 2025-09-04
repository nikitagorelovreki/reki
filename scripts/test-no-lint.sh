#!/bin/bash

# Script for running all tests WITHOUT linting
# Useful when ESLint configuration has issues but tests need to run
set -e

echo "🧪 Running All Tests (Skipping Linting)"
echo "========================================"

# Check if database is running
echo "🔍 Checking database status..."
if ! docker exec reki-db-1 pg_isready -h localhost -p 5432 -U reki >/dev/null 2>&1; then
    echo "⚠️  Database not running, starting it..."
    ./scripts/start-db.sh
    sleep 3
fi

# Load test environment variables
if [ -f ".env.test" ]; then
    export $(cat .env.test | grep -v '#' | xargs)
    echo "✅ Loaded test environment variables"
fi

# Set test environment
export NODE_ENV=test

# Run migrations for test database
echo "🔄 Running database migrations..."
cd packages/core-persistence && npm run migrate:test && cd ../..

# Build required packages for tests
echo "🔨 Building test dependencies..."
npm run build --workspace=@reki/core-domain
npm run build --workspace=@reki/core-persistence
npm run build --workspace=@reki/auth-domain
npm run build --workspace=@reki/auth-persistence
npm run build --workspace=@reki/auth-service

# Run tests (no linting)
echo ""
echo "🧪 Running Tests (No Linting)..."
echo "================================"
npm run test

echo ""
echo "✅ All tests completed successfully!"
echo "📊 To see detailed results, check individual package outputs above"
echo ""
echo "🎯 Key Test Packages:"
echo "  - @reki/test-app-auth-server: Level 1 functional tests"
echo "  - Other packages: Unit tests (if any) or pass with no tests"
