import React, { useEffect, useRef, useState } from 'react';
import { getFormById, importFlowerFormData } from '../../api/forms';
import { Form } from '../../api/forms';
import './FlowerFormIntegration.css';

interface FlowerFormIntegrationProps {
  clientId: string;
  formType: 'lfk' | 'fim';
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

const FlowerFormIntegration: React.FC<FlowerFormIntegrationProps> = ({
  clientId,
  formType,
  onSubmit,
  onClose
}) => {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        // Get all forms of the specified type
        const response = await fetch(`/api/forms/type/${formType}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Use the first form of the specified type
          setForm(data.data[0]);
        } else {
          setError(`No form found for type: ${formType}`);
        }
      } catch (err) {
        console.error('Error loading form:', err);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formType]);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify the origin
      if (event.origin !== window.location.origin) {
        return;
      }

      // Handle form data submission
      if (event.data && event.data.type === 'flowerFormSubmit' && event.data.formData) {
        try {
          if (!form) {
            throw new Error('Form not found');
          }

          // Import the form data
          const result = await importFlowerFormData(
            clientId,
            form.id,
            event.data.formData,
            event.data.formData.therapist_name
          );

          // Call the onSubmit callback if provided
          if (onSubmit) {
            onSubmit(result);
          }
        } catch (err) {
          console.error('Error submitting form data:', err);
          setError('Failed to submit form data');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [clientId, form, onSubmit]);

  const handleIframeLoad = () => {
    // Send client ID to the iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'initFlowerForm', clientId, formType },
        window.location.origin
      );
    }
  };

  if (loading) {
    return <div className='flower-form-loading'>Loading form...</div>;
  }

  if (error) {
    return <div className='flower-form-error'>Error: {error}</div>;
  }

  return (
    <div className='flower-form-container'>
      <div className='flower-form-header'>
        <h2>{form?.name || `${formType.toUpperCase()} Form`}</h2>
        {onClose && (
          <button className='flower-form-close-btn' onClick={onClose}>
            Close
          </button>
        )}
      </div>
      <iframe
        ref={iframeRef}
        src='/flower-form/index.html'
        title='Flower Form'
        className='flower-form-iframe'
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

export default FlowerFormIntegration;
