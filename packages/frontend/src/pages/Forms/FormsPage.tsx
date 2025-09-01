import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Modal,
  Select,
  Space,
  Typography,
  Statistic,
  message,
  Form,
  Divider,
  Tag
} from 'antd';
import { PlusOutlined, EyeOutlined, BarChartOutlined } from '@ant-design/icons';
import { getAllClients } from '../../api/clients';
import { getAllForms } from '../../api/forms';
import { getAllFormEntries, createFormEntry, updateFormEntry } from '../../api/form-entries';
import FormBuilder from '../../components/Forms/FormBuilder';
import RadarChart from '../../components/Charts/RadarChart';
import type { Client, FormTemplate, FormEntry, FormEntryStatus } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const FormsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [formEntries, setFormEntries] = useState<FormEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<FormEntry | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsData, formsData, entriesData] = await Promise.all([
        getAllClients({ limit: 100 }),
        getAllForms({ limit: 100 }),
        getAllFormEntries({ limit: 100 })
      ]);
      setClients(clientsData.data);
      setForms(formsData.data);
      setFormEntries(entriesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = () => {
    if (!selectedClient || !selectedForm) {
      message.warning('Выберите пациента и форму');
      return;
    }
    setFormData({});
    setSelectedEntry(null);
    setFormModalVisible(true);
  };

  const handleOpenForm = (entry: FormEntry) => {
    setSelectedEntry(entry);
    setFormData(entry.data || {});
    setSelectedClient(entry.patientId);
    setSelectedForm(entry.formId);
    setFormModalVisible(true);
  };

  const handleSaveForm = async (values: Record<string, any>) => {
    try {
      if (selectedEntry) {
        // Обновление существующей записи
        await updateFormEntry(selectedEntry.id, {
          data: values,
          status: 'completed' as FormEntryStatus
        });
        message.success('Форма обновлена');
      } else {
        // Создание новой записи
        await createFormEntry({
          patientId: selectedClient,
          formId: selectedForm,
          data: values,
          status: 'completed' as FormEntryStatus
        });
        message.success('Форма создана');
      }
      setFormModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Error saving form:', error);
      message.error('Ошибка сохранения формы');
    }
  };

  const handleShowChart = (entry: FormEntry) => {
    const chartData = generateChartData(entry);
    setChartData(chartData);
    setChartModalVisible(true);
  };

  const generateChartData = (entry: FormEntry) => {
    if (!entry.data || !entry.form?.schema) return null;

    const data = entry.data;
    const schema = entry.form.schema;
    const chartData: any = {
      labels: [],
      datasets: []
    };

    // Извлекаем числовые данные для графика
    const numericData: number[] = [];
    const labels: string[] = [];

    schema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'rating' || field.type === 'number') {
          const value = data[field.name];
          if (typeof value === 'number') {
            labels.push(field.label);
            numericData.push(value);
          }
        }
      });
    });

    if (numericData.length === 0) {
      // Если нет числовых данных, создаем график на основе чекбоксов
      const checkboxData: number[] = [];
      const checkboxLabels: string[] = [];

      schema.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.type === 'checkbox-group') {
            const values = data[field.name];
            if (Array.isArray(values) && values.length > 0) {
              checkboxLabels.push(field.label);
              checkboxData.push(values.length);
            }
          }
        });
      });

      if (checkboxData.length > 0) {
        chartData.labels = checkboxLabels;
        chartData.datasets = [{
          label: 'Количество выбранных опций',
          data: checkboxData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }];
      }
    } else {
      chartData.labels = labels;
      chartData.datasets = [{
        label: 'Оценки',
        data: numericData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }];
    }

    return chartData;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in_progress':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершена';
      case 'in_progress':
        return 'В процессе';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Пациент',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient: any) => patient?.fullName || 'Неизвестно'
    },
    {
      title: 'Форма',
      dataIndex: 'form',
      key: 'form',
      render: (form: any) => form?.title || 'Неизвестно'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record: FormEntry) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleOpenForm(record)}
          >
            Открыть
          </Button>
          <Button
            type="link"
            icon={<BarChartOutlined />}
            onClick={() => handleShowChart(record)}
          >
            График
          </Button>
        </Space>
      )
    }
  ];

  const statistics = {
    total: formEntries.length,
    completed: formEntries.filter(entry => entry.status === 'completed').length,
    inProgress: formEntries.filter(entry => entry.status === 'in_progress').length,
    cancelled: formEntries.filter(entry => entry.status === 'cancelled').length
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Формы</Title>

      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Всего форм" value={statistics.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Завершено" value={statistics.completed} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="В процессе" value={statistics.inProgress} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Отменено" value={statistics.cancelled} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      {/* Создание новой формы */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Создать новую форму</Title>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Text>Пациент:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Выберите пациента"
              value={selectedClient}
              onChange={setSelectedClient}
            >
              {clients.map(client => (
                <Option key={client.id} value={client.id}>
                  {client.fullName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Text>Форма:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Выберите форму"
              value={selectedForm}
              onChange={setSelectedForm}
            >
              {forms.map(form => (
                <Option key={form.id} value={form.id}>
                  {form.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateForm}
              disabled={!selectedClient || !selectedForm}
            >
              Создать форму
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Таблица форм */}
      <Card>
        <Title level={4}>Заполненные формы</Title>
        <Table
          columns={columns}
          dataSource={formEntries}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} записей`
          }}
        />
      </Card>

      {/* Модальное окно формы */}
      <Modal
        title={selectedEntry ? 'Редактирование формы' : 'Заполнение формы'}
        open={formModalVisible}
        onCancel={() => setFormModalVisible(false)}
        width="90%"
        style={{ top: 20 }}
        footer={null}
        destroyOnHidden
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedForm && (
            <FormBuilder
              schema={forms.find(f => f.id === selectedForm)?.schema || { sections: [] }}
              initialValues={formData}
              onValuesChange={(changedValues, allValues) => setFormData(allValues)}
              form={form}
            />
          )}
          <Divider />
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setFormModalVisible(false)}>
                Отмена
              </Button>
              <Button type="primary" onClick={() => handleSaveForm(formData)}>
                {selectedEntry ? 'Обновить' : 'Сохранить'}
              </Button>
            </Space>
          </div>
        </div>
      </Modal>

      {/* Модальное окно графика */}
      <Modal
        title="График результатов"
        open={chartModalVisible}
        onCancel={() => setChartModalVisible(false)}
        width="80%"
        footer={null}
        destroyOnHidden
      >
        {chartData && <RadarChart data={chartData} />}
      </Modal>
    </div>
  );
};

export default FormsPage;
