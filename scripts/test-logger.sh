#!/bin/bash

# Import logger
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/shell-logger.sh"

# Test logger
echo "Testing logger functionality..."

init_logger "test-logger"

echo "Logger initialized"
echo "Log file should be: $LOGGER_LOG_FILE"

log_info "This is a test info message"
log_error "This is a test error message"
log_success "This is a test success message"
log_step "Testing step logging"

echo "Checking if log file exists..."
if [[ -f "$LOGGER_LOG_FILE" ]]; then
    echo "✅ Log file created successfully!"
    echo "Contents:"
    cat "$LOGGER_LOG_FILE"
else
    echo "❌ Log file was not created"
    echo "Expected at: $LOGGER_LOG_FILE"
    echo "Directory listing:"
    ls -la "$(dirname "$LOGGER_LOG_FILE")" 2>/dev/null || echo "Directory doesn't exist"
fi

log_finish "true"
