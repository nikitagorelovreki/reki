/**
 * Level 1: Frontend Functional Tests - Auth Context
 * Tests authentication logic with mocked APIs
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@reki/app-control-panel/src/contexts/AuthContext';

// Test component to access auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user-email">{user?.email || 'not-logged-in'}</div>
      <button data-testid="login-btn" onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext - Level 1 Functional Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    global.apiMocks.reset();
  });

  describe('Authentication State Management', () => {
    it('should initialize with unauthenticated state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-email')).toHaveTextContent('not-logged-in');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('should restore authentication from localStorage', async () => {
      const mockUser = global.testUtils.generateTestUser();
      const mockToken = 'stored_token_123';

      localStorage.setItem('auth_token', mockToken);
      global.apiMocks.mockAuthValidate({ valid: true, user: mockUser });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
      });

      global.apiMocks.expectCalled('authValidate');
    });

    it('should handle invalid stored token', async () => {
      localStorage.setItem('auth_token', 'invalid_token');
      global.apiMocks.mockAuthValidate(null, new Error('Invalid token'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(localStorage.getItem('auth_token')).toBeNull();
      });
    });
  });

  describe('Login Process', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = global.testUtils.generateTestUser({
        email: 'test@example.com'
      });
      const mockToken = 'login_token_456';

      global.apiMocks.mockAuthLogin({
        token: mockToken,
        user: mockUser,
        expiresIn: '1h'
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      loginBtn.click();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        expect(localStorage.getItem('auth_token')).toBe(mockToken);
      });

      global.apiMocks.expectCalled('authLogin');
    });

    it('should handle login failure', async () => {
      global.apiMocks.mockAuthLogin(null, new Error('Invalid credentials'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      loginBtn.click();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('user-email')).toHaveTextContent('not-logged-in');
        expect(localStorage.getItem('auth_token')).toBeNull();
      });
    });

    it('should show loading state during login', async () => {
      global.apiMocks.mockAuthLogin({
        token: 'token',
        user: global.testUtils.generateTestUser()
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      
      // Check initial loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      
      loginBtn.click();
      
      // Should show loading during API call
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });
    });
  });

  describe('Logout Process', () => {
    it('should logout successfully', async () => {
      // Setup authenticated state
      const mockUser = global.testUtils.generateTestUser();
      const mockToken = 'logout_test_token';

      localStorage.setItem('auth_token', mockToken);
      global.apiMocks.mockAuthValidate({ valid: true, user: mockUser });
      global.apiMocks.mockAuthLogout({ success: true });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for authentication to load
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      // Logout
      const logoutBtn = screen.getByTestId('logout-btn');
      logoutBtn.click();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('user-email')).toHaveTextContent('not-logged-in');
        expect(localStorage.getItem('auth_token')).toBeNull();
      });

      global.apiMocks.expectCalled('authLogout');
    });

    it('should logout even if API call fails', async () => {
      // Setup authenticated state
      const mockUser = global.testUtils.generateTestUser();
      const mockToken = 'logout_fail_token';

      localStorage.setItem('auth_token', mockToken);
      global.apiMocks.mockAuthValidate({ valid: true, user: mockUser });
      global.apiMocks.mockAuthLogout(null, new Error('Logout API failed'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      const logoutBtn = screen.getByTestId('logout-btn');
      logoutBtn.click();

      // Should still logout locally
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(localStorage.getItem('auth_token')).toBeNull();
      });
    });
  });

  describe('Token Validation', () => {
    it('should validate token on app startup', async () => {
      const mockToken = 'startup_validation_token';
      const mockUser = global.testUtils.generateTestUser();

      localStorage.setItem('auth_token', mockToken);
      global.apiMocks.mockAuthValidate({ valid: true, user: mockUser });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
      });

      global.apiMocks.expectCalled('authValidate', expect.objectContaining({
        token: mockToken
      }));
    });

    it('should handle expired token during validation', async () => {
      const expiredToken = 'expired_token_123';

      localStorage.setItem('auth_token', expiredToken);
      global.apiMocks.mockAuthValidate(null, new Error('Token expired'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(localStorage.getItem('auth_token')).toBeNull();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      global.apiMocks.mockAuthLogin(null, new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      loginBtn.click();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    it('should handle malformed API responses', async () => {
      global.apiMocks.mockAuthLogin({ malformed: 'response' });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      loginBtn.click();

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });
    });
  });
});
