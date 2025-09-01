import React, { useEffect, useRef, useState } from 'react';
import { 
  Button, 
  Card, 
  Col, 
  DatePicker, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Typography
} from 'antd';
import { PrinterOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { importFlowerFormData } from '../../api/forms';
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface FIMFormProps {
  clientId: string;
  formId: string;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

// FIM Items
const fimItems = [
  // 1-6 Self-care
  ['Приём пищи', 'eating'],
  ['Личная гигиена', 'grooming'],
  ['Принятие ванны/душа', 'bathing'],
  ['Одевание верхней части', 'dress_upper'],
  ['Одевание нижней части', 'dress_lower'],
  ['Туалет', 'toileting'],
  // 7-8 Sphincter control
  ['Мочевой пузырь', 'bladder'],
  ['Кишечник', 'bowel'],
  // 9-11 Transfers
  ['Пересаживание: кровать/стул/кресло', 'bed_transfer'],
  ['Пересаживание: туалет', 'toilet_transfer'],
  ['Пересаживание: ванна/душ', 'bath_transfer'],
  // 12-13 Locomotion
  ['Передвижение / коляска', 'locomotion'],
  ['Подъём по лестнице', 'stairs'],
  // 14-15 Communication
  ['Понимание (восприятие)', 'comprehension'],
  ['Выражение (экспрессия)', 'expression'],
  // 16-18 Social cognition
  ['Социальное взаимодействие', 'social_interaction'],
  ['Решение проблем', 'problem_solving'],
  ['Память', 'memory']
];

const FIMForm: React.FC<FIMFormProps> = ({
  clientId,
  formId,
  onSubmit,
  onClose
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fimData, setFimData] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<any>(null);

  // Функция для обновления данных радарной диаграммы
  const updateChartData = (values: any) => {
    // Группируем данные по категориям для лучшей визуализации
    const categories = [
      { name: 'Самообслуживание', items: fimItems.slice(0, 6) },
      { name: 'Контроль сфинктеров', items: fimItems.slice(6, 8) },
      { name: 'Мобильность', items: fimItems.slice(8, 11) },
      { name: 'Передвижение', items: fimItems.slice(11, 13) },
      { name: 'Общение', items: fimItems.slice(13, 15) },
      { name: 'Социальное познание', items: fimItems.slice(15, 18) }
    ];

    // Собираем значения для диаграммы
    const labels = categories.map(cat => cat.name);
    
    // Вычисляем средние значения для каждой категории
    const admissionData = categories.map(category => {
      const categoryValues = category.items.map(([_, key]) => 
        Number(values[`fim_${key}_adm`] || 0)
      );
      const sum = categoryValues.reduce((acc, val) => acc + val, 0);
      return categoryValues.length > 0 ? sum / categoryValues.length : 0;
    });

    const dischargeData = categories.map(category => {
      const categoryValues = category.items.map(([_, key]) => 
        Number(values[`fim_${key}_dis`] || 0)
      );
      const sum = categoryValues.reduce((acc, val) => acc + val, 0);
      return categoryValues.length > 0 ? sum / categoryValues.length : 0;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Поступление',
          data: admissionData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
        },
        {
          label: 'Выписка',
          data: dischargeData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    });
  };

  // Вычисление итоговых значений FIM и обновление графика
  useEffect(() => {
    const calculateTotals = () => {
      const values = form.getFieldsValue();
      
      // Двигательные (1-13)
      const motorAdmValues = fimItems.slice(0, 13).map(([_, key]) => 
        Number(values[`fim_${key}_adm`] || 0)
      );
      const motorDisValues = fimItems.slice(0, 13).map(([_, key]) => 
        Number(values[`fim_${key}_dis`] || 0)
      );
      
      // Когнитивные (14-18)
      const cogAdmValues = fimItems.slice(13).map(([_, key]) => 
        Number(values[`fim_${key}_adm`] || 0)
      );
      const cogDisValues = fimItems.slice(13).map(([_, key]) => 
        Number(values[`fim_${key}_dis`] || 0)
      );
      
      // Суммы
      const motorAdmSum = motorAdmValues.reduce((sum, val) => sum + val, 0);
      const motorDisSum = motorDisValues.reduce((sum, val) => sum + val, 0);
      const cogAdmSum = cogAdmValues.reduce((sum, val) => sum + val, 0);
      const cogDisSum = cogDisValues.reduce((sum, val) => sum + val, 0);
      
      form.setFieldsValue({
        fim_motor_adm: motorAdmSum,
        fim_motor_dis: motorDisSum,
        fim_cog_adm: cogAdmSum,
        fim_cog_dis: cogDisSum,
        fim_total_adm: motorAdmSum + cogAdmSum,
        fim_total_dis: motorDisSum + cogDisSum
      });

      // Обновляем данные для радарной диаграммы
      updateChartData(values);
    };
    
    calculateTotals();
  }, [fimData, form]);

  const handleValuesChange = (changedValues: any) => {
    setFimData({ ...fimData, ...changedValues });
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Преобразуем данные формы в формат, совместимый с Flower Form
      const formData = {
        type: 'fim',
        ...values,
        fim_date: values.fim_date ? values.fim_date.format('YYYY-MM-DD') : undefined,
      };
      
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
    }
  };

  const columns = [
    {
      title: 'Пункт (1–18)',
      dataIndex: 'item',
      key: 'item',
      width: '40%',
    },
    {
      title: 'Поступление',
      dataIndex: 'admission',
      key: 'admission',
      width: '30%',
      render: (_: any, record: any) => (
        <Form.Item name={`fim_${record.key}_adm`} noStyle>
          <Select style={{ width: '100%' }}>
            <Option value=''>—</Option>
            {[1, 2, 3, 4, 5, 6, 7].map(val => (
              <Option key={val} value={String(val)}>{val}</Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Выписка',
      dataIndex: 'discharge',
      key: 'discharge',
      width: '30%',
      render: (_: any, record: any) => (
        <Form.Item name={`fim_${record.key}_dis`} noStyle>
          <Select style={{ width: '100%' }}>
            <Option value=''>—</Option>
            {[1, 2, 3, 4, 5, 6, 7].map(val => (
              <Option key={val} value={String(val)}>{val}</Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
  ];

  const dataSource = fimItems.map(([label, key], index) => ({
    key,
    item: `${index + 1}. ${label}`,
  }));

  return (
    <div className='fim-form'>
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>FIM — мера функциональной независимости</Title>
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
          onValuesChange={handleValuesChange}
        >
          <Card title='Метаданные' style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col flex='auto'>
                <Form.Item label='Пациент' name='fim_patient_ref'>
                  <Input placeholder='ID/ФИО (позже подтянется из базы)' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='Дата' name='fim_date'>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          
          <Card title='Оценка FIM' style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Визуализация</Title>
              <div style={{ height: '400px', padding: '20px' }}>
                {chartData ? (
                  <Radar
                    ref={chartRef}
                    data={chartData}
                    options={{
                      scales: {
                        r: {
                          beginAtZero: true,
                          min: 0,
                          max: 7,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
                            }
                          }
                        }
                      },
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '4px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type='secondary'>Заполните форму для отображения диаграммы</Text>
                  </div>
                )}
              </div>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={dataSource} 
              pagination={false}
              bordered
              size='small'
              style={{ marginBottom: 20 }}
            />
            
            <div style={{ margin: '16px 0', borderBottom: '1px solid #f0f0f0' }} />
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label='Двигательные (1–13), поступление' name='fim_motor_adm'>
                  <InputNumber style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='Двигательные (1–13), выписка' name='fim_motor_dis'>
                  <InputNumber style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}></Col>
              
              <Col span={8}>
                <Form.Item label='Когнитивные (14–18), поступление' name='fim_cog_adm'>
                  <InputNumber style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='Когнитивные (14–18), выписка' name='fim_cog_dis'>
                  <InputNumber style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}></Col>
              
              <Col span={8}>
                <Form.Item label='Итого (18), поступление' name='fim_total_adm'>
                  <InputNumber style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='Итого (18), выписка' name='fim_total_dis'>
                  <InputNumber style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          
          <Card title='Комментарий' style={{ marginBottom: 16 }}>
            <Form.Item name='fim_notes'>
              <TextArea rows={3} placeholder='Замечания по FIM…' />
            </Form.Item>
          </Card>
          
          <Card title='Шкала оценки FIM'>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>7</Text> — Полная независимость (безопасно, своевременно)
                </div>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>6</Text> — Ограниченная независимость (вспомогательные устройства)
                </div>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>5</Text> — Наблюдение/подготовка (наблюдение, подсказки)
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>4</Text> — Минимальная помощь (пациент ≥ 75% усилий)
                </div>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>3</Text> — Умеренная помощь (пациент 50-74% усилий)
                </div>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>2</Text> — Существенная помощь (пациент 25-49% усилий)
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>1</Text> — Полная зависимость (пациент &lt; 25% усилий)
                </div>
                <div style={{ margin: '16px 0', borderBottom: '1px solid #f0f0f0' }} />
                <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong>Максимум:</Text> 126 баллов (18 пунктов × 7)
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
      </Card>
    </div>
  );
};

export default FIMForm;