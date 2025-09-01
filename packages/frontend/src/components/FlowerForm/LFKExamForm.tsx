import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Checkbox, 
  Col, 
  DatePicker, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Row, 
  Space,
  Tabs,
  Typography
} from 'antd';
import { PrinterOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { importFlowerFormData } from '../../api/forms';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface LFKExamFormProps {
  clientId: string;
  formId: string;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

interface CheckboxGroupOption {
  label: string;
  value: string;
}

const LFKExamForm: React.FC<LFKExamFormProps> = ({
  clientId,
  formId,
  onSubmit,
  onClose
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('exam');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  // Опции для чекбоксов
  const headHoldOptions: CheckboxGroupOption[] = [
    { label: 'Удерживает', value: 'Удерживает' },
    { label: 'Не удерживает', value: 'Не удерживает' },
    { label: 'Удерживает несколько минут', value: 'Удерживает несколько минут' },
    { label: 'С наклоном вправо', value: 'С наклоном вправо' },
    { label: 'С наклоном влево', value: 'С наклоном влево' }
  ];

  const rolloverOptions: CheckboxGroupOption[] = [
    { label: 'Со спины на живот', value: 'Со спины на живот' },
    { label: 'С живота на спину', value: 'С живота на спину' },
    { label: 'Блоком', value: 'Блоком' },
    { label: 'Вправо', value: 'Вправо' },
    { label: 'Влево', value: 'Влево' }
  ];

  const proneOptions: CheckboxGroupOption[] = [
    { label: 'Опоры на руки нет', value: 'Опоры на руки нет' },
    { label: 'Опирается на предплечья', value: 'Опирается на предплечья' },
    { label: 'Опирается на выпрямленные руки', value: 'Опирается на выпрямленные руки' },
    { label: 'Кисти сжаты в кулак', value: 'Кисти сжаты в кулак' },
    { label: 'D', value: 'D' },
    { label: 'S', value: 'S' }
  ];

  const sittingOnHeelsOptions: CheckboxGroupOption[] = [
    { label: 'Отсутствует', value: 'Отсутствует' },
    { label: 'У опоры', value: 'У опоры' },
    { label: 'Самостоятельно', value: 'Самостоятельно' }
  ];

  const kneelingOptions: CheckboxGroupOption[] = [
    { label: 'Отсутствует', value: 'Отсутствует' },
    { label: 'У опоры', value: 'У опоры' },
    { label: 'Самостоятельно', value: 'Самостоятельно' },
    { label: 'Передвигается у опоры', value: 'Передвигается у опоры' },
    { label: 'Передвигается самостоятельно', value: 'Передвигается самостоятельно' }
  ];

  const toSitOptions: CheckboxGroupOption[] = [
    { label: 'С опорой на правую руку (D)', value: 'С опорой на правую руку (D)' },
    { label: 'С опорой на левую руку (S)', value: 'С опорой на левую руку (S)' },
    { label: 'При фиксации ног', value: 'При фиксации ног' },
    { label: 'С поворотом на бок', value: 'С поворотом на бок' },
    { label: 'Самостоятельно', value: 'Самостоятельно' }
  ];

  const sittingOptions: CheckboxGroupOption[] = [
    { label: 'Не сидит', value: 'Не сидит' },
    { label: 'По‑турецки', value: 'По‑турецки' },
    { label: 'С прямыми ногами', value: 'С прямыми ногами' },
    { label: 'С опущенными ногами', value: 'С опущенными ногами' },
    { label: 'С опорой на руки', value: 'С опорой на руки' },
    { label: 'D', value: 'D' },
    { label: 'S', value: 'S' },
    { label: 'Самостоятельно', value: 'Самостоятельно' },
    { label: 'С помощью взрослого', value: 'С помощью взрослого' }
  ];

  const standingOptions: CheckboxGroupOption[] = [
    { label: 'Не стоит', value: 'Не стоит' },
    { label: 'У опоры', value: 'У опоры' },
    { label: 'С поддержкой за 1 руку', value: 'С поддержкой за 1 руку' },
    { label: 'Несколько секунд', value: 'Несколько секунд' },
    { label: 'Несколько минут', value: 'Несколько минут' },
    { label: 'Долго', value: 'Долго' }
  ];

  const walkingOptions: CheckboxGroupOption[] = [
    { label: 'Не ходит', value: 'Не ходит' },
    { label: 'С поддержкой со стороны спины', value: 'С поддержкой со стороны спины' },
    { label: 'С поддержкой за 1 руку (D)', value: 'С поддержкой за 1 руку (D)' },
    { label: 'С поддержкой за 1 руку (S)', value: 'С поддержкой за 1 руку (S)' },
    { label: 'Самостоятельно', value: 'Самостоятельно' },
    { label: 'Устойчиво', value: 'Устойчиво' },
    { label: 'Неустойчиво', value: 'Неустойчиво' },
    { label: 'Стремительно', value: 'Стремительно' },
    { label: 'С ортопедической обувью', value: 'С ортопедической обувью' },
    { label: 'Без обуви', value: 'Без обуви' },
    { label: 'Передвигается в ходунках', value: 'Передвигается в ходунках' },
    { label: 'С колёсами спереди', value: 'С колёсами спереди' },
    { label: 'С поддержкой типа "трусики"', value: 'С поддержкой типа "трусики"' },
    { label: 'С поддержкой сбоку и сзади', value: 'С поддержкой сбоку и сзади' },
    { label: 'С четырёхопорной тростью', value: 'С четырёхопорной тростью' },
    { label: 'С тростью', value: 'С тростью' },
    { label: 'С канадскими палочками', value: 'С канадскими палочками' },
    { label: 'Расстояние ≥ 5 м', value: 'Расстояние ≥ 5 м' },
    { label: 'Расстояние ≥ 10 м', value: 'Расстояние ≥ 10 м' },
    { label: 'Расстояние ≥ 25 м', value: 'Расстояние ≥ 25 м' },
    { label: 'Расстояние ≥ 50 м', value: 'Расстояние ≥ 50 м' },
    { label: 'Более 50 м', value: 'Более 50 м' }
  ];

  // Опции для вкладки "Походка"
  const gaitSpineOptions: CheckboxGroupOption[] = [
    { label: 'Гиперлордоз (поясничный отдел)', value: 'Гиперлордоз (поясничный отдел)' },
    { label: 'Гиперкифоз (грудной отдел)', value: 'Гиперкифоз (грудной отдел)' },
    { label: 'Наклон вправо', value: 'Наклон вправо' },
    { label: 'Наклон влево', value: 'Наклон влево' }
  ];

  const gaitLowerLimbsOptions: CheckboxGroupOption[] = [
    { label: 'Вальгус', value: 'Вальгус' },
    { label: 'Варус', value: 'Варус' },
    { label: 'Ассиметрия D', value: 'Ассиметрия D' },
    { label: 'Ассиметрия S', value: 'Ассиметрия S' }
  ];

  const gaitFeetOptions: CheckboxGroupOption[] = [
    { label: 'Пяточная вальгусная', value: 'Пяточная вальгусная' },
    { label: 'Пяточная варусная', value: 'Пяточная варусная' },
    { label: 'Пронация', value: 'Пронация' },
    { label: 'Супинация', value: 'Супинация' },
    { label: 'Приведение', value: 'Приведение' },
    { label: 'Отведение', value: 'Отведение' }
  ];

  const addTask = () => {
    setTasks([...tasks, { key: Date.now() }]);
  };

  const removeTask = (key: number) => {
    setTasks(tasks.filter(task => task.key !== key));
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Преобразуем данные формы в формат, совместимый с Flower Form
      const formData = {
        type: 'lfk',
        ...values,
        exam_date: values.exam_date ? values.exam_date.format('YYYY-MM-DD') : undefined,
        plan_date: values.plan_date ? values.plan_date.format('YYYY-MM-DD') : undefined,
        tasks: tasks.map((_, index) => ({
          title: values[`task_title_${index}`] || '',
          metric: values[`task_metric_${index}`] || '',
          target: values[`task_target_${index}`] || '',
          notes: values[`task_notes_${index}`] || ''
        }))
      };
      
      // Очищаем поля задач из основного объекта
      tasks.forEach((_, index) => {
        delete formData[`task_title_${index}`];
        delete formData[`task_metric_${index}`];
        delete formData[`task_target_${index}`];
        delete formData[`task_notes_${index}`];
      });

      // Отправляем данные на сервер
      const result = await importFlowerFormData(
        clientId,
        formId,
        formData,
        values.therapist_name
      );

      message.success('Форма успешно сохранена');
      
      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Ошибка при сохранении формы');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить форму?')) {
      form.resetFields();
      setTasks([]);
    }
  };

  return (
    <div className='lfk-form'>
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Осмотр ЛФК</Title>
            <Space>
              <Button 
                type='primary' 
                icon={<SaveOutlined />} 
                onClick={() => form.submit()}
                loading={loading}
              >
                Сохранить
              </Button>
              <Button icon={<PrinterOutlined />}>Печать</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>Сбросить</Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab='1) Осмотр и двигательные навыки' key='exam'>
              <Card title='Двигательные навыки' style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label='Удержание головы' name='head_hold'>
                      <Checkbox.Group options={headHoldOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Перевороты' name='rollover'>
                      <Checkbox.Group options={rolloverOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Лёжа на животе' name='prone'>
                      <Checkbox.Group options={proneOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Переход в позу сидя на пятках' name='sitting_on_heels'>
                      <Checkbox.Group options={sittingOnHeelsOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Переход в позу стоя на коленях' name='kneeling'>
                      <Checkbox.Group options={kneelingOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Переход в положение сидя' name='to_sit'>
                      <Checkbox.Group options={toSitOptions} />
                    </Form.Item>
                  </Col>
                  
                  <Col span={12}>
                    <Form.Item label='Сидит' name='sitting'>
                      <Checkbox.Group options={sittingOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Стоит' name='standing'>
                      <Checkbox.Group options={standingOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Ходит' name='walking'>
                      <Checkbox.Group options={walkingOptions} />
                    </Form.Item>
                    
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label='Рост (см)' name='height_cm'>
                          <InputNumber min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='Вес (кг)' name='weight_kg'>
                          <InputNumber min={0} step={0.1} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='Окружность головы (см)' name='head_circ'>
                          <InputNumber min={0} step={0.1} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              
              <Card title='Комментарий' style={{ marginBottom: 16 }}>
                <Form.Item name='notes'>
                  <TextArea rows={3} placeholder='Дополнительные наблюдения…' />
                </Form.Item>
              </Card>
              
              <Card>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label='Методист ЛФК' name='therapist_name'>
                      <Input placeholder='ФИО' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label='Дата' name='exam_date'>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label='Подпись (примечание)' name='signature_ref'>
                      <Input placeholder='напр. хранится в Media' />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
            
            <TabPane tab='2) Походка / установка конечностей' key='gait'>
              <Card title='Походка — визуальная оценка' style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item 
                      label={
                        <Space>
                          <span>Спина</span>
                          <Text type='secondary'>(гиперлордоз/гиперкифоз/осевая асимметрия и пр.)</Text>
                        </Space>
                      } 
                      name='gait_spine'
                    >
                      <Checkbox.Group options={gaitSpineOptions} />
                    </Form.Item>
                    
                    <Form.Item 
                      label={
                        <Space>
                          <span>Установка нижних конечностей</span>
                          <Text type='secondary'>(точные формулировки можно дополнить)</Text>
                        </Space>
                      } 
                      name='gait_lower_limbs'
                    >
                      <Checkbox.Group options={gaitLowerLimbsOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Наличие контрактур (суставы)' name='gait_contractures'>
                      <Input placeholder='Например: коленный D 10°, голеностоп S 5°…' />
                    </Form.Item>
                    
                    <Form.Item label='Нестабильность в суставах' name='gait_instability'>
                      <Input placeholder='Например: нестабильность плечевого, коленного…' />
                    </Form.Item>
                  </Col>
                  
                  <Col span={12}>
                    <Form.Item 
                      label={
                        <Space>
                          <span>Установка стоп</span>
                          <Text type='secondary'>(вальгус/варус/пронация/супинация и др.)</Text>
                        </Space>
                      } 
                      name='gait_feet'
                    >
                      <Checkbox.Group options={gaitFeetOptions} />
                    </Form.Item>
                    
                    <Form.Item label='Прочее (походка)' name='gait_comment'>
                      <TextArea rows={6} placeholder='Запишите особенности походки (темп, симметрия шага, опора и т.д.)' />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              
              <Card title='Вложения'>
                <Form.Item name='media_refs'>
                  <Input placeholder='Ссылка(и) на видео походки/фото в Media (ID, URL)…' />
                </Form.Item>
              </Card>
            </TabPane>
            
            <TabPane tab='3) План терапии / задачи' key='plan'>
              <Card title='План терапии / задачи курса' style={{ marginBottom: 16 }}>
                <Text type='secondary'>Ниже — план с возможностью добавлять пункты</Text>
                <div style={{ margin: '16px 0', borderBottom: '1px solid #f0f0f0' }} />
                
                <Row gutter={16} style={{ marginBottom: 8 }}>
                  <Col flex='auto'>
                    <Form.Item label='Цель курса' name='course_goal'>
                      <Input placeholder='Например: улучшение устойчивости, ↓ спастики…' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label='Длительность (нед.)' name='course_duration_weeks'>
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label='Сессий в неделю' name='sessions_per_week'>
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                
                {tasks.map((task, index) => (
                  <Row key={task.key} gutter={16} style={{ marginBottom: 16 }}>
                    <Col flex='auto'>
                      <Form.Item name={`task_title_${index}`} label={index === 0 ? 'Задача' : ''}>
                        <Input placeholder='Например: улучшить переход в положение сидя' />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name={`task_metric_${index}`} label={index === 0 ? 'Метрика' : ''}>
                        <Input placeholder='напр. пройти 10 м' />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name={`task_target_${index}`} label={index === 0 ? 'Цель' : ''}>
                        <Input placeholder='напр. без опоры' />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name={`task_notes_${index}`} label={index === 0 ? 'Примечание' : ''}>
                        <Input placeholder='…' />
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <Button danger onClick={() => removeTask(task.key)}>Удалить</Button>
                    </Col>
                  </Row>
                ))}
                
                <Button type='dashed' block onClick={addTask} style={{ marginTop: 16 }}>
                  + Добавить пункт
                </Button>
              </Card>
              
              <Card>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label='Составил(а)' name='plan_author'>
                      <Input placeholder='ФИО' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label='Дата' name='plan_date'>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>
        </Form>
      </Card>
    </div>
  );
};

export default LFKExamForm;
