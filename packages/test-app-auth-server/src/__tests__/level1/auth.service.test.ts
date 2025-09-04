/**
 * Level 1: Backend Functional Tests - Auth Service
 * Tests authentication logic with real database, mocked HTTP
 */
import { v4 as uuidv4 } from 'uuid';

describe('AuthService - Level 1 Functional Tests', () => {
  let db: any;

  beforeAll(() => {
    db = global.testDb.getKnex();
  });

  describe('User Validation', () => {
    beforeEach(async () => {
      // Create test user in database for validation tests
      const testUserData = {
        id: uuidv4(),
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: ['USER'],
        permissions: ['READ_PROFILE']
      };
      await db('users').insert({
        id: testUserData.id,
        username: testUserData.username,
        email: testUserData.email,
        password_hash: '$2b$10$hashedpassword',
        first_name: testUserData.firstName,
        last_name: testUserData.lastName,
        role: 'user',
        roles: JSON.stringify(testUserData.roles),
        permissions: JSON.stringify(testUserData.permissions),
        is_active: testUserData.isActive,
        created_at: testUserData.createdAt,
        updated_at: testUserData.updatedAt
      });
      
      // Mock credentials validation in repository
      await db('user_credentials').insert({
        user_id: testUserData.id,
        password_hash: '$2b$10$hashedpassword',
        created_at: new Date()
      });
    });

    it('should validate user credentials successfully', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      // Mock the repository method to return true for valid credentials
      jest.spyOn(repository, 'validateCredentials').mockResolvedValue(true);
      
      const result = await service.validateUser({
        username: 'testuser',
        password: 'correctpassword'
      });

      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null for invalid credentials', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      // Mock the repository method to return false for invalid credentials
      jest.spyOn(repository, 'validateCredentials').mockResolvedValue(false);
      
      const result = await service.validateUser({
        username: 'testuser',
        password: 'wrongpassword'
      });

      expect(result).toBeNull();
    });
  });

  describe('User Authentication', () => {
    let testUser: any;

    beforeEach(async () => {
      // Create test user directly in database
      testUser = {
        id: uuidv4(),
        username: 'authuser',
        email: 'auth@test.com',
        firstName: 'Auth',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: ['USER'],
        permissions: ['READ_PROFILE']
      };
      
      await db('users').insert({
        id: testUser.id,
        username: testUser.username,
        email: testUser.email,
        password_hash: '$2b$10$hashedpassword',
        first_name: testUser.firstName,
        last_name: testUser.lastName,
        is_active: testUser.isActive,
        role: 'user',
        roles: JSON.stringify(testUser.roles),
        permissions: JSON.stringify(testUser.permissions),
        created_at: testUser.createdAt,
        updated_at: testUser.updatedAt
      });
    });

    it('should generate JWT token on login', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      const result = await service.login(testUser);

      expect(result.accessToken).toBeDefined();
      expect(result.user.id).toBe(testUser.id);
      expect(result.user.username).toBe(testUser.username);
    });

    it('should validate JWT token successfully', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      const { accessToken } = await service.login(testUser);
      const result = await service.validateToken(accessToken);

      expect(result).toBeDefined();
      expect(result?.id).toBe(testUser.id);
    });

    it('should return null for invalid token', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      const result = await service.validateToken('invalid.jwt.token');

      expect(result).toBeNull();
    });
  });

  describe('Authorization', () => {
    let testUser: any;
    let adminUser: any;

    beforeEach(async () => {
      testUser = {
        id: uuidv4(),
        username: 'permuser',
        email: 'perm@test.com',
        firstName: 'Perm',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: ['USER'],
        permissions: ['READ_PROFILE', 'EDIT_PROFILE']
      };
      
      adminUser = {
        id: uuidv4(),
        username: 'adminuser',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: ['ADMIN'],
        permissions: ['MANAGE_USERS']
      };
      
      await db('users').insert([
        {
          id: testUser.id,
          username: testUser.username,
          email: testUser.email,
          password_hash: '$2b$10$hashedpassword',
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          role: 'user',
          roles: JSON.stringify(testUser.roles),
          permissions: JSON.stringify(testUser.permissions),
          is_active: testUser.isActive,
          created_at: testUser.createdAt,
          updated_at: testUser.updatedAt
        },
        {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          password_hash: '$2b$10$hashedpassword',
          first_name: adminUser.firstName,
          last_name: adminUser.lastName,
          role: 'admin',
          roles: JSON.stringify(adminUser.roles),
          permissions: JSON.stringify(adminUser.permissions),
          is_active: adminUser.isActive,
          created_at: adminUser.createdAt,
          updated_at: adminUser.updatedAt
        }
      ]);
    });

    it('should check user permissions correctly', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      const hasReadPermission = await service.hasPermission(testUser, 'READ_PROFILE');
      const hasManagePermission = await service.hasPermission(testUser, 'MANAGE_USERS');

      expect(hasReadPermission).toBe(true);
      expect(hasManagePermission).toBe(false);
    });

    it('should grant admin all permissions', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      const hasAnyPermission = await service.hasPermission(adminUser, 'ANY_PERMISSION');
      const hasAdminRole = await service.hasRole(adminUser, 'ADMIN');

      expect(hasAnyPermission).toBe(true);
      expect(hasAdminRole).toBe(true);
    });

    it('should check user roles correctly', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      const hasUserRole = await service.hasRole(testUser, 'USER');
      const hasAdminRole = await service.hasRole(testUser, 'ADMIN');

      expect(hasUserRole).toBe(true);
      expect(hasAdminRole).toBe(false);
    });
  });

  describe('Service Integration', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = {
        id: uuidv4(),
        username: 'integrationuser',
        email: 'integration@test.com',
        firstName: 'Integration',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: ['USER'],
        permissions: ['READ_PROFILE']
      };
      
      await db('users').insert({
        id: testUser.id,
        username: testUser.username,
        email: testUser.email,
        password_hash: '$2b$10$hashedpassword',
        first_name: testUser.firstName,
        last_name: testUser.lastName,
        is_active: testUser.isActive,
        role: 'user',
        roles: JSON.stringify(testUser.roles),
        permissions: JSON.stringify(testUser.permissions),
        created_at: testUser.createdAt,
        updated_at: testUser.updatedAt
      });
    });

    it('should handle full authentication flow', async () => {
      const { AuthService } = await import('@reki/auth-service');
      const { UserRepository } = await import('@reki/auth-persistence');
      const { JwtService } = await import('@nestjs/jwt');
      
      const repository = new UserRepository(db);
      const jwtService = new JwtService({ secret: 'test-secret' });
      const service = new AuthService(repository, jwtService);

      // Mock repository validation
      jest.spyOn(repository, 'validateCredentials').mockResolvedValue(true);

      // Validate credentials
      const validatedUser = await service.validateUser({
        username: 'integrationuser',
        password: 'testpassword'
      });
      expect(validatedUser).toBeDefined();

      // Generate token
      const authResult = await service.login(testUser);
      expect(authResult.accessToken).toBeDefined();
      expect(authResult.user.id).toBe(testUser.id);

      // Validate token
      const tokenUser = await service.validateToken(authResult.accessToken);
      expect(tokenUser?.id).toBe(testUser.id);

      // Check permissions
      const hasPermission = await service.hasPermission(testUser, 'READ_PROFILE');
      expect(hasPermission).toBe(true);
    });
  });
});
