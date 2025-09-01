import { DomainError } from './base.error';
import { ApplicationError } from './application.errors';

/**
 * Утилиты для работы с ошибками
 */
export class ErrorUtils {
  /**
   * Проверяет, является ли ошибка доменной ошибкой
   */
  static isDomainError(error: unknown): error is DomainError {
    return error instanceof DomainError;
  }

  /**
   * Проверяет, является ли ошибка ошибкой приложения
   */
  static isApplicationError(error: unknown): error is ApplicationError {
    return error instanceof ApplicationError;
  }

  /**
   * Извлекает безопасное для пользователя сообщение об ошибке
   */
  static getSafeMessage(error: unknown): string {
    if (error instanceof DomainError) {
      return error.message;
    }
    
    if (error instanceof Error) {
      // Для системных ошибок возвращаем общее сообщение
      return 'An internal error occurred. Please try again later.';
    }

    return 'An unexpected error occurred.';
  }

  /**
   * Извлекает код ошибки
   */
  static getErrorCode(error: unknown): string {
    if (error instanceof DomainError) {
      return error.code;
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Извлекает контекст ошибки для логирования
   */
  static getErrorContext(error: unknown): Record<string, any> {
    if (error instanceof DomainError) {
      return error.toLogObject();
    }

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return {
      error: String(error),
      type: typeof error,
    };
  }

  /**
   * Создает стандартный объект ответа для API
   */
  static toApiResponse(error: unknown, statusCode: number = 500): Record<string, any> {
    const baseResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      error: 'Internal Server Error',
      message: 'An internal error occurred',
    };

    if (error instanceof DomainError) {
      return {
        ...baseResponse,
        ...error.toApiResponse(),
        statusCode,
      };
    }

    if (error instanceof Error) {
      return {
        ...baseResponse,
        message: process.env.NODE_ENV === 'development' ? error.message : baseResponse.message,
        error: error.name,
      };
    }

    return baseResponse;
  }

  /**
   * Проверяет, можно ли повторить операцию после ошибки
   */
  static isRetryable(error: unknown): boolean {
    if (error instanceof DomainError) {
      const nonRetryableCodes = [
        'VALIDATION_ERROR',
        'AUTHORIZATION_ERROR',
        'AUTHENTICATION_ERROR',
        'BUSINESS_RULE_VIOLATION',
        'RESOURCE_NOT_FOUND',
      ];
      return !nonRetryableCodes.includes(error.code);
    }

    // Системные ошибки обычно можно повторить
    return true;
  }

  /**
   * Определяет HTTP статус код для ошибки
   */
  static getHttpStatusCode(error: unknown): number {
    if (!(error instanceof DomainError)) {
      return 500; // Internal Server Error
    }

    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 400; // Bad Request
      case 'AUTHENTICATION_ERROR':
        return 401; // Unauthorized
      case 'AUTHORIZATION_ERROR':
        return 403; // Forbidden
      case 'RESOURCE_NOT_FOUND':
        return 404; // Not Found
      case 'RESOURCE_CONFLICT':
      case 'BUSINESS_RULE_VIOLATION':
        return 409; // Conflict
      case 'RATE_LIMIT_EXCEEDED':
        return 429; // Too Many Requests
      case 'EXTERNAL_SERVICE_ERROR':
        return 502; // Bad Gateway
      case 'OPERATION_TIMEOUT':
        return 504; // Gateway Timeout
      default:
        return 500; // Internal Server Error
    }
  }
}

/**
 * Создает объект с метриками ошибки для мониторинга
 */
export function createErrorMetrics(error: unknown): Record<string, any> {
  return {
    error_type: ErrorUtils.isDomainError(error) ? 'domain' : 'system',
    error_code: ErrorUtils.getErrorCode(error),
    error_name: error instanceof Error ? error.name : 'UnknownError',
    is_retryable: ErrorUtils.isRetryable(error),
    http_status: ErrorUtils.getHttpStatusCode(error),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Форматирует ошибку для логирования
 */
export function formatErrorForLogging(error: unknown, context?: Record<string, any>): Record<string, any> {
  return {
    ...ErrorUtils.getErrorContext(error),
    metrics: createErrorMetrics(error),
    context,
  };
}