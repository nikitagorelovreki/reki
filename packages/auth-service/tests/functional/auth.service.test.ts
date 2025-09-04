/**
 * Level 1: Backend Functional Tests - Auth Service
 * Tests authentication logic with real database, mocked HTTP
 */

import { AuthService } from '../../src/auth.service';
import { UserRepository } from '@reki/auth-persistence';
import { CreateUserRequest, LoginRequest, UserRole } from '@reki/auth-domain';

describe('AuthService - Functional Tests', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let db: any;

  beforeAll(() => {
    db = global.getTestDb();
    userRepository = new UserRepository(db);
    authService = new AuthService(userRepository);
  });

  describe('User Registration', () => {
    it('should register new user and hash password', async () => {
      const createRequest: CreateUserRequest = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER
      };

      global.mockHttp.mockEmailService.mockResolvedValue({ sent: true });

      const result = await authService.registerUser(createRequest);

      // Verify service response (no password in response)
      expect(result.id).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result.password).toBeUndefined();
      expect(result.role).toBe(UserRole.USER);

      // Verify database persistence with hashed password
      const savedUser = await db('users').where('id', result.id).first();
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.password_hash).toBeDefined();
      expect(savedUser.password_hash).not.toBe('SecurePassword123!');
      expect(savedUser.role).toBe('USER');

      // Verify welcome email sent
      expect(global.mockHttp.mockEmailService).toHaveBeenCalledWith({
        to: 'test@example.com',
        template: 'welcome',
        data: expect.objectContaining({
          firstName: 'Test',
          username: 'testuser'
        })
      });
    });

    it('should prevent duplicate email registration', async () => {
      const userData = global.testUtils.generateTestUser({
        email: 'duplicate@test.com'
      });

      await authService.registerUser(userData);

      await expect(authService.registerUser(userData))
        .rejects.toThrow('Email already exists');
    });

    it('should prevent duplicate username registration', async () => {
      const userData1 = global.testUtils.generateTestUser({
        username: 'duplicate_user',
        email: 'user1@test.com'
      });
      
      const userData2 = global.testUtils.generateTestUser({
        username: 'duplicate_user', 
        email: 'user2@test.com'
      });

      await authService.registerUser(userData1);

      await expect(authService.registerUser(userData2))
        .rejects.toThrow('Username already exists');
    });

    it('should validate password requirements', async () => {
      const weakPasswordUser = global.testUtils.generateTestUser({
        password: '123' // Too weak
      });

      await expect(authService.registerUser(weakPasswordUser))
        .rejects.toThrow('Password does not meet requirements');
    });
  });

  describe('User Authentication', () => {
    let testUser: any;

    beforeEach(async () => {
      const userData = global.testUtils.generateTestUser({
        email: 'auth@test.com',
        password: 'TestPassword123!'
      });
      testUser = await authService.registerUser(userData);
    });

    it('should authenticate user with valid credentials', async () => {
      const loginRequest: LoginRequest = {
        email: 'auth@test.com',
        password: 'TestPassword123!'
      };

      global.mockHttp.mockExternalAPI.mockResolvedValue({ 
        audit_logged: true 
      });

      const result = await authService.login(loginRequest);

      // Verify authentication result
      expect(result.token).toBeDefined();
      expect(result.user.id).toBe(testUser.id);
      expect(result.user.email).toBe('auth@test.com');
      expect(result.user.password).toBeUndefined();
      expect(result.expiresIn).toBe('1h');

      // Verify login audit log
      expect(global.mockHttp.mockExternalAPI).toHaveBeenCalledWith({
        endpoint: '/audit/login',
        method: 'POST',
        data: expect.objectContaining({
          userId: testUser.id,
          email: 'auth@test.com',
          timestamp: expect.any(Date),
          success: true
        })
      });

      // Verify last login time updated
      const updatedUser = await db('users').where('id', testUser.id).first();
      expect(updatedUser.last_login_at).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const loginRequest: LoginRequest = {
        email: 'auth@test.com',
        password: 'WrongPassword'
      };

      global.mockHttp.mockExternalAPI.mockResolvedValue({ 
        audit_logged: true 
      });

      await expect(authService.login(loginRequest))
        .rejects.toThrow('Invalid credentials');

      // Verify failed login audit
      expect(global.mockHttp.mockExternalAPI).toHaveBeenCalledWith({
        endpoint: '/audit/login',
        method: 'POST',
        data: expect.objectContaining({
          email: 'auth@test.com',
          success: false,
          reason: 'invalid_password'
        })
      });
    });

    it('should reject login for non-existent user', async () => {
      const loginRequest: LoginRequest = {
        email: 'nonexistent@test.com',
        password: 'SomePassword123!'
      };

      await expect(authService.login(loginRequest))
        .rejects.toThrow('Invalid credentials');
    });

    it('should handle account lockout after failed attempts', async () => {
      const loginRequest: LoginRequest = {
        email: 'auth@test.com',
        password: 'WrongPassword'
      };

      // Simulate multiple failed attempts
      for (let i = 0; i < 5; i++) {
        try {
          await authService.login(loginRequest);
        } catch (error) {
          // Expected failure
        }
      }

      // Account should be locked
      const validLogin: LoginRequest = {
        email: 'auth@test.com',
        password: 'TestPassword123!'
      };

      await expect(authService.login(validLogin))
        .rejects.toThrow('Account locked due to multiple failed attempts');

      // Verify lock status in database
      const user = await db('users').where('id', testUser.id).first();
      expect(user.locked_until).toBeDefined();
      expect(new Date(user.locked_until)).toBeInstanceOf(Date);
    });
  });

  describe('Token Management', () => {
    let testUser: any;
    let validToken: string;

    beforeEach(async () => {
      const userData = global.testUtils.generateTestUser();
      testUser = await authService.registerUser(userData);
      
      const loginResult = await authService.login({
        email: userData.email,
        password: userData.password
      });
      validToken = loginResult.token;
    });

    it('should validate valid JWT token', async () => {
      const result = await authService.validateToken(validToken);

      expect(result.valid).toBe(true);
      expect(result.user.id).toBe(testUser.id);
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.role).toBe(testUser.role);
    });

    it('should reject expired token', async () => {
      // Mock expired token
      const expiredToken = 'expired.jwt.token';
      
      await expect(authService.validateToken(expiredToken))
        .rejects.toThrow('Token expired');
    });

    it('should reject malformed token', async () => {
      const malformedToken = 'invalid.token.format';
      
      await expect(authService.validateToken(malformedToken))
        .rejects.toThrow('Invalid token format');
    });

    it('should refresh valid token before expiration', async () => {
      const refreshed = await authService.refreshToken(validToken);

      expect(refreshed.token).toBeDefined();
      expect(refreshed.token).not.toBe(validToken);
      expect(refreshed.user.id).toBe(testUser.id);
    });

    it('should logout and invalidate token', async () => {
      await authService.logout(validToken);

      // Token should be invalidated
      await expect(authService.validateToken(validToken))
        .rejects.toThrow('Token invalidated');

      // Verify blacklisted token in database
      const blacklistedToken = await db('token_blacklist')
        .where('token_hash', expect.any(String))
        .first();
      expect(blacklistedToken).toBeDefined();
    });
  });

  describe('User Profile Management', () => {
    let testUser: any;

    beforeEach(async () => {
      const userData = global.testUtils.generateTestUser();
      testUser = await authService.registerUser(userData);
    });

    it('should update user profile information', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+7900111222'
      };

      const result = await authService.updateProfile(testUser.id, updateData);

      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
      expect(result.phone).toBe('+7900111222');

      // Verify database update
      const updatedUser = await db('users').where('id', testUser.id).first();
      expect(updatedUser.first_name).toBe('Updated');
      expect(updatedUser.last_name).toBe('Name');
      expect(updatedUser.phone).toBe('+7900111222');
    });

    it('should change user password with validation', async () => {
      const changePasswordData = {
        currentPassword: testUser.password,
        newPassword: 'NewSecurePassword123!'
      };

      await authService.changePassword(testUser.id, changePasswordData);

      // Verify user can login with new password
      const loginResult = await authService.login({
        email: testUser.email,
        password: 'NewSecurePassword123!'
      });

      expect(loginResult.token).toBeDefined();
    });

    it('should reject password change with wrong current password', async () => {
      const changePasswordData = {
        currentPassword: 'WrongCurrentPassword',
        newPassword: 'NewSecurePassword123!'
      };

      await expect(authService.changePassword(testUser.id, changePasswordData))
        .rejects.toThrow('Current password is incorrect');
    });
  });

  describe('Role and Permission Management', () => {
    let adminUser: any;
    let regularUser: any;

    beforeEach(async () => {
      adminUser = await authService.registerUser({
        ...global.testUtils.generateTestUser(),
        role: UserRole.ADMIN
      });

      regularUser = await authService.registerUser({
        ...global.testUtils.generateTestUser(),
        role: UserRole.USER
      });
    });

    it('should update user role with proper authorization', async () => {
      const result = await authService.updateUserRole(
        adminUser.id,
        regularUser.id,
        UserRole.MANAGER
      );

      expect(result.role).toBe(UserRole.MANAGER);

      // Verify database update
      const updatedUser = await db('users').where('id', regularUser.id).first();
      expect(updatedUser.role).toBe('MANAGER');
    });

    it('should prevent role update by non-admin user', async () => {
      await expect(authService.updateUserRole(
        regularUser.id, // Non-admin trying to update role
        adminUser.id,
        UserRole.USER
      )).rejects.toThrow('Insufficient permissions');
    });

    it('should check user permissions correctly', async () => {
      const adminPermissions = await authService.getUserPermissions(adminUser.id);
      const userPermissions = await authService.getUserPermissions(regularUser.id);

      expect(adminPermissions).toContain('user_management');
      expect(adminPermissions).toContain('system_configuration');
      expect(userPermissions).not.toContain('user_management');
      expect(userPermissions).toContain('view_own_profile');
    });
  });

  describe('Error Handling', () => {
    it('should handle external audit service failures gracefully', async () => {
      global.mockHttp.mockExternalAPI.mockRejectedValue(
        new Error('Audit service unavailable')
      );

      const userData = global.testUtils.generateTestUser();
      
      // Should still complete login despite audit failure
      const user = await authService.registerUser(userData);
      const result = await authService.login({
        email: userData.email,
        password: userData.password
      });

      expect(result.token).toBeDefined();
    });

    it('should handle email service failures during registration', async () => {
      global.mockHttp.mockEmailService.mockRejectedValue(
        new Error('Email service down')
      );

      const userData = global.testUtils.generateTestUser();
      
      // Should still register user
      const result = await authService.registerUser(userData);
      expect(result.id).toBeDefined();

      // Should queue email for retry
      const queuedEmails = await db('pending_emails')
        .where('user_id', result.id);
      expect(queuedEmails).toHaveLength(1);
    });
  });
});
