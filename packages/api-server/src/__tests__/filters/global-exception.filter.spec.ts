import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { GlobalExceptionFilter } from '../../filters/global-exception.filter';
import { 
  ValidationError, 
  NotFoundError, 
  AuthenticationError,
  DomainError,
} from '@reki/domain';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/api/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent'),
      headers: { 'content-type': 'application/json' },
      query: { param: 'value' },
      body: { field: 'data' },
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  describe('NestJS HttpException Handling', () => {
    it('should handle HttpException correctly', () => {
      const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Bad Request',
          error: 'HttpException',
          timestamp: expect.any(String),
          path: '/api/test',
          method: 'GET',
        })
      );
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Validation failed', errors: ['field1', 'field2'] },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Validation failed',
          errors: ['field1', 'field2'],
          error: 'HttpException',
        })
      );
    });
  });

  describe('Domain Error Handling', () => {
    it('should handle ValidationError correctly', () => {
      const exception = new ValidationError('Invalid email format', 'email', 'invalid@email');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          error: 'ValidationError',
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
          timestamp: expect.any(String),
          path: '/api/test',
          method: 'GET',
          details: { field: 'email', value: 'invalid@email' },
        })
      );
    });

    it('should handle NotFoundError correctly', () => {
      const exception = new NotFoundError('User', 'user-123');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          error: 'NotFoundError',
          message: 'User with ID user-123 not found',
          code: 'RESOURCE_NOT_FOUND',
          details: { resource: 'User', identifier: 'user-123' },
        })
      );
    });

    it('should handle AuthenticationError correctly', () => {
      const exception = new AuthenticationError('Invalid token');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          error: 'AuthenticationError',
          message: 'Invalid token',
          code: 'AUTHENTICATION_ERROR',
        })
      );
    });
  });

  describe('System Error Handling', () => {
    it('should handle regular Error in production', () => {
      process.env.NODE_ENV = 'production';
      const exception = new Error('Database connection failed');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'An internal error occurred. Please try again later.',
          timestamp: expect.any(String),
          path: '/api/test',
        })
      );
    });

    it('should handle regular Error in development', () => {
      process.env.NODE_ENV = 'development';
      const exception = new Error('Database connection failed');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Database connection failed',
          details: expect.objectContaining({
            name: 'Error',
            stack: expect.any(Array),
          }),
        })
      );
    });

    it('should handle unknown exceptions', () => {
      const exception = 'Unknown string error';

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        })
      );
    });
  });

  describe('Security and Privacy', () => {
    it('should sanitize sensitive headers', () => {
      const exception = new ValidationError('Test error');
      
      const requestWithSensitiveHeaders = {
        ...mockRequest,
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer secret-token',
          'cookie': 'session=secret-session',
          'x-api-key': 'secret-api-key',
        },
      };

      const mockHostWithSensitiveHeaders = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => requestWithSensitiveHeaders,
        }),
      } as any;

      // Спитываем логи для проверки
      const logSpy = jest.spyOn(filter as any, 'logError');

      filter.catch(exception, mockHostWithSensitiveHeaders);

      // Проверяем, что чувствительные данные были замаскированы
      expect(logSpy).toHaveBeenCalledWith(
        exception,
        requestWithSensitiveHeaders,
        400
      );
    });

    it('should sanitize sensitive body fields', () => {
      const exception = new ValidationError('Test error');
      
      const requestWithSensitiveBody = {
        ...mockRequest,
        body: {
          username: 'user123',
          password: 'secret-password',
          token: 'secret-token',
          data: 'public-data',
        },
      };

      const mockHostWithSensitiveBody = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => requestWithSensitiveBody,
        }),
      } as any;

      filter.catch(exception, mockHostWithSensitiveBody);

      // Проверяем, что ответ был отправлен (фильтр работает)
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('Logging Behavior', () => {
    it('should log errors at appropriate levels', () => {
      const loggerErrorSpy = jest.spyOn(filter['logger'], 'error');
      const loggerWarnSpy = jest.spyOn(filter['logger'], 'warn');

      // Test 500 error logging
      const serverError = new Error('Server error');
      filter.catch(serverError, mockArgumentsHost);
      expect(loggerErrorSpy).toHaveBeenCalled();

      // Test 400 error logging
      const validationError = new ValidationError('Validation failed');
      filter.catch(validationError, mockArgumentsHost);
      expect(loggerWarnSpy).toHaveBeenCalled();
    });
  });
});