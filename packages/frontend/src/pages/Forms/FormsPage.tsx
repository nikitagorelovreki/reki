import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getForms, 
  getFormsByType, 
  getSubmissionsByClient,
  getSubmissionsByForm,
  getSubmissionsByClientAndForm,
  Form,
  FormSubmission
} from '../../api/forms';
import NativeFlowerForm from '../../components/FlowerForm/NativeFlowerForm';
import { Button, Card, Tabs } from 'antd';
import './FormsPage.css';

interface FormsPageParams {
  clientId?: string;
}

const FormsPage: React.FC = () => {
  const { clientId } = useParams<FormsPageParams>();
  const navigate = useNavigate();
  
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFlowerForm, setShowFlowerForm] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let formsData;
        
        // Load forms
        if (clientId) {
          // If we have a client ID, load all forms
          formsData = await getForms(1, 100);
          
          // Also load submissions for this client
          const submissionsData = await getSubmissionsByClient(clientId, 1, 100);
          setSubmissions(submissionsData.data);
        } else {
          // If no client ID, just load all forms
          formsData = await getForms(1, 100);
        }
        
        setForms(formsData.data);
      } catch (err) {
        console.error('Error loading forms data:', err);
        setError('Failed to load forms data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  const handleFormSelect = (form: Form) => {
    setSelectedForm(form);
    
    // If we have a client ID, try to find submissions for this form and client
    if (clientId) {
      const loadSubmissions = async () => {
        try {
          const submissionsData = await getSubmissionsByClientAndForm(clientId, form.id, 1, 100);
          setSubmissions(submissionsData.data);
        } catch (err) {
          console.error('Error loading submissions:', err);
        }
      };
      
      loadSubmissions();
    } else {
      // If no client ID, load all submissions for this form
      const loadSubmissions = async () => {
        try {
          const submissionsData = await getSubmissionsByForm(form.id, 1, 100);
          setSubmissions(submissionsData.data);
        } catch (err) {
          console.error('Error loading submissions:', err);
        }
      };
      
      loadSubmissions();
    }
  };

  const handleSubmissionSelect = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleNewForm = () => {
    if (!selectedForm || !clientId) {
      return;
    }
    
    setShowFlowerForm(true);
  };

  const handleFormSubmit = (data: FormSubmission) => {
    // Add the new submission to the list
    setSubmissions(prev => [data, ...prev]);
    setShowFlowerForm(false);
    
    // Select the new submission
    setSelectedSubmission(data);
  };

  const handleCloseFlowerForm = () => {
    setShowFlowerForm(false);
  };

  if (loading) {
    return <div className="forms-loading">Loading...</div>;
  }

  if (error) {
    return <div className="forms-error">Error: {error}</div>;
  }

  return (
    <div className="forms-page">
      <div className="forms-sidebar">
        <div className="forms-header">
          <h2>Forms</h2>
          {clientId && selectedForm && (
            <Button 
              type="primary"
              onClick={handleNewForm}
            >
              New Form
            </Button>
          )}
        </div>
        
        <div className="forms-list">
          {forms.map(form => (
            <div 
              key={form.id} 
              className={`form-item ${selectedForm?.id === form.id ? 'selected' : ''}`}
              onClick={() => handleFormSelect(form)}
            >
              <div className="form-item-name">{form.name}</div>
              <div className="form-item-type">{form.type.toUpperCase()}</div>
            </div>
          ))}
          
          {forms.length === 0 && (
            <div className="no-forms">No forms available</div>
          )}
        </div>
        
        {selectedForm && (
          <>
            <div className="submissions-header">
              <h3>Submissions</h3>
              {clientId && (
                <span className="submissions-count">
                  {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
                </span>
              )}
            </div>
            
            <div className="submissions-list">
              {submissions.map(submission => (
                <div 
                  key={submission.id} 
                  className={`submission-item ${selectedSubmission?.id === submission.id ? 'selected' : ''}`}
                  onClick={() => handleSubmissionSelect(submission)}
                >
                  <div className="submission-date">
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </div>
                  {submission.therapistName && (
                    <div className="submission-therapist">{submission.therapistName}</div>
                  )}
                </div>
              ))}
              
              {submissions.length === 0 && (
                <div className="no-submissions">No submissions available</div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="forms-content">
        {showFlowerForm && selectedForm && clientId ? (
          <NativeFlowerForm
            clientId={clientId}
            formType={selectedForm.type as 'lfk' | 'fim'}
            onSubmit={handleFormSubmit}
            onClose={handleCloseFlowerForm}
          />
        ) : selectedSubmission ? (
          <div className="submission-details">
            <div className="submission-details-header">
              <h2>{selectedForm?.name || 'Form'} Submission</h2>
              <div className="submission-details-meta">
                <div className="submission-details-date">
                  <span className="label">Date:</span> 
                  {new Date(selectedSubmission.submissionDate).toLocaleDateString()}
                </div>
                {selectedSubmission.therapistName && (
                  <div className="submission-details-therapist">
                    <span className="label">Therapist:</span> 
                    {selectedSubmission.therapistName}
                  </div>
                )}
              </div>
            </div>
            
            <div className="submission-details-content">
              <pre>{JSON.stringify(selectedSubmission.data, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div className="no-selection">
            {selectedForm ? (
              <div>
                <h2>No submission selected</h2>
                <p>Select a submission from the sidebar or create a new one</p>
              </div>
            ) : (
              <div>
                <h2>No form selected</h2>
                <p>Select a form from the sidebar to view submissions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsPage;
