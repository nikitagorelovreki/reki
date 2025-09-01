import React, { useState } from 'react';
import { Button, Modal, Drawer, Select, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NativeFlowerForm from './NativeFlowerForm';
import { getFormsByType } from '../../api/forms';

interface FlowerFormButtonProps {
  clientId: string;
  buttonText?: string;
  buttonType?: 'default' | 'primary' | 'link';
  buttonSize?: 'small' | 'middle' | 'large';
  displayMode?: 'modal' | 'drawer' | 'page';
}

const FlowerFormButton: React.FC<FlowerFormButtonProps> = ({
  clientId,
  buttonText = 'Открыть форму',
  buttonType = 'primary',
  buttonSize = 'middle',
  displayMode = 'modal'
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<'lfk' | 'fim'>('lfk');
  const [loading, setLoading] = useState(false);
  const [formSelectVisible, setFormSelectVisible] = useState(false);

  const handleOpen = async () => {
    if (displayMode === 'page') {
      navigate(`/forms/client/${clientId}`);
      return;
    }
    
    setFormSelectVisible(true);
  };

  const handleFormTypeSelect = (type: 'lfk' | 'fim') => {
    setFormType(type);
    setFormSelectVisible(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = (data: any) => {
    message.success('Форма успешно сохранена');
    setIsOpen(false);
  };

  const renderFormContent = () => (
    <NativeFlowerForm
      clientId={clientId}
      formType={formType}
      onSubmit={handleFormSubmit}
      onClose={handleClose}
    />
  );

  return (
    <>
      <Button
        type={buttonType}
        size={buttonSize}
        icon={<FormOutlined />}
        onClick={handleOpen}
      >
        {buttonText}
      </Button>

      <Modal
        title="Выберите тип формы"
        open={formSelectVisible}
        onCancel={() => setFormSelectVisible(false)}
        footer={null}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Button 
            type="primary" 
            block 
            onClick={() => handleFormTypeSelect('lfk')}
          >
            Осмотр ЛФК
          </Button>
          <Button 
            type="primary" 
            block 
            onClick={() => handleFormTypeSelect('fim')}
          >
            FIM — мера функциональной независимости
          </Button>
        </div>
      </Modal>

      {displayMode === 'modal' && (
        <Modal
          title={formType === 'lfk' ? 'Осмотр ЛФК' : 'FIM — мера функциональной независимости'}
          open={isOpen}
          onCancel={handleClose}
          width={1200}
          style={{ top: 20 }}
          footer={null}
          destroyOnClose
        >
          {renderFormContent()}
        </Modal>
      )}

      {displayMode === 'drawer' && (
        <Drawer
          title={formType === 'lfk' ? 'Осмотр ЛФК' : 'FIM — мера функциональной независимости'}
          open={isOpen}
          onClose={handleClose}
          width={1200}
          destroyOnClose
        >
          {renderFormContent()}
        </Drawer>
      )}
    </>
  );
};

export default FlowerFormButton;
