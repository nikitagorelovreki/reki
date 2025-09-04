#!/bin/bash

# Simple shell logger that doesn't consume stdout/stderr
# Usage: source shell-logger.sh && init_logger "script-name"

LOGGER_SCRIPT_NAME=""
LOGGER_START_TIME=""
LOGGER_LOG_DIR="logs/scripts"
LOGGER_LOG_FILE=""

# Initialize logger
init_logger() {
    LOGGER_SCRIPT_NAME="$1"
    LOGGER_START_TIME=$(date +%s)
    
    # Create log directory
    mkdir -p "$LOGGER_LOG_DIR" 2>/dev/null
    
    # Create log file with date
    local date_str=$(date +%Y-%m-%d)
    LOGGER_LOG_FILE="$LOGGER_LOG_DIR/${LOGGER_SCRIPT_NAME}-${date_str}.log"
    
    log_info "🚀 Starting script: $LOGGER_SCRIPT_NAME"
}

# Get timestamp
get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Core logging function - writes to file only, doesn't interfere with stdout
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(get_timestamp)
    
    if [[ -n "$LOGGER_LOG_FILE" && -n "$LOGGER_SCRIPT_NAME" ]]; then
        # Create parent directory if it doesn't exist
        mkdir -p "$(dirname "$LOGGER_LOG_FILE")" 2>/dev/null
        # Write log message
        echo "${timestamp} [${LOGGER_SCRIPT_NAME}] ${level}: ${message}" >> "$LOGGER_LOG_FILE" 2>/dev/null || true
    fi
}

# Logging functions
log_info() {
    log_message "INFO" "$1"
}

log_error() {
    log_message "ERROR" "$1"
}

log_warn() {
    log_message "WARN" "$1"
}

log_success() {
    log_message "SUCCESS" "$1"
}

log_step() {
    log_message "STEP" "📋 $1"
}

log_command() {
    local cmd="$1"
    local cwd="${2:-$(pwd)}"
    log_message "COMMAND" "🔧 Running: $cmd (cwd: $cwd)"
}

log_command_result() {
    local cmd="$1"
    local exit_code="$2"
    local emoji="❌"
    local level="ERROR"
    
    if [[ $exit_code -eq 0 ]]; then
        emoji="✅"
        level="SUCCESS"
    fi
    
    log_message "$level" "$emoji Command finished: $cmd (exit: $exit_code)"
}

# Finish logging
log_finish() {
    local success="${1:-true}"
    local current_time=$(date +%s)
    local duration=$((current_time - LOGGER_START_TIME))
    
    if [[ "$success" == "true" ]]; then
        log_message "INFO" "🎉 Script completed: $LOGGER_SCRIPT_NAME (${duration}s)"
    else
        log_message "ERROR" "💥 Script failed: $LOGGER_SCRIPT_NAME (${duration}s)"
    fi
}

# Helper function to run command with logging (but preserve original stdout/stderr)
run_logged_command() {
    local cmd="$1"
    local show_output="${2:-true}"
    
    log_command "$cmd"
    
    if [[ "$show_output" == "true" ]]; then
        # Run command normally, preserving all output
        eval "$cmd"
        local exit_code=$?
    else
        # Run command silently
        eval "$cmd" >/dev/null 2>&1
        local exit_code=$?
    fi
    
    log_command_result "$cmd" $exit_code
    return $exit_code
}
