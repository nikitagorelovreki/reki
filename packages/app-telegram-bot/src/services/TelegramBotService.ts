import { DeviceService } from '@reki/core-service';
import { ServiceDevice } from '@reki/core-service';

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
  constructor(private readonly deviceService: DeviceService) {}

  /**
   * Регистрирует новое устройство через Telegram бота
   */
  async registerDevice(deviceData: {
    id: string;
    location: string;
    registeredBy: string;
  }): Promise<ServiceDevice> {
    const device: Partial<ServiceDevice> = {
      id: deviceData.id,
      model: 'Медицинское устройство',
      serial: deviceData.id,
      status: 'active',
      currentLocation: deviceData.location,
      lastSeenAt: new Date().toISOString(),
      maintenanceNotes: {
        registeredVia: 'telegram_bot',
        registeredBy: deviceData.registeredBy,
        registrationDate: new Date().toISOString(),
      },
    };

    return this.deviceService.createDevice(device);
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
  async getDeviceStatus(deviceId: string): Promise<ServiceDevice | null> {
    return this.deviceService.getDeviceById(deviceId);
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
  formatDeviceInfo(device: ServiceDevice): string {
    return [
      `📊 Статус устройства ${device.id}:`,
      '',
      `🔧 Статус: ${device.status}`,
      `📍 Местоположение: ${device.currentLocation || 'Не указано'}`,
      `📅 Последняя активность: ${device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : 'Неизвестно'}`,
      device.status === 'active'
        ? '✅ Все системы работают нормально'
        : '⚠️ Требует внимания',
    ].join('\n');
  }
}
