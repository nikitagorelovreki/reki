/**
 * Level 1: Frontend Functional Tests - Client API Integration
 * Tests client management with mocked APIs
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock client management component
const ClientManagement = () => {
  const [clients, setClients] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await global.apiMocks.getMock('clientsGetAll')();
      setClients(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData) => {
    setLoading(true);
    try {
      const newClient = await global.apiMocks.getMock('clientsCreate')(clientData);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, updateData) => {
    setLoading(true);
    try {
      const updatedClient = await global.apiMocks.getMock('clientsUpdate')(id, updateData);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadClients();
  }, []);

  if (loading && clients.length === 0) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div>
      <h1>Client Management</h1>
      {error && <div data-testid="error">{error}</div>}
      
      <div data-testid="client-count">Total: {clients.length}</div>
      
      <div data-testid="client-list">
        {clients.map(client => (
          <div key={client.id} data-testid={`client-${client.id}`}>
            <span>{client.firstName} {client.lastName}</span>
            <span data-testid={`status-${client.id}`}>{client.status}</span>
            <button 
              data-testid={`update-${client.id}`}
              onClick={() => updateClient(client.id, { status: 'completed_therapy' })}
            >
              Complete Therapy
            </button>
          </div>
        ))}
      </div>

      <button data-testid="create-client" onClick={() => createClient({
        firstName: 'New',
        lastName: 'Client',
        email: 'new@example.com',
        status: 'active_therapy'
      })}>
        Create Client
      </button>

      <button data-testid="refresh" onClick={loadClients}>
        Refresh
      </button>
    </div>
  );
};

describe('Client API Integration - Level 1 Functional Tests', () => {
  beforeEach(() => {
    global.apiMocks.reset();
  });

  describe('Client Loading', () => {
    it('should load and display clients', async () => {
      const mockClients = [
        global.testUtils.generateTestClient({
          id: 'client-1',
          firstName: 'Иван',
          lastName: 'Петров',
          status: 'active_therapy'
        }),
        global.testUtils.generateTestClient({
          id: 'client-2', 
          firstName: 'Мария',
          lastName: 'Сидорова',
          status: 'completed_therapy'
        })
      ];

      global.apiMocks.mockClientsGetAll({
        data: mockClients,
        total: 2,
        page: 1,
        totalPages: 1
      });

      render(<ClientManagement />);

      // Should show loading initially
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Should load and display clients
      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 2');
        expect(screen.getByTestId('client-client-1')).toBeInTheDocument();
        expect(screen.getByTestId('client-client-2')).toBeInTheDocument();
      });

      expect(screen.getByText('Иван Петров')).toBeInTheDocument();
      expect(screen.getByText('Мария Сидорова')).toBeInTheDocument();
      expect(screen.getByTestId('status-client-1')).toHaveTextContent('active_therapy');
      expect(screen.getByTestId('status-client-2')).toHaveTextContent('completed_therapy');

      global.apiMocks.expectCalled('clientsGetAll');
    });

    it('should handle loading errors', async () => {
      global.apiMocks.mockClientsGetAll(null, new Error('Failed to load clients'));

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load clients');
      });

      expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 0');
    });

    it('should handle empty client list', async () => {
      global.apiMocks.mockClientsGetAll({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0
      });

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 0');
      });

      expect(screen.queryByTestId('client-list').children).toHaveLength(0);
    });
  });

  describe('Client Creation', () => {
    it('should create new client and update list', async () => {
      // Initial empty list
      global.apiMocks.mockClientsGetAll({
        data: [],
        total: 0
      });

      // Mock successful creation
      const newClient = global.testUtils.generateTestClient({
        id: 'new-client-123',
        firstName: 'New',
        lastName: 'Client',
        status: 'active_therapy'
      });

      global.apiMocks.mockClientsCreate(newClient);

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 0');
      });

      // Create new client
      const createBtn = screen.getByTestId('create-client');
      fireEvent.click(createBtn);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 1');
        expect(screen.getByTestId('client-new-client-123')).toBeInTheDocument();
        expect(screen.getByText('New Client')).toBeInTheDocument();
      });

      global.apiMocks.expectCalled('clientsCreate');
    });

    it('should handle creation errors', async () => {
      global.apiMocks.mockClientsGetAll({ data: [], total: 0 });
      global.apiMocks.mockClientsCreate(null, new Error('Creation failed'));

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 0');
      });

      const createBtn = screen.getByTestId('create-client');
      fireEvent.click(createBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Creation failed');
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 0');
      });
    });
  });

  describe('Client Updates', () => {
    it('should update client status', async () => {
      const mockClient = global.testUtils.generateTestClient({
        id: 'update-client',
        firstName: 'Update',
        lastName: 'Test',
        status: 'active_therapy'
      });

      global.apiMocks.mockClientsGetAll({
        data: [mockClient],
        total: 1
      });

      const updatedClient = { ...mockClient, status: 'completed_therapy' };
      global.apiMocks.mockClientsUpdate(updatedClient);

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('status-update-client')).toHaveTextContent('active_therapy');
      });

      const updateBtn = screen.getByTestId('update-update-client');
      fireEvent.click(updateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('status-update-client')).toHaveTextContent('completed_therapy');
      });

      global.apiMocks.expectCalled('clientsUpdate');
    });

    it('should handle update errors', async () => {
      const mockClient = global.testUtils.generateTestClient({
        id: 'error-client',
        status: 'active_therapy'
      });

      global.apiMocks.mockClientsGetAll({
        data: [mockClient],
        total: 1
      });
      global.apiMocks.mockClientsUpdate(null, new Error('Update failed'));

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('client-error-client')).toBeInTheDocument();
      });

      const updateBtn = screen.getByTestId('update-error-client');
      fireEvent.click(updateBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Update failed');
        // Status should remain unchanged
        expect(screen.getByTestId('status-error-client')).toHaveTextContent('active_therapy');
      });
    });
  });

  describe('Data Refresh', () => {
    it('should refresh client list', async () => {
      // Initial load with one client
      const initialClient = global.testUtils.generateTestClient({
        id: 'initial-client'
      });

      global.apiMocks.mockClientsGetAll({
        data: [initialClient],
        total: 1
      });

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 1');
      });

      // Update mock to return more clients
      const refreshedClients = [
        initialClient,
        global.testUtils.generateTestClient({ id: 'new-client' })
      ];

      global.apiMocks.mockClientsGetAll({
        data: refreshedClients,
        total: 2
      });

      const refreshBtn = screen.getByTestId('refresh');
      fireEvent.click(refreshBtn);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 2');
        expect(screen.getByTestId('client-new-client')).toBeInTheDocument();
      });

      // Should have called API twice (initial + refresh)
      expect(global.apiMocks.getMock('clientsGetAll')).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance and Concurrent Operations', () => {
    it('should handle multiple concurrent API calls', async () => {
      const mockClients = Array.from({ length: 5 }, (_, i) =>
        global.testUtils.generateTestClient({ id: `concurrent-${i}` })
      );

      global.apiMocks.mockClientsGetAll({
        data: mockClients,
        total: 5
      });
      global.apiMocks.mockClientsUpdate((id, data) => ({
        ...mockClients.find(c => c.id === id),
        ...data
      }));

      render(<ClientManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('client-count')).toHaveTextContent('Total: 5');
      });

      // Trigger multiple concurrent updates
      const updateButtons = screen.getAllByTestId(/^update-concurrent-/);
      updateButtons.forEach(btn => fireEvent.click(btn));

      await waitFor(() => {
        // All updates should complete
        expect(global.apiMocks.getMock('clientsUpdate')).toHaveBeenCalledTimes(5);
      });
    });
  });
});
