import { DomainError } from './base.error';

/**
 * Ошибка уровня приложения
 * Application layer error for service-level issues
 */
export class ApplicationError extends DomainError {
  public readonly cause?: Error;

  constructor(message: string, code: string, cause?: Error, context?: Record<string, any>) {
    super(message, code, context);
    this.cause = cause;
  }

  /**
   * Создает ApplicationError из другой ошибки
   */
  static fromError(error: Error, context?: Record<string, any>): ApplicationError {
    return new ApplicationError(
      error.message,
      'APPLICATION_ERROR',
      error,
      context
    );
  }
}

/**
 * Ошибка базы данных
 */
export class DatabaseError extends ApplicationError {
  constructor(message: string, operation: string, cause?: Error) {
    super(
      message,
      'DATABASE_ERROR',
      cause,
      { operation }
    );
  }
}

/**
 * Ошибка внешнего API
 */
export class ExternalApiError extends ApplicationError {
  constructor(
    message: string, 
    service: string, 
    statusCode?: number, 
    cause?: Error
  ) {
    super(
      message,
      'EXTERNAL_API_ERROR',
      cause,
      { service, statusCode }
    );
  }
}

/**
 * Ошибка конфигурации
 */
export class ConfigurationError extends ApplicationError {
  constructor(message: string, configKey: string) {
    super(
      message,
      'CONFIGURATION_ERROR',
      undefined,
      { configKey }
    );
  }
}

/**
 * Ошибка превышения лимитов
 */
export class RateLimitError extends ApplicationError {
  constructor(resource: string, limit: number, timeWindow: string) {
    super(
      `Rate limit exceeded for ${resource}: ${limit} requests per ${timeWindow}`,
      'RATE_LIMIT_EXCEEDED',
      undefined,
      { resource, limit, timeWindow }
    );
  }
}

/**
 * Ошибка таймаута операции
 */
export class OperationTimeoutError extends ApplicationError {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Operation ${operation} timed out after ${timeoutMs}ms`,
      'OPERATION_TIMEOUT',
      undefined,
      { operation, timeoutMs }
    );
  }
}

/**
 * Ошибка нехватки ресурсов
 */
export class ResourceExhaustedError extends ApplicationError {
  constructor(resource: string, currentUsage: number, limit: number) {
    super(
      `Resource ${resource} exhausted: ${currentUsage}/${limit}`,
      'RESOURCE_EXHAUSTED',
      undefined,
      { resource, currentUsage, limit }
    );
  }
}