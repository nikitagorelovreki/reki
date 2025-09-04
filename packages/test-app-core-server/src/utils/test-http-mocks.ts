export class TestHttpMocks {
  private mocks: Record<string, jest.MockedFunction<any>> = {};

  constructor() {
    this.setupMocks();
  }

  private setupMocks(): void {
    // Mock external API calls
    this.mocks.externalAPI = jest.fn();
    this.mocks.emailService = jest.fn();
    this.mocks.smsService = jest.fn();
    this.mocks.fileStorage = jest.fn();
    this.mocks.inventoryService = jest.fn();
    this.mocks.analyticsService = jest.fn();
    this.mocks.notificationService = jest.fn();
    this.mocks.auditService = jest.fn();
  }

  // External API mock
  mockExternalAPI(response?: any, error?: Error): void {
    if (error) {
      this.mocks.externalAPI.mockRejectedValue(error);
    } else {
      this.mocks.externalAPI.mockResolvedValue(response || { success: true });
    }
  }

  // Email service mock
  mockEmailService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.emailService.mockRejectedValue(error);
    } else {
      this.mocks.emailService.mockResolvedValue(response || { sent: true });
    }
  }

  // SMS service mock
  mockSMSService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.smsService.mockRejectedValue(error);
    } else {
      this.mocks.smsService.mockResolvedValue(response || { sent: true });
    }
  }

  // File storage mock
  mockFileStorage(response?: any, error?: Error): void {
    if (error) {
      this.mocks.fileStorage.mockRejectedValue(error);
    } else {
      this.mocks.fileStorage.mockResolvedValue(response || { uploaded: true });
    }
  }

  // Inventory service mock
  mockInventoryService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.inventoryService.mockRejectedValue(error);
    } else {
      this.mocks.inventoryService.mockResolvedValue(response || { updated: true });
    }
  }

  // Analytics service mock
  mockAnalyticsService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.analyticsService.mockRejectedValue(error);
    } else {
      this.mocks.analyticsService.mockResolvedValue(response || { recorded: true });
    }
  }

  // Get mock function
  getMock(name: string): jest.MockedFunction<any> {
    return this.mocks[name];
  }

  // Reset all mocks
  reset(): void {
    Object.values(this.mocks).forEach(mock => {
      mock.mockReset();
    });
  }

  // Verify mock was called
  expectCalled(name: string, expectedArgs?: any): void {
    const mock = this.mocks[name];
    expect(mock).toHaveBeenCalled();
    if (expectedArgs) {
      expect(mock).toHaveBeenCalledWith(expectedArgs);
    }
  }

  // Expect mock was not called
  expectNotCalled(name: string): void {
    const mock = this.mocks[name];
    expect(mock).not.toHaveBeenCalled();
  }
}
