import React, { useEffect, useRef } from 'react';
import { Card, Spin } from 'antd';
import { apiClient } from '../api/client';

interface FlowerFormIntegrationProps {
  clientId?: string;
  formType?: 'lfk' | 'fim' | 'patients';
  onFormSubmit?: (data: any) => void;
}

/**
 * Компонент для интеграции Flower Form в React-приложение
 */
const FlowerFormIntegration: React.FC<FlowerFormIntegrationProps> = ({
  clientId,
  formType = 'lfk',
  onFormSubmit,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = React.useState(true);

  // Обработчик сообщений от iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Проверяем, что сообщение от нашего iframe
      if (
        event.origin === window.location.origin &&
        event.data &&
        event.data.type === 'flowerFormSubmit'
      ) {
        console.log('Received form data from Flower Form:', event.data.formData);
        
        // Если передан обработчик, вызываем его
        if (onFormSubmit) {
          onFormSubmit(event.data.formData);
        }
        
        // Сохраняем данные через API
        if (clientId) {
          saveFormData(clientId, formType, event.data.formData);
        }
      }
    };

    // Добавляем обработчик сообщений
    window.addEventListener('message', handleMessage);
    
    // Удаляем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [clientId, formType, onFormSubmit]);

  // Инициализация iframe после загрузки
  const handleIframeLoad = () => {
    setLoading(false);
    
    // Отправляем данные для инициализации формы
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'initFlowerForm',
        clientId,
        formType,
      }, window.location.origin);
    }
  };

  // Сохранение данных формы через API
  const saveFormData = async (patientId: string, type: string, data: any) => {
    try {
      // Проверяем, существует ли уже запись для этого пациента и типа формы
      const response = await apiClient.get(`/form-entries`, {
        params: {
          patientId,
          formType: type,
          limit: 1,
        },
      });
      
      let formEntryId;
      
      if (response.data.data.length > 0) {
        // Обновляем существующую запись
        formEntryId = response.data.data[0].id;
        await apiClient.patch(`/form-entries/${formEntryId}/data`, { data });
        console.log('Form data updated successfully');
      } else {
        // Создаем новую запись
        // Сначала находим подходящую форму по типу
        const formsResponse = await apiClient.get(`/forms/type/${type}`);
        if (formsResponse.data.length === 0) {
          console.error('No form template found for type:', type);
          return;
        }
        
        // Берем первую активную форму или просто первую, если активных нет
        const formTemplate = formsResponse.data.find((f: any) => f.status === 'ACTIVE') || formsResponse.data[0];
        
        // Создаем новую запись заполнения формы
        const newFormEntry = await apiClient.post('/form-entries', {
          formId: formTemplate.id,
          patientId,
          data,
        });
        
        console.log('New form entry created:', newFormEntry.data);
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  return (
    <Card title="Форма осмотра" style={{ width: '100%', height: '100%', minHeight: '80vh' }}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1000
        }}>
          <Spin size="large" tip="Загрузка формы..." />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/flower-form/index.html"
        style={{
          width: '100%',
          height: '80vh',
          border: 'none',
        }}
        onLoad={handleIframeLoad}
        title="Flower Form"
      />
    </Card>
  );
};

export default FlowerFormIntegration;
