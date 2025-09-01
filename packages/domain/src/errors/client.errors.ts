import { BusinessRuleError, ConflictError, NotFoundError, ValidationError } from './base.error';
import { ClientStatus } from '../models/client.model';

/**
 * Ошибка не найденного клиента
 */
export class ClientNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super('Client', identifier);
  }
}

/**
 * Ошибка валидации данных клиента
 */
export class InvalidClientDataError extends ValidationError {
  constructor(field: string, value: any, reason?: string) {
    const message = reason 
      ? `Invalid ${field}: ${reason}` 
      : `Invalid ${field} value`;
    super(message, field, value);
  }
}

/**
 * Ошибка дублирования клиента
 */
export class DuplicateClientError extends ConflictError {
  constructor(identifier: string, field: string) {
    super(
      `Client with ${field} ${identifier} already exists`,
      'Client',
      { identifier, field }
    );
  }
}

/**
 * Ошибка статуса клиента
 */
export class InvalidClientStatusError extends BusinessRuleError {
  constructor(currentStatus: ClientStatus, targetStatus: ClientStatus, clientId: string) {
    super(
      `Cannot change client status from ${currentStatus} to ${targetStatus}`,
      'CLIENT_STATUS_TRANSITION',
      { currentStatus, targetStatus, clientId }
    );
  }
}

/**
 * Ошибка назначения клиента
 */
export class ClientAssignmentError extends BusinessRuleError {
  constructor(clientId: string, reason: string) {
    super(
      `Cannot assign client ${clientId}: ${reason}`,
      'CLIENT_ASSIGNMENT',
      { clientId, reason }
    );
  }
}

/**
 * Ошибка разрешения на обработку данных клиента
 */
export class ClientDataPrivacyError extends BusinessRuleError {
  constructor(clientId: string, action: string) {
    super(
      `Data privacy violation for client ${clientId}: ${action}`,
      'CLIENT_DATA_PRIVACY',
      { clientId, action }
    );
  }
}

/**
 * Ошибка истечения согласия клиента
 */
export class ClientConsentExpiredError extends BusinessRuleError {
  constructor(clientId: string, consentType: string) {
    super(
      `Client consent expired for ${consentType}`,
      'CLIENT_CONSENT_EXPIRED',
      { clientId, consentType }
    );
  }
}