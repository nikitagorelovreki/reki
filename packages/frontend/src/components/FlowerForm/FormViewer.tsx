import React, { useState } from 'react';
import { Card, Tabs, Button, Space } from 'antd';
import { FormSubmission, Form } from '../../api/forms';
import FlowerFormIntegration from './FlowerFormIntegration';

interface FormViewerProps {
  submission?: FormSubmission;
  form?: Form;
  clientId?: string;
  onNewSubmission?: (data: FormSubmission) => void;
}

const FormViewer: React.FC<FormViewerProps> = ({
  submission,
  form,
  clientId,
  onNewSubmission
}) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [showFlowerForm, setShowFlowerForm] = useState<boolean>(false);

  const handleFormSubmit = (data: FormSubmission) => {
    setShowFlowerForm(false);
    if (onNewSubmission) {
      onNewSubmission(data);
    }
  };

  const handleCloseFlowerForm = () => {
    setShowFlowerForm(false);
  };

  if (!form && !submission) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>Выберите форму или заполнение для просмотра</p>
        </div>
      </Card>
    );
  }

  if (showFlowerForm && form && clientId) {
    return (
      <FlowerFormIntegration
        clientId={clientId}
        formType={form.type as 'lfk' | 'fim'}
        onSubmit={handleFormSubmit}
        onClose={handleCloseFlowerForm}
      />
    );
  }

  const tabItems = [
    {
      key: 'details',
      label: 'Детали',
      children: (
        <div>
          {submission ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h3>{form?.name || 'Форма'}</h3>
                <p>
                  <strong>Дата заполнения:</strong> {new Date(submission.submissionDate).toLocaleDateString()}
                </p>
                {submission.therapistName && (
                  <p>
                    <strong>Специалист:</strong> {submission.therapistName}
                  </p>
                )}
              </div>
              <Card title="Данные формы" style={{ marginTop: '16px' }}>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  maxHeight: '500px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(submission.data, null, 2)}
                </pre>
              </Card>
            </div>
          ) : form ? (
            <div>
              <h3>{form.name}</h3>
              <p>
                <strong>Тип:</strong> {form.type.toUpperCase()}
              </p>
              {form.description && (
                <p>
                  <strong>Описание:</strong> {form.description}
                </p>
              )}
              {clientId && (
                <Button 
                  type="primary" 
                  onClick={() => setShowFlowerForm(true)}
                  style={{ marginTop: '16px' }}
                >
                  Заполнить форму
                </Button>
              )}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'preview',
      label: 'Предпросмотр',
      disabled: !submission,
      children: (
        <div>
          {submission?.data?.type === 'lfk' && (
            <div>
              <h3>Осмотр ЛФК</h3>
              <Card title="Двигательные навыки" style={{ marginBottom: '16px' }}>
                {submission.data.head_hold && (
                  <p><strong>Удержание головы:</strong> {Array.isArray(submission.data.head_hold) ? submission.data.head_hold.join(', ') : submission.data.head_hold}</p>
                )}
                {submission.data.rollover && (
                  <p><strong>Перевороты:</strong> {Array.isArray(submission.data.rollover) ? submission.data.rollover.join(', ') : submission.data.rollover}</p>
                )}
                {submission.data.sitting && (
                  <p><strong>Сидит:</strong> {Array.isArray(submission.data.sitting) ? submission.data.sitting.join(', ') : submission.data.sitting}</p>
                )}
                {submission.data.standing && (
                  <p><strong>Стоит:</strong> {Array.isArray(submission.data.standing) ? submission.data.standing.join(', ') : submission.data.standing}</p>
                )}
                {submission.data.walking && (
                  <p><strong>Ходит:</strong> {Array.isArray(submission.data.walking) ? submission.data.walking.join(', ') : submission.data.walking}</p>
                )}
              </Card>
              {submission.data.notes && (
                <Card title="Комментарий" style={{ marginBottom: '16px' }}>
                  <p>{submission.data.notes}</p>
                </Card>
              )}
              {submission.data.therapist_name && (
                <p><strong>Методист ЛФК:</strong> {submission.data.therapist_name}</p>
              )}
              {submission.data.exam_date && (
                <p><strong>Дата:</strong> {submission.data.exam_date}</p>
              )}
            </div>
          )}
          
          {submission?.data?.type === 'fim' && (
            <div>
              <h3>FIM — мера функциональной независимости</h3>
              <Card title="Показатели" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <p><strong>Двигательные (1–13), поступление:</strong> {submission.data._fim_motor_adm || 0}</p>
                    <p><strong>Когнитивные (14–18), поступление:</strong> {submission.data._fim_cog_adm || 0}</p>
                    <p><strong>Итого (18), поступление:</strong> {submission.data._fim_total_adm || 0}</p>
                  </div>
                  <div>
                    <p><strong>Двигательные (1–13), выписка:</strong> {submission.data._fim_motor_dis || 0}</p>
                    <p><strong>Когнитивные (14–18), выписка:</strong> {submission.data._fim_cog_dis || 0}</p>
                    <p><strong>Итого (18), выписка:</strong> {submission.data._fim_total_dis || 0}</p>
                  </div>
                </div>
              </Card>
              {submission.data.fim_notes && (
                <Card title="Комментарий" style={{ marginBottom: '16px' }}>
                  <p>{submission.data.fim_notes}</p>
                </Card>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
    </Card>
  );
};

export default FormViewer;
