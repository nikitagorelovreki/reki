import { DeviceService } from '@reki/use-cases';
import { Device, DeviceStatus } from '@reki/domain';

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
  }): Promise<Device> {
    const device: Partial<Device> = {
      id: deviceData.id,
      model: 'Медицинское устройство',
      serialNumber: deviceData.id,
      status: DeviceStatus.IN_STOCK,
      location: {
        building: 'Главный корпус',
        floor: '2',
        room: '205',
        description: deviceData.location
      },
      lastSeenAt: new Date(),
      maintenanceNotes: JSON.stringify({
        registeredVia: 'telegram_bot',
        registeredBy: deviceData.registeredBy,
        registrationDate: new Date().toISOString()
      })
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
      deviceId: ticketData.deviceId,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Здесь будет сохранение в базу данных
    // await this.ticketRepository.save(ticket);

    return ticket;
  }

  /**
   * Получает статус устройства
   */
  async getDeviceStatus(deviceId: string): Promise<Device | null> {
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
  formatDeviceInfo(device: Device): string {
    return [
      `📊 Статус устройства ${device.id}:`,
      '',
      `🔧 Статус: ${device.status}`,
      `📍 Местоположение: ${device.location?.description || 'Не указано'}`,
      `📅 Последняя активность: ${device.lastSeenAt?.toLocaleString() || 'Неизвестно'}`,
      device.status === DeviceStatus.IN_STOCK ? '✅ Все системы работают нормально' : '⚠️ Требует внимания'
    ].join('\n');
  }
}
