/**
 * Базовая ошибка домена
 * Base domain error class that all domain errors should extend
 */
export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // Поддержка стека вызовов в Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Преобразует ошибку в объект для логирования
   */
  toLogObject(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }

  /**
   * Преобразует ошибку в объект для API ответа
   */
  toApiResponse(): Record<string, any> {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      ...(this.context && { details: this.context }),
    };
  }
}

/**
 * Ошибка валидации данных
 * Validation error for invalid input data
 */
export class ValidationError extends DomainError {
  constructor(message: string, field?: string, value?: any) {
    super(
      message,
      'VALIDATION_ERROR',
      field ? { field, value } : undefined
    );
  }
}

/**
 * Ошибка не найденного ресурса
 * Resource not found error
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(
      `${resource} with ID ${identifier} not found`,
      'RESOURCE_NOT_FOUND',
      { resource, identifier }
    );
  }
}

/**
 * Ошибка конфликта ресурсов
 * Resource conflict error (e.g., duplicate key, concurrent modification)
 */
export class ConflictError extends DomainError {
  constructor(message: string, resource?: string, context?: Record<string, any>) {
    super(
      message,
      'RESOURCE_CONFLICT',
      { resource, ...context }
    );
  }
}

/**
 * Ошибка бизнес-логики
 * Business rule violation error
 */
export class BusinessRuleError extends DomainError {
  constructor(message: string, rule: string, context?: Record<string, any>) {
    super(
      message,
      'BUSINESS_RULE_VIOLATION',
      { rule, ...context }
    );
  }
}

/**
 * Ошибка недостаточных прав доступа
 * Authorization error for insufficient permissions
 */
export class AuthorizationError extends DomainError {
  constructor(message: string, requiredPermission?: string, userId?: string) {
    super(
      message,
      'AUTHORIZATION_ERROR',
      { requiredPermission, userId }
    );
  }
}

/**
 * Ошибка аутентификации
 * Authentication error for invalid credentials
 */
export class AuthenticationError extends DomainError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Ошибка внешнего сервиса
 * External service error (API calls, third-party integrations)
 */
export class ExternalServiceError extends DomainError {
  constructor(message: string, service: string, statusCode?: number) {
    super(
      message,
      'EXTERNAL_SERVICE_ERROR',
      { service, statusCode }
    );
  }
}

