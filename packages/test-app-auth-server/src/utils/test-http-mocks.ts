export class TestHttpMocks {
  private mocks: Record<string, jest.MockedFunction<any>> = {};

  constructor() {
    this.setupMocks();
  }

  private setupMocks(): void {
    // Mock external services for auth
    this.mocks.emailService = jest.fn();
    this.mocks.smsService = jest.fn();
    this.mocks.auditService = jest.fn();
    this.mocks.externalAPI = jest.fn();
    this.mocks.ldapService = jest.fn();
    this.mocks.oauthProvider = jest.fn();
    this.mocks.twoFactorService = jest.fn();
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

  // Audit service mock
  mockAuditService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.auditService.mockRejectedValue(error);
    } else {
      this.mocks.auditService.mockResolvedValue(response || { logged: true });
    }
  }

  // LDAP service mock
  mockLDAPService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.ldapService.mockRejectedValue(error);
    } else {
      this.mocks.ldapService.mockResolvedValue(response || { authenticated: true });
    }
  }

  // OAuth provider mock
  mockOAuthProvider(response?: any, error?: Error): void {
    if (error) {
      this.mocks.oauthProvider.mockRejectedValue(error);
    } else {
      this.mocks.oauthProvider.mockResolvedValue(response || { token: 'oauth_token' });
    }
  }

  // Two-factor service mock
  mockTwoFactorService(response?: any, error?: Error): void {
    if (error) {
      this.mocks.twoFactorService.mockRejectedValue(error);
    } else {
      this.mocks.twoFactorService.mockResolvedValue(response || { verified: true });
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
