import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Collapse,
  InputNumber,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { FormStatus, FormType } from '@reki/domain';
import { formsApi } from '../../api/forms';

const { Title } = Typography;
const { TextArea } = Input;

interface FormTemplate {
  id: string;
  title: string;
  description?: string;
  type: FormType;
  status: FormStatus;
  version: number;
  schema: {
    sections: Array<{
      title: string;
      fields: Array<{
        name: string;
        label: string;
        type: 'text' | 'textarea' | 'date' | 'select' | 'rating' | 'number' | 'checkbox' | 'radio';
        required?: boolean;
        options?: string[];
        min?: number;
        max?: number;
        readOnly?: boolean;
      }>;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

const FormTemplatesPage: React.FC = () => {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
  const [form] = Form.useForm();
  const [schemaForm] = Form.useForm();

  // Загрузка форм
  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await formsApi.getAll({ limit: 100 });
      setForms(response.data);
    } catch (error) {
      message.error('Ошибка загрузки форм');
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Статистика
  const activeForms = forms.filter(form => form.status === FormStatus.ACTIVE).length;
  const draftForms = forms.filter(form => form.status === FormStatus.DRAFT).length;

  // Создание новой формы
  const handleCreateForm = async (values: any) => {
    try {
      const schemaData = schemaForm.getFieldsValue();
      const sections = schemaData.sections || [];

      const formData = {
        ...values,
        schema: { sections },
        status: FormStatus.DRAFT,
        version: 1,
      };

      await formsApi.create(formData);
      message.success('Форма создана успешно');
      setCreateModalVisible(false);
      form.resetFields();
      schemaForm.resetFields();
      fetchForms();
    } catch (error) {
      message.error('Ошибка создания формы');
      console.error('Error creating form:', error);
    }
  };

  // Обновление формы
  const handleUpdateForm = async (values: any) => {
    if (!editingForm) return;

    try {
      const schemaData = schemaForm.getFieldsValue();
      const sections = schemaData.sections || [];

      const formData = {
        ...values,
        schema: { sections },
      };

      await formsApi.update(editingForm.id, formData);
      message.success('Форма обновлена успешно');
      setEditModalVisible(false);
      setEditingForm(null);
      form.resetFields();
      schemaForm.resetFields();
      fetchForms();
    } catch (error) {
      message.error('Ошибка обновления формы');
      console.error('Error updating form:', error);
    }
  };

  // Удаление формы
  const handleDeleteForm = async (id: string) => {
    try {
      await formsApi.delete(id);
      message.success('Форма удалена успешно');
      fetchForms();
    } catch (error) {
      message.error('Ошибка удаления формы');
      console.error('Error deleting form:', error);
    }
  };

  // Открытие формы для редактирования
  const handleEditForm = (form: FormTemplate) => {
    setEditingForm(form);
    form.setFieldsValue({
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
    });
    schemaForm.setFieldsValue({
      sections: form.schema.sections,
    });
    setEditModalVisible(true);
  };

  const columns: ColumnsType<FormTemplate> = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <Space>
          <FileTextOutlined />
          {title}
        </Space>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: FormType) => (
        <Tag color="blue">
          {type === FormType.LFK ? 'ЛФК' : 
           type === FormType.FIM ? 'FIM' : 
           type === FormType.ASSESSMENT ? 'Оценка' :
           type === FormType.QUESTIONNAIRE ? 'Опросник' :
           type === FormType.SURVEY ? 'Опрос' :
           type === FormType.TEST ? 'Тест' : type}
        </Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: FormStatus) => (
        <Tag 
          color={status === FormStatus.ACTIVE ? 'green' : status === FormStatus.DRAFT ? 'blue' : 'default'}
          icon={status === FormStatus.ACTIVE ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status === FormStatus.ACTIVE ? 'Активна' : 
           status === FormStatus.DRAFT ? 'Черновик' : 
           status === FormStatus.ARCHIVED ? 'Архив' : status}
        </Tag>
      ),
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      key: 'version',
      render: (version: number) => `v${version}`,
    },
    {
      title: 'Секций',
      key: 'sections',
      render: (_, record) => record.schema.sections?.length || 0,
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditForm(record)}
          >
            Редактировать
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteForm(record.id)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Всего форм"
              value={forms.length}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Активных"
              value={activeForms}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Черновиков"
              value={draftForms}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Основная таблица */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              Шаблоны форм
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              size="large"
            >
              Создать шаблон
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={forms}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} записей`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Модальное окно создания/редактирования формы */}
      <Modal
        title={editingForm ? 'Редактировать шаблон формы' : 'Создать шаблон формы'}
        open={createModalVisible || editModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setEditModalVisible(false);
          setEditingForm(null);
          form.resetFields();
          schemaForm.resetFields();
        }}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingForm ? handleUpdateForm : handleCreateForm}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Название формы"
                rules={[{ required: true, message: 'Введите название формы' }]}
              >
                <Input placeholder="Например: Осмотр ЛФК" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Тип формы"
                rules={[{ required: true, message: 'Выберите тип формы' }]}
              >
                <Select placeholder="Выберите тип">
                  <Select.Option value={FormType.LFK}>ЛФК</Select.Option>
                  <Select.Option value={FormType.FIM}>FIM</Select.Option>
                  <Select.Option value={FormType.ASSESSMENT}>Оценка</Select.Option>
                  <Select.Option value={FormType.QUESTIONNAIRE}>Опросник</Select.Option>
                  <Select.Option value={FormType.SURVEY}>Опрос</Select.Option>
                  <Select.Option value={FormType.TEST}>Тест</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea rows={3} placeholder="Описание назначения формы" />
          </Form.Item>

          <Divider>Структура формы</Divider>

          <Form.List name="sections">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    title={`Секция ${name + 1}`}
                    size="small"
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(name)}
                      >
                        Удалить секцию
                      </Button>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Название секции"
                          rules={[{ required: true, message: 'Введите название секции' }]}
                        >
                          <Input placeholder="Например: Общая информация" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.List name={[name, 'fields']}>
                      {(fieldFields, { add: addField, remove: removeField }) => (
                        <>
                          {fieldFields.map(({ key: fieldKey, name: fieldName, ...restFieldField }) => (
                            <Card
                              key={fieldKey}
                              size="small"
                              style={{ marginBottom: 8 }}
                              extra={
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  onClick={() => removeField(fieldName)}
                                >
                                  Удалить поле
                                </Button>
                              }
                            >
                              <Row gutter={16}>
                                <Col span={8}>
                                  <Form.Item
                                    {...restFieldField}
                                    name={[fieldName, 'name']}
                                    label="Имя поля"
                                    rules={[{ required: true, message: 'Введите имя поля' }]}
                                  >
                                    <Input placeholder="Например: therapistName" />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...restFieldField}
                                    name={[fieldName, 'label']}
                                    label="Подпись"
                                    rules={[{ required: true, message: 'Введите подпись' }]}
                                  >
                                    <Input placeholder="Например: ФИО специалиста" />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...restFieldField}
                                    name={[fieldName, 'type']}
                                    label="Тип поля"
                                    rules={[{ required: true, message: 'Выберите тип поля' }]}
                                  >
                                    <Select placeholder="Выберите тип">
                                      <Select.Option value="text">Текст</Select.Option>
                                      <Select.Option value="textarea">Многострочный текст</Select.Option>
                                      <Select.Option value="date">Дата</Select.Option>
                                      <Select.Option value="select">Выпадающий список</Select.Option>
                                      <Select.Option value="rating">Оценка</Select.Option>
                                      <Select.Option value="number">Число</Select.Option>
                                      <Select.Option value="checkbox">Чекбокс</Select.Option>
                                      <Select.Option value="radio">Радиокнопки</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={16}>
                                <Col span={8}>
                                  <Form.Item
                                    {...restFieldField}
                                    name={[fieldName, 'required']}
                                    label="Обязательное"
                                    valuePropName="checked"
                                  >
                                    <Switch />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...restFieldField}
                                    name={[fieldName, 'min']}
                                    label="Минимум"
                                  >
                                    <InputNumber style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...restFieldField}
                                    name={[fieldName, 'max']}
                                    label="Максимум"
                                  >
                                    <InputNumber style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => addField()}
                            block
                            style={{ marginBottom: 8 }}
                          >
                            Добавить поле
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  style={{ marginBottom: 16 }}
                >
                  Добавить секцию
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setCreateModalVisible(false);
                  setEditModalVisible(false);
                  setEditingForm(null);
                  form.resetFields();
                  schemaForm.resetFields();
                }}
              >
                Отмена
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
              >
                {editingForm ? 'Обновить' : 'Создать'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default FormTemplatesPage;
