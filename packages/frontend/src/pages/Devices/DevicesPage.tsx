import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  message,
  Dropdown,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Device, DeviceStatus, CreateDeviceDto } from '../../types';
import { devicesApi } from '../../api/devices';

const { Title } = Typography;
const { Search } = Input;

const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [form] = Form.useForm();

  const deviceStatusColors: Record<DeviceStatus, string> = {
    [DeviceStatus.REGISTERED]: 'default',
    [DeviceStatus.IN_STOCK]: 'blue',
    [DeviceStatus.AT_CLINIC]: 'green',
    [DeviceStatus.AT_PATIENT_HOME]: 'orange',
    [DeviceStatus.UNDER_SERVICE]: 'purple',
    [DeviceStatus.RMA]: 'red',
    [DeviceStatus.DECOMMISSIONED]: 'default',
  };

  const fetchDevices = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await devicesApi.getAll({
        page,
        limit: pageSize,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setDevices(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error('Ошибка загрузки устройств');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchDevices(pagination.current, pagination.pageSize);
  };

  const handleCreate = async (values: CreateDeviceDto) => {
    try {
      await devicesApi.create(values);
      message.success('Устройство создано успешно');
      setCreateModalVisible(false);
      form.resetFields();
      fetchDevices(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка создания устройства');
      console.error('Error creating device:', error);
    }
  };

  const handleUpdate = async (values: Partial<CreateDeviceDto>) => {
    if (!editingDevice) return;
    
    try {
      await devicesApi.update(editingDevice.id, values);
      message.success('Устройство обновлено успешно');
      setEditModalVisible(false);
      setEditingDevice(null);
      form.resetFields();
      fetchDevices(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка обновления устройства');
      console.error('Error updating device:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await devicesApi.delete(id);
      message.success('Устройство удалено успешно');
      fetchDevices(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка удаления устройства');
      console.error('Error deleting device:', error);
    }
  };

  const handleStatusChange = async (deviceId: string, status: DeviceStatus) => {
    try {
      await devicesApi.updateStatus(deviceId, status);
      message.success('Статус устройства обновлен');
      fetchDevices(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Ошибка обновления статуса');
      console.error('Error updating status:', error);
    }
  };

  const columns: ColumnsType<Device> = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
      sorter: true,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DeviceStatus) => (
        <Tag color={deviceStatusColors[status]}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
    },
    {
      title: 'Hardware Rev.',
      dataIndex: 'hardwareRevision',
      key: 'hardwareRevision',
    },
    {
      title: 'Firmware',
      dataIndex: 'firmwareVersion',
      key: 'firmwareVersion',
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
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDevice(record);
              form.setFieldsValue(record);
              setEditModalVisible(true);
            }}
          >
            Edit
          </Button>
          
          <Dropdown
            menu={{
              items: Object.values(DeviceStatus).map(status => ({
                key: status,
                label: status.replace('_', ' '),
                onClick: () => handleStatusChange(record.id, status),
              })),
            }}
          >
            <Button type="link">
              Status <MoreOutlined />
            </Button>
          </Dropdown>

          <Popconfirm
            title="Удалить устройство?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              Device Management
            </Title>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchDevices(pagination.current, pagination.pageSize)}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Add Device
              </Button>
            </Space>
          </div>

          <Search
            placeholder="Search devices..."
            allowClear
            style={{ width: 300 }}
            onSearch={(value) => {
              // TODO: Implement search
              console.log('Search:', value);
            }}
          />

          <Table
            columns={columns}
            dataSource={devices}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} devices`,
            }}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        </Space>
      </Card>

      {/* Create Device Modal */}
      <Modal
        title="Create New Device"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="serial"
            label="Serial Number"
            rules={[{ required: true, message: 'Please enter serial number' }]}
          >
            <Input placeholder="DEV-001-2024" />
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please enter model' }]}
          >
            <Input placeholder="Model X1" />
          </Form.Item>

          <Form.Item name="qrCode" label="QR Code">
            <Input placeholder="QR123456" />
          </Form.Item>

          <Form.Item name="hardwareRevision" label="Hardware Revision">
            <Input placeholder="v1.0" />
          </Form.Item>

          <Form.Item name="firmwareVersion" label="Firmware Version">
            <Input placeholder="1.2.3" />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue={DeviceStatus.REGISTERED}>
            <Select>
              {Object.values(DeviceStatus).map(status => (
                <Select.Option key={status} value={status}>
                  {status.replace('_', ' ')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="currentLocation" label="Current Location">
            <Input placeholder="Main Lab" />
          </Form.Item>

          <Form.Item name="telemetryEndpoint" label="Telemetry Endpoint">
            <Input placeholder="https://api.example.com/telemetry" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Device
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Device Modal */}
      <Modal
        title="Edit Device"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingDevice(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="serial"
            label="Serial Number"
            rules={[{ required: true, message: 'Please enter serial number' }]}
          >
            <Input placeholder="DEV-001-2024" />
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please enter model' }]}
          >
            <Input placeholder="Model X1" />
          </Form.Item>

          <Form.Item name="qrCode" label="QR Code">
            <Input placeholder="QR123456" />
          </Form.Item>

          <Form.Item name="hardwareRevision" label="Hardware Revision">
            <Input placeholder="v1.0" />
          </Form.Item>

          <Form.Item name="firmwareVersion" label="Firmware Version">
            <Input placeholder="1.2.3" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              {Object.values(DeviceStatus).map(status => (
                <Select.Option key={status} value={status}>
                  {status.replace('_', ' ')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="currentLocation" label="Current Location">
            <Input placeholder="Main Lab" />
          </Form.Item>

          <Form.Item name="telemetryEndpoint" label="Telemetry Endpoint">
            <Input placeholder="https://api.example.com/telemetry" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Device
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DevicesPage;
