import axios, { AxiosInstance } from 'axios';
import { Device, DeviceStatus } from '../types/device.types';

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateDeviceRequest {
  serial: string;
  model: string;
  status?: DeviceStatus;
  currentLocation?: string;
  clinicId?: string;
  maintenanceNotes?: Record<string, any>;
}

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

export class ApiService {
  private readonly apiClient: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3002/api';
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем логирование запросов
    this.apiClient.interceptors.request.use(
      config => {
        console.log(
          `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      error => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.apiClient.interceptors.response.use(
      response => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      error => {
        console.error(
          '❌ API Response Error:',
          error.response?.status,
          error.response?.data
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Создает новое устройство через API
   */
  async createDevice(deviceData: CreateDeviceRequest): Promise<Device> {
    try {
      const response = await this.apiClient.post<Device>(
        '/devices',
        deviceData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка создания устройства:', error);
      throw new Error('Не удалось создать устройство');
    }
  }

  /**
   * Получает устройство по ID через API
   */
  async getDeviceById(deviceId: string): Promise<Device | null> {
    try {
      const response = await this.apiClient.get<Device>(`/devices/${deviceId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Ошибка получения устройства:', error);
      throw new Error('Не удалось получить информацию об устройстве');
    }
  }

  /**
   * Получает устройство по серийному номеру через API
   */
  async getDeviceBySerial(serial: string): Promise<Device | null> {
    try {
      const response = await this.apiClient.get<Device>(
        `/devices/serial/${serial}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Ошибка получения устройства по серийному номеру:', error);
      throw new Error('Не удалось получить информацию об устройстве');
    }
  }

  /**
   * Обновляет статус устройства через API
   */
  async updateDeviceStatus(
    deviceId: string,
    status: DeviceStatus
  ): Promise<Device> {
    try {
      const response = await this.apiClient.patch<Device>(
        `/devices/${deviceId}/status/${status}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка обновления статуса устройства:', error);
      throw new Error('Не удалось обновить статус устройства');
    }
  }

  /**
   * Получает все устройства с пагинацией через API
   */
  async getAllDevices(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Device[]>> {
    try {
      const response = await this.apiClient.get<ApiResponse<Device[]>>(
        '/devices',
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка получения списка устройств:', error);
      throw new Error('Не удалось получить список устройств');
    }
  }

  /**
   * Получает устройства по статусу через API
   */
  async getDevicesByStatus(
    status: DeviceStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Device[]>> {
    try {
      const response = await this.apiClient.get<ApiResponse<Device[]>>(
        `/devices/status/${status}`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка получения устройств по статусу:', error);
      throw new Error('Не удалось получить устройства по статусу');
    }
  }

  /**
   * Создает обращение в поддержку (заглушка - в реальном проекте будет отдельный API)
   */
  async createTicket(ticketData: {
    description: string;
    userId: number;
    userName: string;
    deviceId?: string;
  }): Promise<TelegramTicket> {
    // Пока создаем локальное обращение
    // В будущем здесь будет вызов API для создания тикетов
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

    console.log('📝 Создано обращение:', ticket);
    return ticket;
  }

  /**
   * Проверяет доступность API сервера
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.apiClient.get('/devices');
      return true;
    } catch (error) {
      console.error('❌ API сервер недоступен:', error);
      return false;
    }
  }
}
