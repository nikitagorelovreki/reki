import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { 
  DomainError, 
  ApplicationError, 
  ErrorUtils, 
  formatErrorForLogging 
} from '@cuis/domain';

/**
 * Глобальный фильтр исключений для обработки всех ошибок в приложении
 * Global exception filter to handle all application errors consistently
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Определяем HTTP статус код
    const status = this.getHttpStatus(exception);
    
    // Создаем стандартный ответ об ошибке
    const errorResponse = this.createErrorResponse(exception, request, status);
    
    // Логируем ошибку с контекстом
    this.logError(exception, request, status);

    // Отправляем ответ клиенту
    response.status(status).json(errorResponse);
  }

  /**
   * Определяет HTTP статус код для исключения
   */
  private getHttpStatus(exception: unknown): number {
    // NestJS HttpException (встроенные исключения)
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    // Доменные ошибки - используем ErrorUtils для определения статуса
    if (ErrorUtils.isDomainError(exception)) {
      return ErrorUtils.getHttpStatusCode(exception);
    }

    // Все остальные ошибки - 500 Internal Server Error
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Создает стандартный объект ответа об ошибке
   */
  private createErrorResponse(
    exception: unknown,
    request: Request,
    status: number
  ): Record<string, any> {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    // Базовая структура ответа
    const baseResponse = {
      statusCode: status,
      timestamp,
      path,
      method,
    };

    // NestJS HttpException
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return {
        ...baseResponse,
        ...(typeof response === 'object' ? response : { message: response }),
        error: exception.name,
      };
    }

    // Доменные ошибки
    if (ErrorUtils.isDomainError(exception)) {
      return {
        ...baseResponse,
        ...exception.toApiResponse(),
      };
    }

    // Системные ошибки
    if (exception instanceof Error) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      return {
        ...baseResponse,
        error: 'Internal Server Error',
        message: isDevelopment 
          ? exception.message 
          : 'An internal error occurred. Please try again later.',
        ...(isDevelopment && { 
          details: { 
            name: exception.name,
            stack: exception.stack?.split('\n').slice(0, 5), // Первые 5 строк стека
          }
        }),
      };
    }

    // Неизвестные ошибки
    return {
      ...baseResponse,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' 
        ? { exception: String(exception) } 
        : undefined,
    };
  }

  /**
   * Логирует ошибку с контекстом запроса
   */
  private logError(exception: unknown, request: Request, status: number): void {
    const requestContext = {
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      headers: this.sanitizeHeaders(request.headers),
      query: request.query,
      body: this.sanitizeBody(request.body),
    };

    const logData = formatErrorForLogging(exception, requestContext);

    // Разные уровни логирования в зависимости от типа ошибки
    if (status >= 500) {
      this.logger.error('Internal server error occurred', logData);
    } else if (status >= 400) {
      this.logger.warn('Client error occurred', logData);
    } else {
      this.logger.log('Exception handled', logData);
    }

    // Дополнительное логирование для критических ошибок
    if (status >= 500 && !(exception instanceof DomainError)) {
      this.logger.error(`Critical error: ${exception}`, exception instanceof Error ? exception.stack : undefined);
    }
  }

  /**
   * Очищает заголовки от чувствительной информации
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };

    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Очищает тело запроса от чувствительной информации
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credentials'];
    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}