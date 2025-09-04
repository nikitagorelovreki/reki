#!/bin/bash

# Level 1 Functional Tests Runner
# Runs backend functional tests with real DB + mocked HTTP

set -e

echo "🧪 Running Level 1 Functional Tests"
echo "=================================="

# Check if test environment is set
if [ "$NODE_ENV" != "test" ]; then
    export NODE_ENV=test
    echo "Set NODE_ENV=test"
fi

# Load test environment variables
if [ -f ".env.test" ]; then
    export $(cat .env.test | grep -v '#' | xargs)
    echo "✅ Loaded test environment variables"
fi

# Check database connection
echo "🔍 Checking test database connection..."
if ! docker exec reki-db-1 pg_isready -h localhost -p 5432 -U reki -d reki_test >/dev/null 2>&1; then
    echo "❌ Test database is not available"
    echo "Please ensure PostgreSQL is running and test database exists:"
    echo "  docker exec reki-db-1 createdb -U reki reki_test"
    exit 1
fi

echo "✅ Test database connection verified"

# Run migrations
echo "🔄 Running database migrations..."
cd packages/core-persistence && npm run migrate:test && cd ../..

# Build test dependencies
echo "🔨 Building test dependencies..."
npm run build --workspace=@reki/core-domain
npm run build --workspace=@reki/core-persistence
npm run build --workspace=@reki/core-service
npm run build --workspace=@reki/auth-domain
npm run build --workspace=@reki/auth-persistence
npm run build --workspace=@reki/auth-service

# Run Level 1 tests for each package
echo ""
echo "🚀 Running Core Server Level 1 Tests..."
echo "========================================"
npm test --workspace=@reki/test-app-core-server -- --testPathPattern=level1

echo ""
echo "🔐 Running Auth Server Level 1 Tests..."
echo "========================================"
npm test --workspace=@reki/test-app-auth-server -- --testPathPattern=level1

echo ""
echo "🎨 Running Control Panel Level 1 Tests..."
echo "=========================================="
npm test --workspace=@reki/test-app-control-panel -- --testPathPattern=level1

echo ""
echo "✅ All Level 1 tests completed successfully!"
echo "================================================"
