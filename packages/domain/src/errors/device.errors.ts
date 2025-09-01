import { BusinessRuleError, ConflictError, NotFoundError, ValidationError } from './base.error';
import { DeviceStatus } from '../models/device.model';

/**
 * Ошибка не найденного устройства
 */
export class DeviceNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super('Device', identifier);
  }
}

/**
 * Ошибка валидации серийного номера
 */
export class InvalidSerialNumberError extends ValidationError {
  constructor(serial: string) {
    super('Invalid serial number format', 'serial', serial);
  }
}

/**
 * Ошибка дублирования серийного номера
 */
export class DuplicateSerialNumberError extends ConflictError {
  constructor(serial: string) {
    super(
      `Device with serial number ${serial} already exists`,
      'Device',
      { serial, field: 'serial' }
    );
  }
}

/**
 * Ошибка назначения устройства
 */
export class DeviceAssignmentError extends BusinessRuleError {
  constructor(deviceId: string, reason: string) {
    super(
      `Cannot assign device ${deviceId}: ${reason}`,
      'DEVICE_ASSIGNMENT',
      { deviceId, reason }
    );
  }
}

/**
 * Ошибка статуса устройства
 */
export class InvalidDeviceStatusError extends BusinessRuleError {
  constructor(currentStatus: DeviceStatus, targetStatus: DeviceStatus, deviceId: string) {
    super(
      `Cannot change device status from ${currentStatus} to ${targetStatus}`,
      'DEVICE_STATUS_TRANSITION',
      { currentStatus, targetStatus, deviceId }
    );
  }
}

/**
 * Ошибка неактивного устройства
 */
export class DeviceNotActiveError extends BusinessRuleError {
  constructor(deviceId: string, currentStatus: DeviceStatus) {
    super(
      `Device ${deviceId} is not active (current status: ${currentStatus})`,
      'DEVICE_NOT_ACTIVE',
      { deviceId, currentStatus }
    );
  }
}

/**
 * Ошибка обслуживания устройства
 */
export class DeviceMaintenanceError extends BusinessRuleError {
  constructor(deviceId: string, maintenanceType: string) {
    super(
      `Device ${deviceId} is under maintenance: ${maintenanceType}`,
      'DEVICE_MAINTENANCE',
      { deviceId, maintenanceType }
    );
  }
}