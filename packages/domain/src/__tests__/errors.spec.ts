import {
  DomainError,
  ValidationError,
  NotFoundError,
  ConflictError,
  BusinessRuleError,
  AuthorizationError,
  AuthenticationError,
  DeviceNotFoundError,
  InvalidSerialNumberError,
  ClientNotFoundError,
  FormNotFoundError,
  ErrorUtils,
  createErrorMetrics,
  formatErrorForLogging,
} from '../errors';
import { DeviceStatus } from '../models/device.model';
import { ClientStatus } from '../models/client.model';

describe('Error Classes', () => {
  describe('DomainError', () => {
    class TestDomainError extends DomainError {
      constructor(message: string) {
        super(message, 'TEST_ERROR', { testContext: 'value' });
      }
    }

    it('should create domain error with all properties', () => {
      const error = new TestDomainError('Test error message');

      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('TestDomainError');
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.context).toEqual({ testContext: 'value' });
    });

    it('should convert to log object', () => {
      const error = new TestDomainError('Test error');
      const logObject = error.toLogObject();

      expect(logObject).toEqual(expect.objectContaining({
        name: 'TestDomainError',
        message: 'Test error',
        code: 'TEST_ERROR',
        timestamp: expect.any(String),
        context: { testContext: 'value' },
        stack: expect.any(String),
      }));
    });

    it('should convert to API response', () => {
      const error = new TestDomainError('Test error');
      const apiResponse = error.toApiResponse();

      expect(apiResponse).toEqual({
        error: 'TestDomainError',
        message: 'Test error',
        code: 'TEST_ERROR',
        timestamp: expect.any(String),
        details: { testContext: 'value' },
      });
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with field context', () => {
      const error = new ValidationError('Invalid email format', 'email', 'invalid-email');

      expect(error.message).toBe('Invalid email format');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.context).toEqual({ field: 'email', value: 'invalid-email' });
    });

    it('should create validation error without field context', () => {
      const error = new ValidationError('General validation error');

      expect(error.message).toBe('General validation error');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.context).toBeUndefined();
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with resource context', () => {
      const error = new NotFoundError('User', 'user-123');

      expect(error.message).toBe('User with ID user-123 not found');
      expect(error.code).toBe('RESOURCE_NOT_FOUND');
      expect(error.context).toEqual({ resource: 'User', identifier: 'user-123' });
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error with resource context', () => {
      const error = new ConflictError('Duplicate entry', 'User', { field: 'email' });

      expect(error.message).toBe('Duplicate entry');
      expect(error.code).toBe('RESOURCE_CONFLICT');
      expect(error.context).toEqual({ resource: 'User', field: 'email' });
    });
  });

  describe('BusinessRuleError', () => {
    it('should create business rule error', () => {
      const error = new BusinessRuleError(
        'Cannot delete active user',
        'USER_DELETION_RULE',
        { userId: 'user-123', status: 'active' }
      );

      expect(error.message).toBe('Cannot delete active user');
      expect(error.code).toBe('BUSINESS_RULE_VIOLATION');
      expect(error.context).toEqual({ 
        rule: 'USER_DELETION_RULE', 
        userId: 'user-123', 
        status: 'active' 
      });
    });
  });

  describe('AuthorizationError', () => {
    it('should create authorization error with permission context', () => {
      const error = new AuthorizationError(
        'Insufficient permissions',
        'admin:read',
        'user-123'
      );

      expect(error.message).toBe('Insufficient permissions');
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.context).toEqual({
        requiredPermission: 'admin:read',
        userId: 'user-123',
      });
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = new AuthenticationError();

      expect(error.message).toBe('Authentication failed');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should create authentication error with custom message', () => {
      const error = new AuthenticationError('Invalid token');

      expect(error.message).toBe('Invalid token');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });
  });
});

describe('Domain-Specific Errors', () => {
  describe('DeviceNotFoundError', () => {
    it('should create device not found error', () => {
      const error = new DeviceNotFoundError('device-123');

      expect(error.message).toBe('Device with ID device-123 not found');
      expect(error.code).toBe('RESOURCE_NOT_FOUND');
      expect(error.context).toEqual({ resource: 'Device', identifier: 'device-123' });
    });
  });

  describe('InvalidSerialNumberError', () => {
    it('should create invalid serial number error', () => {
      const error = new InvalidSerialNumberError('INVALID-SN');

      expect(error.message).toBe('Invalid serial number format');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.context).toEqual({ field: 'serial', value: 'INVALID-SN' });
    });
  });

  describe('ClientNotFoundError', () => {
    it('should create client not found error', () => {
      const error = new ClientNotFoundError('client-456');

      expect(error.message).toBe('Client with ID client-456 not found');
      expect(error.code).toBe('RESOURCE_NOT_FOUND');
      expect(error.context).toEqual({ resource: 'Client', identifier: 'client-456' });
    });
  });

  describe('FormNotFoundError', () => {
    it('should create form not found error', () => {
      const error = new FormNotFoundError('form-789');

      expect(error.message).toBe('Form with ID form-789 not found');
      expect(error.code).toBe('RESOURCE_NOT_FOUND');
      expect(error.context).toEqual({ resource: 'Form', identifier: 'form-789' });
    });
  });
});

