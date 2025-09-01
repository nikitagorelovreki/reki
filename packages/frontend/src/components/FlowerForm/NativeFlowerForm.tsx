import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Alert, Button, Space, Typography } from 'antd';
import { getFormsByType } from '../../api/forms';
import LFKExamForm from './LFKExamForm';
import FIMForm from './FIMForm';

const { Title } = Typography;

interface NativeFlowerFormProps {
  clientId: string;
  formType?: 'lfk' | 'fim';
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

const NativeFlowerForm: React.FC<NativeFlowerFormProps> = ({
  clientId,
  formType = 'lfk',
  onSubmit,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formId, setFormId] = useState<string>('');
  const [activeFormType, setActiveFormType] = useState<'lfk' | 'fim'>(formType);

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        // Получаем все формы указанного типа
        const response = await getFormsByType(activeFormType);
        
        if (response.data && response.data.length > 0) {
          // Используем первую форму указанного типа
          setFormId(response.data[0].id);
        } else {
          setError(`Не найдена форма типа: ${activeFormType}`);
        }
      } catch (err) {
        console.error('Error loading form:', err);
        setError('Ошибка загрузки формы');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [activeFormType]);

  const handleFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const renderForm = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="Загрузка формы..." />
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          showIcon
        />
      );
    }

    if (!formId) {
      return (
        <Alert
          message="Форма не найдена"
          description="Не удалось найти форму указанного типа"
          type="warning"
          showIcon
        />
      );
    }

    switch (activeFormType) {
      case 'lfk':
        return (
          <LFKExamForm
            clientId={clientId}
            formId={formId}
            onSubmit={handleFormSubmit}
            onClose={onClose}
          />
        );
      case 'fim':
        return (
          <FIMForm
            clientId={clientId}
            formId={formId}
            onSubmit={handleFormSubmit}
            onClose={onClose}
          />
        );
      default:
        return (
          <Alert
            message="Неподдерживаемый тип формы"
            description={`Тип формы ${activeFormType} не поддерживается`}
            type="warning"
            showIcon
          />
        );
    }
  };

  return (
    <div className="native-flower-form">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              {activeFormType === 'lfk' ? 'Осмотр ЛФК' : 'FIM — мера функциональной независимости'}
            </Title>
            <Space>
              <Button 
                type={activeFormType === 'lfk' ? 'primary' : 'default'} 
                onClick={() => setActiveFormType('lfk')}
              >
                Осмотр ЛФК
              </Button>
              <Button 
                type={activeFormType === 'fim' ? 'primary' : 'default'} 
                onClick={() => setActiveFormType('fim')}
              >
                FIM
              </Button>
              {onClose && (
                <Button onClick={onClose}>
                  Закрыть
                </Button>
              )}
            </Space>
          </div>
        }
        bordered={false}
        style={{ background: 'transparent' }}
        bodyStyle={{ padding: 0 }}
      >
        {renderForm()}
      </Card>
    </div>
  );
};

export default NativeFlowerForm;
