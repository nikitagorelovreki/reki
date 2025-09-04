/**
 * Level 1: Frontend Functional Tests - Form API Integration
 * Tests form management with mocked APIs
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock form management component
const FormManagement = () => {
  const [forms, setForms] = React.useState([]);
  const [submissions, setSubmissions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const loadForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await global.apiMocks.getMock('formsGetAll')();
      setForms(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (templateId, clientId, data) => {
    setLoading(true);
    try {
      const submission = await global.apiMocks.getMock('formsSubmit')({
        templateId,
        clientId,
        submittedBy: 'therapist-001',
        data
      });
      setSubmissions(prev => [...prev, submission]);
      return submission;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createForm = async (formData) => {
    setLoading(true);
    try {
      const newForm = await global.apiMocks.getMock('formsCreate')(formData);
      setForms(prev => [...prev, newForm]);
      return newForm;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadForms();
  }, []);

  if (loading && forms.length === 0) {
    return <div data-testid="loading">Loading forms...</div>;
  }

  return (
    <div>
      <h1>Form Management</h1>
      {error && <div data-testid="error">{error}</div>}
      
      <div data-testid="form-count">Forms: {forms.length}</div>
      <div data-testid="submission-count">Submissions: {submissions.length}</div>

      <div data-testid="form-list">
        {forms.map(form => (
          <div key={form.id} data-testid={`form-${form.id}`}>
            <h3>{form.name}</h3>
            <p>{form.description}</p>
            <span data-testid={`active-${form.id}`}>
              {form.isActive ? 'Active' : 'Inactive'}
            </span>
            <button 
              data-testid={`submit-${form.id}`}
              onClick={() => submitForm(form.id, 'client-123', { score: 8 })}
            >
              Submit Test Response
            </button>
          </div>
        ))}
      </div>

      <div data-testid="submission-list">
        {submissions.map(submission => (
          <div key={submission.id} data-testid={`submission-${submission.id}`}>
            <span>Status: {submission.status}</span>
          </div>
        ))}
      </div>

      <button data-testid="create-form" onClick={() => createForm({
        name: 'New Assessment Form',
        description: 'Test form description',
        fields: [
          { name: 'score', type: 'number', label: 'Score', required: true }
        ],
        isActive: true
      })}>
        Create Form
      </button>
    </div>
  );
};

describe('Form API Integration - Level 1 Functional Tests', () => {
  beforeEach(() => {
    global.apiMocks.reset();
  });

  describe('Form Loading', () => {
    it('should load and display form templates', async () => {
      const mockForms = [
        global.testUtils.generateTestForm({
          id: 'form-1',
          name: 'FIM Assessment',
          description: 'Functional Independence Measure',
          isActive: true
        }),
        global.testUtils.generateTestForm({
          id: 'form-2',
          name: 'Pain Scale',
          description: 'Patient pain assessment',
          isActive: false
        })
      ];

      global.apiMocks.mockFormsGetAll({
        data: mockForms,
        total: 2
      });

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 2');
        expect(screen.getByTestId('form-form-1')).toBeInTheDocument();
        expect(screen.getByTestId('form-form-2')).toBeInTheDocument();
      });

      expect(screen.getByText('FIM Assessment')).toBeInTheDocument();
      expect(screen.getByText('Pain Scale')).toBeInTheDocument();
      expect(screen.getByTestId('active-form-1')).toHaveTextContent('Active');
      expect(screen.getByTestId('active-form-2')).toHaveTextContent('Inactive');

      global.apiMocks.expectCalled('formsGetAll');
    });

    it('should handle loading errors', async () => {
      global.apiMocks.mockFormsGetAll(null, new Error('Failed to load forms'));

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load forms');
      });
    });

    it('should handle empty form list', async () => {
      global.apiMocks.mockFormsGetAll({
        data: [],
        total: 0
      });

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 0');
      });
    });
  });

  describe('Form Creation', () => {
    it('should create new form template', async () => {
      global.apiMocks.mockFormsGetAll({ data: [], total: 0 });

      const newForm = global.testUtils.generateTestForm({
        id: 'new-form-123',
        name: 'New Assessment Form',
        isActive: true
      });

      global.apiMocks.mockFormsCreate(newForm);

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 0');
      });

      fireEvent.click(screen.getByTestId('create-form'));

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 1');
        expect(screen.getByTestId('form-new-form-123')).toBeInTheDocument();
        expect(screen.getByText('New Assessment Form')).toBeInTheDocument();
      });

      global.apiMocks.expectCalled('formsCreate');
    });

    it('should handle creation errors', async () => {
      global.apiMocks.mockFormsGetAll({ data: [], total: 0 });
      global.apiMocks.mockFormsCreate(null, new Error('Form validation failed'));

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 0');
      });

      fireEvent.click(screen.getByTestId('create-form'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Form validation failed');
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 0');
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form and track submissions', async () => {
      const mockForm = global.testUtils.generateTestForm({
        id: 'submit-form',
        name: 'Test Assessment'
      });

      global.apiMocks.mockFormsGetAll({
        data: [mockForm],
        total: 1
      });

      const mockSubmission = {
        id: 'submission-123',
        status: 'completed',
        templateId: 'submit-form',
        clientId: 'client-123'
      };

      global.apiMocks.mockFormsSubmit(mockSubmission);

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 1');
      });

      fireEvent.click(screen.getByTestId('submit-submit-form'));

      await waitFor(() => {
        expect(screen.getByTestId('submission-count')).toHaveTextContent('Submissions: 1');
        expect(screen.getByTestId('submission-submission-123')).toBeInTheDocument();
        expect(screen.getByText('Status: completed')).toBeInTheDocument();
      });

      global.apiMocks.expectCalled('formsSubmit', expect.objectContaining({
        templateId: 'submit-form',
        clientId: 'client-123',
        data: { score: 8 }
      }));
    });

    it('should handle submission validation errors', async () => {
      const mockForm = global.testUtils.generateTestForm({
        id: 'validation-form'
      });

      global.apiMocks.mockFormsGetAll({
        data: [mockForm],
        total: 1
      });
      
      global.apiMocks.mockFormsSubmit(null, new Error('Validation failed: score exceeds maximum'));

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 1');
      });

      fireEvent.click(screen.getByTestId('submit-validation-form'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Validation failed: score exceeds maximum');
        expect(screen.getByTestId('submission-count')).toHaveTextContent('Submissions: 0');
      });
    });

    it('should handle multiple form submissions', async () => {
      const mockForms = [
        global.testUtils.generateTestForm({ id: 'form-1' }),
        global.testUtils.generateTestForm({ id: 'form-2' })
      ];

      global.apiMocks.mockFormsGetAll({
        data: mockForms,
        total: 2
      });

      global.apiMocks.mockFormsSubmit((data) => ({
        id: `submission-${Date.now()}`,
        status: 'completed',
        templateId: data.templateId
      }));

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 2');
      });

      // Submit first form
      fireEvent.click(screen.getByTestId('submit-form-1'));

      await waitFor(() => {
        expect(screen.getByTestId('submission-count')).toHaveTextContent('Submissions: 1');
      });

      // Submit second form
      fireEvent.click(screen.getByTestId('submit-form-2'));

      await waitFor(() => {
        expect(screen.getByTestId('submission-count')).toHaveTextContent('Submissions: 2');
      });

      expect(global.apiMocks.getMock('formsSubmit')).toHaveBeenCalledTimes(2);
    });
  });

  describe('Form Template Management', () => {
    it('should display form structure correctly', async () => {
      const complexForm = global.testUtils.generateTestForm({
        id: 'complex-form',
        name: 'Complex Assessment',
        fields: [
          { name: 'score1', type: 'number', label: 'Score 1', required: true },
          { name: 'score2', type: 'number', label: 'Score 2', required: true },
          { name: 'notes', type: 'textarea', label: 'Notes', required: false }
        ]
      });

      global.apiMocks.mockFormsGetAll({
        data: [complexForm],
        total: 1
      });

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('form-complex-form')).toBeInTheDocument();
        expect(screen.getByText('Complex Assessment')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from network failures', async () => {
      // Initial load fails
      global.apiMocks.mockFormsGetAll(null, new Error('Network error'));

      render(<FormManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });

      // Update mock to succeed
      const mockForms = [global.testUtils.generateTestForm()];
      global.apiMocks.mockFormsGetAll({ data: mockForms, total: 1 });

      // Component should retry on user action (like creating a form)
      global.apiMocks.mockFormsCreate(global.testUtils.generateTestForm({ id: 'recovery-form' }));

      fireEvent.click(screen.getByTestId('create-form'));

      await waitFor(() => {
        expect(screen.getByTestId('form-count')).toHaveTextContent('Forms: 1');
      });
    });
  });
});
