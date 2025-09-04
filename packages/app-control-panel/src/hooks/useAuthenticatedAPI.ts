import { useEffect } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

export const useAuthenticatedAPI = () => {
  const { token, logout } = useAuth();

  useEffect(() => {
    // Intercept fetch requests to add authentication header
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const config: RequestInit = {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      try {
        const response = await originalFetch(input, config);
        
        // Handle 401 Unauthorized responses
        if (response.status === 401) {
          message.error('Session expired. Please log in again.');
          logout();
          return response;
        }

        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, [token, logout]);

  return { token };
};
