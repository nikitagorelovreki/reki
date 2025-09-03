import { ApiService } from './ApiService';
import { Device, DeviceStatus } from '../types/device.types';

export interface TelegramTicket {
  id: string;
  description: string;
  userId: number;
  userName: string;
  deviceId?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export class TelegramBotService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Регистрирует новое устройство через Telegram бота
   */
  async registerDevice(deviceData: {
    id: string;
    location: string;
    registeredBy: string;
  }): Promise<Device> {
    const createDeviceRequest = {
      serial: deviceData.id,
      model: 'Медицинское устройство',
      status: DeviceStatus.REGISTERED,
      currentLocation: deviceData.location,
      maintenanceNotes: {
        registeredVia: 'telegram_bot',
        registeredBy: deviceData.registeredBy,
        registrationDate: new Date().toISOString(),
      },
    };

    return this.apiService.createDevice(createDeviceRequest);
  }

  /**
   * Создает обращение в поддержку через Telegram бота
   */
  async createTicket(ticketData: {
    description: string;
    userId: number;
    userName: string;
    deviceId?: string;
  }): Promise<TelegramTicket> {
    const ticket: TelegramTicket = {
      id: `TICKET-${Date.now()}`,
      description: ticketData.description,
      userId: ticketData.userId,
      userName: ticketData.userName,
      ...(ticketData.deviceId ? { deviceId: ticketData.deviceId } : {}),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Здесь будет сохранение в базу данных
    // await this.ticketRepository.save(ticket);

    return ticket;
  }

  /**
   * Получает статус устройства
   */
  async getDeviceStatus(deviceId: string): Promise<Device | null> {
    return this.apiService.getDeviceById(deviceId);
  }

  /**
   * Валидирует ID устройства
   */
  validateDeviceId(deviceId: string): boolean {
    return /^DEV-\d+$/.test(deviceId);
  }

  /**
   * Форматирует информацию об устройстве для Telegram
   */
  formatDeviceInfo(device: Device): string {
    return [
      `📊 Статус устройства ${device.id}:`,
      '',
      `🔧 Статус: ${device.status}`,
      `📍 Местоположение: ${device.currentLocation || 'Не указано'}`,
      `📅 Последняя активность: ${device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : 'Неизвестно'}`,
      device.status === DeviceStatus.ACTIVE || device.status === DeviceStatus.REGISTERED
        ? '✅ Все системы работают нормально'
        : '⚠️ Требует внимания',
    ].join('\n');
  }
}
