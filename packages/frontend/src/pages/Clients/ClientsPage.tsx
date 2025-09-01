import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { Client, ClientStatus, CreateClientDto } from '../../types';
import { clientsApi } from '../../api/clients';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form] = Form.useForm();

  const clientStatusColors: Record<ClientStatus, string> = {
    [ClientStatus.INTAKE]: 'blue',
    [ClientStatus.DIAGNOSTICS]: 'orange',
    [ClientStatus.ACTIVE_THERAPY]: 'green',
    [ClientStatus.PAUSED]: 'yellow',
    [ClientStatus.DISCHARGED]: 'default',
    [ClientStatus.FOLLOWUP]: 'purple',
    [ClientStatus.ARCHIVED]: 'default',
  };

  const fetchClients = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await clientsApi.getAll({
        page,
        limit: pageSize,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setClients(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error('Ошибка загрузки клиентов');
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchClients(pagination.current, pagination.pageSize);
  };

  const handleCreate = async (
    values: CreateClientDto & { dateOfBirth?: dayjs.Dayjs }
  ) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      };
      await clientsApi.create(formattedValues);
      message.success('Клиент создан успешно');
      setCreateModalVisible(false);
      form.resetFields();
      fetchClients(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка создания клиента');
      console.error('Error creating client:', error);
    }
  };

  const handleUpdate = async (
    values: Partial<CreateClientDto> & { dateOfBirth?: dayjs.Dayjs }
  ) => {
    if (!editingClient) return;

    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      };
      await clientsApi.update(editingClient.id, formattedValues);
      message.success('Клиент обновлен успешно');
      setEditModalVisible(false);
      setEditingClient(null);
      form.resetFields();
      fetchClients(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка обновления клиента');
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await clientsApi.delete(id);
      message.success('Клиент удален успешно');
      fetchClients(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка удаления клиента');
      console.error('Error deleting client:', error);
    }
  };

  const handleStatusChange = async (clientId: string, status: ClientStatus) => {
    try {
      await clientsApi.updateStatus(clientId, status);
      message.success('Статус клиента обновлен');
      fetchClients(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка обновления статуса');
      console.error('Error updating status:', error);
    }
  };

  const columns: ColumnsType<Client> = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {`${record.lastName || ''} ${record.firstName || ''}`.trim()}
        </Space>
      ),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ClientStatus) => (
        <Tag color={clientStatusColors[status]}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size='middle'>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingClient(record);
              const formValues = {
                ...record,
                dateOfBirth: record.dob ? dayjs(record.dob) : undefined,
                phone: record.contacts?.phone,
                email: record.contacts?.email,
                address: record.contacts?.address,
              };
              form.setFieldsValue(formValues);
              setEditModalVisible(true);
            }}
          >
            Edit
          </Button>

          <Space>
            <Button
              type='link'
              icon={<FormOutlined />}
              onClick={() => navigate(`/forms/client/${record.id}`)}
            >
              Forms
            </Button>
          </Space>

          <Dropdown
            menu={{
              items: Object.values(ClientStatus).map(status => ({
                key: status,
                label: status.replace('_', ' ').toUpperCase(),
                onClick: () => handleStatusChange(record.id, status),
              })),
            }}
          >
            <Button type='link'>
              Status <MoreOutlined />
            </Button>
          </Dropdown>

          <Popconfirm
            title='Удалить клиента?'
            description='Это действие нельзя отменить'
            onConfirm={() => handleDelete(record.id)}
            okText='Да'
            cancelText='Нет'
          >
            <Button type='link' danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Client Management
            </Title>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  fetchClients(pagination.current, pagination.pageSize)
                }
              >
                Refresh
              </Button>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Add Client
              </Button>
            </Space>
          </div>

          <Search
            placeholder='Search clients...'
            allowClear
            style={{ width: 300 }}
            onSearch={value => {
              // TODO: Implement search
              console.log('Search:', value);
            }}
          />

          <Table
            columns={columns}
            dataSource={clients}
            rowKey='id'
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} clients`,
            }}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        </Space>
      </Card>

      {/* Create Client Modal */}
      <Modal
        title='Create New Client'
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout='vertical' onFinish={handleCreate}>
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input placeholder='John' />
          </Form.Item>

          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input placeholder='Doe' />
          </Form.Item>

          <Form.Item name='middleName' label='Middle Name'>
            <Input placeholder='Michael' />
          </Form.Item>

          <Form.Item name='dateOfBirth' label='Date of Birth'>
            <DatePicker
              style={{ width: '100%' }}
              placeholder='Select date of birth'
              format='YYYY-MM-DD'
            />
          </Form.Item>

          <Form.Item name='phone' label='Phone'>
            <Input placeholder='+7 (900) 123-45-67' />
          </Form.Item>

          <Form.Item name='email' label='Email'>
            <Input placeholder='john.doe@example.com' />
          </Form.Item>

          <Form.Item name='address' label='Address'>
            <TextArea rows={2} placeholder='Enter address' />
          </Form.Item>

          <Form.Item name='diagnosis' label='Diagnosis'>
            <TextArea rows={3} placeholder='Enter primary diagnosis' />
          </Form.Item>

          <Form.Item
            name='status'
            label='Status'
            initialValue={ClientStatus.INTAKE}
          >
            <Select
              options={Object.values(ClientStatus).map(status => ({
                label: status.replace('_', ' ').toUpperCase(),
                value: status,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit'>
                Create Client
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        title='Edit Client'
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingClient(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout='vertical' onFinish={handleUpdate}>
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input placeholder='John' />
          </Form.Item>

          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input placeholder='Doe' />
          </Form.Item>

          <Form.Item name='middleName' label='Middle Name'>
            <Input placeholder='Michael' />
          </Form.Item>

          <Form.Item name='dateOfBirth' label='Date of Birth'>
            <DatePicker
              style={{ width: '100%' }}
              placeholder='Select date of birth'
              format='YYYY-MM-DD'
            />
          </Form.Item>

          <Form.Item name='phone' label='Phone'>
            <Input placeholder='+7 (900) 123-45-67' />
          </Form.Item>

          <Form.Item name='email' label='Email'>
            <Input placeholder='john.doe@example.com' />
          </Form.Item>

          <Form.Item name='address' label='Address'>
            <TextArea rows={2} placeholder='Enter address' />
          </Form.Item>

          <Form.Item name='diagnosis' label='Diagnosis'>
            <TextArea rows={3} placeholder='Enter primary diagnosis' />
          </Form.Item>

          <Form.Item name='status' label='Status'>
            <Select
              options={Object.values(ClientStatus).map(status => ({
                label: status.replace('_', ' ').toUpperCase(),
                value: status,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit'>
                Update Client
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientsPage;
