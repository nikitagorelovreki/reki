import { BusinessRuleError, ConflictError, NotFoundError, ValidationError } from './base.error';
import { FormStatus, FormType } from '../models/form.model';
import { FormEntryStatus } from '../models/form-entry.model';

/**
 * Ошибка не найденной формы
 */
export class FormNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super('Form', identifier);
  }
}

/**
 * Ошибка не найденного заполнения формы
 */
export class FormEntryNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super('FormEntry', identifier);
  }
}

/**
 * Ошибка валидации схемы формы
 */
export class InvalidFormSchemaError extends ValidationError {
  constructor(schemaErrors: string[]) {
    super(
      `Invalid form schema: ${schemaErrors.join(', ')}`,
      'schema',
      { schemaErrors }
    );
  }
}

/**
 * Ошибка валидации данных формы
 */
export class InvalidFormDataError extends ValidationError {
  constructor(field: string, value: any, expectedType?: string) {
    const message = expectedType 
      ? `Invalid ${field}: expected ${expectedType}, got ${typeof value}`
      : `Invalid ${field} value`;
    super(message, field, value);
  }
}

/**
 * Ошибка версии формы
 */
export class FormVersionError extends ConflictError {
  constructor(formId: string, currentVersion: number, requestedVersion: number) {
    super(
      `Form version conflict: current version is ${currentVersion}, requested ${requestedVersion}`,
      'Form',
      { formId, currentVersion, requestedVersion }
    );
  }
}

/**
 * Ошибка статуса формы
 */
export class InvalidFormStatusError extends BusinessRuleError {
  constructor(currentStatus: FormStatus, targetStatus: FormStatus, formId: string) {
    super(
      `Cannot change form status from ${currentStatus} to ${targetStatus}`,
      'FORM_STATUS_TRANSITION',
      { currentStatus, targetStatus, formId }
    );
  }
}

/**
 * Ошибка заполнения формы
 */
export class FormSubmissionError extends BusinessRuleError {
  constructor(formId: string, reason: string, context?: Record<string, any>) {
    super(
      `Cannot submit form ${formId}: ${reason}`,
      'FORM_SUBMISSION',
      { formId, reason, ...context }
    );
  }
}

/**
 * Ошибка статуса заполнения формы
 */
export class InvalidFormEntryStatusError extends BusinessRuleError {
  constructor(currentStatus: FormEntryStatus, targetStatus: FormEntryStatus, entryId: string) {
    super(
      `Cannot change form entry status from ${currentStatus} to ${targetStatus}`,
      'FORM_ENTRY_STATUS_TRANSITION',
      { currentStatus, targetStatus, entryId }
    );
  }
}

/**
 * Ошибка незавершенной формы
 */
export class IncompleteFormError extends BusinessRuleError {
  constructor(formId: string, missingFields: string[]) {
    super(
      `Form ${formId} is incomplete. Missing fields: ${missingFields.join(', ')}`,
      'INCOMPLETE_FORM',
      { formId, missingFields }
    );
  }
}

/**
 * Ошибка превышения времени заполнения формы
 */
export class FormTimeoutError extends BusinessRuleError {
  constructor(formId: string, timeoutMinutes: number) {
    super(
      `Form ${formId} submission timed out after ${timeoutMinutes} minutes`,
      'FORM_TIMEOUT',
      { formId, timeoutMinutes }
    );
  }
}

/**
 * Ошибка доступа к форме
 */
export class FormAccessError extends BusinessRuleError {
  constructor(formId: string, userId: string, requiredRole?: string) {
    super(
      `User ${userId} does not have access to form ${formId}`,
      'FORM_ACCESS_DENIED',
      { formId, userId, requiredRole }
    );
  }
}