describe('ErrorUtils', () => {
  describe('isDomainError', () => {
    it('should return true for domain errors', () => {
      const error = new ValidationError('Test validation error');
      expect(ErrorUtils.isDomainError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const error = new Error('Regular error');
      expect(ErrorUtils.isDomainError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(ErrorUtils.isDomainError('string')).toBe(false);
      expect(ErrorUtils.isDomainError(null)).toBe(false);
      expect(ErrorUtils.isDomainError(undefined)).toBe(false);
    });
  });

  describe('getSafeMessage', () => {
    it('should return domain error message for domain errors', () => {
      const error = new ValidationError('Field is required');
      expect(ErrorUtils.getSafeMessage(error)).toBe('Field is required');
    });

    it('should return generic message for system errors', () => {
      const error = new Error('Database connection failed');
      expect(ErrorUtils.getSafeMessage(error)).toBe('An internal error occurred. Please try again later.');
    });

    it('should return generic message for non-error values', () => {
      expect(ErrorUtils.getSafeMessage('string')).toBe('An unexpected error occurred.');
    });
  });

  describe('getErrorCode', () => {
    it('should return error code for domain errors', () => {
      const error = new ValidationError('Test error');
      expect(ErrorUtils.getErrorCode(error)).toBe('VALIDATION_ERROR');
    });

    it('should return UNKNOWN_ERROR for non-domain errors', () => {
      const error = new Error('Regular error');
      expect(ErrorUtils.getErrorCode(error)).toBe('UNKNOWN_ERROR');
    });
  });

  describe('getHttpStatusCode', () => {
    it('should return 400 for validation errors', () => {
      const error = new ValidationError('Test validation');
      expect(ErrorUtils.getHttpStatusCode(error)).toBe(400);
    });

    it('should return 401 for authentication errors', () => {
      const error = new AuthenticationError();
      expect(ErrorUtils.getHttpStatusCode(error)).toBe(401);
    });

    it('should return 404 for not found errors', () => {
      const error = new NotFoundError('User', 'user-123');
      expect(ErrorUtils.getHttpStatusCode(error)).toBe(404);
    });

    it('should return 500 for unknown errors', () => {
      const error = new Error('System error');
      expect(ErrorUtils.getHttpStatusCode(error)).toBe(500);
    });
  });

  describe('isRetryable', () => {
    it('should return false for validation errors', () => {
      const error = new ValidationError('Invalid input');
      expect(ErrorUtils.isRetryable(error)).toBe(false);
    });

    it('should return false for not found errors', () => {
      const error = new NotFoundError('User', 'user-123');
      expect(ErrorUtils.isRetryable(error)).toBe(false);
    });

    it('should return true for external service errors', () => {
      // Create a custom error that doesn't match non-retryable codes
      class RetryableError extends DomainError {
        constructor() {
          super('Service unavailable', 'EXTERNAL_SERVICE_ERROR');
        }
      }
      const error = new RetryableError();
      expect(ErrorUtils.isRetryable(error)).toBe(true);
    });

    it('should return true for system errors', () => {
      const error = new Error('Database timeout');
      expect(ErrorUtils.isRetryable(error)).toBe(true);
    });
  });
});

describe('Error Utility Functions', () => {
  describe('createErrorMetrics', () => {
    it('should create metrics for domain errors', () => {
      const error = new ValidationError('Test error');
      const metrics = createErrorMetrics(error);

      expect(metrics).toEqual(expect.objectContaining({
        error_type: 'domain',
        error_code: 'VALIDATION_ERROR',
        error_name: 'ValidationError',
        is_retryable: false,
        http_status: 400,
        timestamp: expect.any(String),
      }));
    });

    it('should create metrics for system errors', () => {
      const error = new Error('System error');
      const metrics = createErrorMetrics(error);

      expect(metrics).toEqual(expect.objectContaining({
        error_type: 'system',
        error_code: 'UNKNOWN_ERROR',
        error_name: 'Error',
        is_retryable: true,
        http_status: 500,
        timestamp: expect.any(String),
      }));
    });
  });

  describe('formatErrorForLogging', () => {
    it('should format domain error for logging', () => {
      const error = new ValidationError('Test validation error', 'email', 'invalid@');
      const context = { userId: 'user-123', action: 'update' };
      
      const formatted = formatErrorForLogging(error, context);

      expect(formatted).toEqual(expect.objectContaining({
        name: 'ValidationError',
        message: 'Test validation error',
        code: 'VALIDATION_ERROR',
        context: { userId: 'user-123', action: 'update' },
        metrics: expect.objectContaining({
          error_type: 'domain',
          error_code: 'VALIDATION_ERROR',
        }),
      }));
    });
  });
});