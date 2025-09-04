export class TestAPIMocks {
  private mocks: Record<string, jest.MockedFunction<any>> = {};

  constructor() {
    this.setupMocks();
  }

  private setupMocks(): void {
    // Core API mocks
    this.mocks.clientsGetAll = jest.fn();
    this.mocks.clientsGetById = jest.fn();
    this.mocks.clientsCreate = jest.fn();
    this.mocks.clientsUpdate = jest.fn();
    this.mocks.clientsDelete = jest.fn();

    this.mocks.devicesGetAll = jest.fn();
    this.mocks.devicesGetById = jest.fn();
    this.mocks.devicesCreate = jest.fn();
    this.mocks.devicesUpdate = jest.fn();
    this.mocks.devicesDelete = jest.fn();

    this.mocks.formsGetAll = jest.fn();
    this.mocks.formsGetById = jest.fn();
    this.mocks.formsCreate = jest.fn();
    this.mocks.formsUpdate = jest.fn();
    this.mocks.formsDelete = jest.fn();
    this.mocks.formsSubmit = jest.fn();

    // Auth API mocks
    this.mocks.authLogin = jest.fn();
    this.mocks.authLogout = jest.fn();
    this.mocks.authValidate = jest.fn();
    this.mocks.authGetProfile = jest.fn();
    this.mocks.authUpdateProfile = jest.fn();
  }

  // Client API mocks
  mockClientsGetAll(response?: any, error?: Error): void {
    if (error) {
      this.mocks.clientsGetAll.mockRejectedValue(error);
    } else {
      this.mocks.clientsGetAll.mockResolvedValue(response || {
        data: [global.testUtils.generateTestClient()],
        total: 1,
        page: 1,
        totalPages: 1
      });
    }
  }

  mockClientsCreate(response?: any, error?: Error): void {
    if (error) {
      this.mocks.clientsCreate.mockRejectedValue(error);
    } else {
      this.mocks.clientsCreate.mockResolvedValue(response || global.testUtils.generateTestClient());
    }
  }

  mockClientsUpdate(response?: any, error?: Error): void {
    if (error) {
      this.mocks.clientsUpdate.mockRejectedValue(error);
    } else {
      this.mocks.clientsUpdate.mockResolvedValue(response || global.testUtils.generateTestClient());
    }
  }

  // Device API mocks
  mockDevicesGetAll(response?: any, error?: Error): void {
    if (error) {
      this.mocks.devicesGetAll.mockRejectedValue(error);
    } else {
      this.mocks.devicesGetAll.mockResolvedValue(response || {
        data: [global.testUtils.generateTestDevice()],
        total: 1,
        page: 1,
        totalPages: 1
      });
    }
  }

  mockDevicesCreate(response?: any, error?: Error): void {
    if (error) {
      this.mocks.devicesCreate.mockRejectedValue(error);
    } else {
      this.mocks.devicesCreate.mockResolvedValue(response || global.testUtils.generateTestDevice());
    }
  }

  // Form API mocks
  mockFormsGetAll(response?: any, error?: Error): void {
    if (error) {
      this.mocks.formsGetAll.mockRejectedValue(error);
    } else {
      this.mocks.formsGetAll.mockResolvedValue(response || {
        data: [global.testUtils.generateTestForm()],
        total: 1,
        page: 1,
        totalPages: 1
      });
    }
  }

  mockFormsSubmit(response?: any, error?: Error): void {
    if (error) {
      this.mocks.formsSubmit.mockRejectedValue(error);
    } else {
      this.mocks.formsSubmit.mockResolvedValue(response || {
        id: `submission-${Date.now()}`,
        status: 'completed'
      });
    }
  }

  // Auth API mocks
  mockAuthLogin(response?: any, error?: Error): void {
    if (error) {
      this.mocks.authLogin.mockRejectedValue(error);
    } else {
      this.mocks.authLogin.mockResolvedValue(response || {
        token: `mock_token_${Date.now()}`,
        user: global.testUtils.generateTestUser(),
        expiresIn: '1h'
      });
    }
  }

  mockAuthValidate(response?: any, error?: Error): void {
    if (error) {
      this.mocks.authValidate.mockRejectedValue(error);
    } else {
      this.mocks.authValidate.mockResolvedValue(response || {
        valid: true,
        user: global.testUtils.generateTestUser()
      });
    }
  }

  mockAuthGetProfile(response?: any, error?: Error): void {
    if (error) {
      this.mocks.authGetProfile.mockRejectedValue(error);
    } else {
      this.mocks.authGetProfile.mockResolvedValue(response || global.testUtils.generateTestUser());
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
