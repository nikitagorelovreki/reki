import React, { useState } from 'react';
import { Button, Card, Col, message, Modal, Row } from 'antd';
import { FormOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import NativeFlowerForm from '../../components/FlowerForm/NativeFlowerForm';

const FormsDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'lfk' | 'fim'>('lfk');
  
  // Для демо используем фиксированный ID клиента
  const demoClientId = 'demo-client-123';
  
  const showForm = (type: 'lfk' | 'fim') => {
    setFormType(type);
    setIsModalOpen(true);
  };
  
  const handleFormSubmit = (data: any) => {
    message.success('Форма успешно сохранена!');
    setIsModalOpen(false);
  };
  
  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Формы осмотра</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ height: '100%' }}
            cover={
              <div style={{ 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: '#f0f5ff'
              }}>
                <FormOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </div>
            }
            actions={[
              <Button type='primary' onClick={() => showForm('lfk')}>
                Открыть форму
              </Button>
            ]}
          >
            <Card.Meta
              title='Осмотр ЛФК'
              description='Форма для осмотра и оценки двигательных навыков'
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ height: '100%' }}
            cover={
              <div style={{ 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: '#f6ffed'
              }}>
                <MedicineBoxOutlined style={{ fontSize: 48, color: '#52c41a' }} />
              </div>
            }
            actions={[
              <Button type='primary' onClick={() => showForm('fim')}>
                Открыть форму
              </Button>
            ]}
          >
            <Card.Meta
              title='FIM — мера функциональной независимости'
              description='Оценка функциональных возможностей пациента'
            />
          </Card>
        </Col>
      </Row>
      
      <Modal
        title={formType === 'lfk' ? 'Осмотр ЛФК' : 'FIM — мера функциональной независимости'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={1200}
        style={{ top: 20 }}
        footer={null}
        destroyOnClose
      >
        <NativeFlowerForm
          clientId={demoClientId}
          formType={formType}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default FormsDashboard;
