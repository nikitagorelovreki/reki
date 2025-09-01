import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import FormsDashboard from './FormsDashboard';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Client, ClientStatus, Device, DeviceStatus } from '../../types';

const { Title, Text } = Typography;

interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  totalClients: number;
  activeClients: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 0,
    activeDevices: 0,
    totalClients: 0,
    activeClients: 0,
  });

  const [recentDevices, setRecentDevices] = useState<Device[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setStats({
      totalDevices: 45,
      activeDevices: 32,
      totalClients: 128,
      activeClients: 95,
    });

    // Mock recent devices
    setRecentDevices([
      {
        id: '1',
        serial: 'DEV-001-2024',
        model: 'Model X1',
        status: DeviceStatus.AT_CLINIC,
        currentLocation: 'Main Lab',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        serial: 'DEV-002-2024',
        model: 'Model X2',
        status: DeviceStatus.AT_PATIENT_HOME,
        currentLocation: 'Patient Home #123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ] as Device[]);

    // Mock recent clients
    setRecentClients([
      {
        id: '1',
        fullName: 'John Doe',
        status: ClientStatus.ACTIVE_THERAPY,
        diagnosis: 'Physical Therapy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        fullName: 'Jane Smith',
        status: ClientStatus.DIAGNOSTICS,
        diagnosis: 'Initial Assessment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ] as Client[]);
  }, []);

  const deviceColumns: ColumnsType<Device> = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
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
        <Tag color={status === DeviceStatus.AT_CLINIC ? 'green' : 'orange'}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
    },
  ];

  const clientColumns: ColumnsType<Client> = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ClientStatus) => (
        <Tag color={status === ClientStatus.ACTIVE_THERAPY ? 'green' : 'blue'}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
  ];

  const activityData = [
    {
      title: 'Device DEV-001-2024 was assigned to patient',
      description: '2 hours ago',
      avatar: <Avatar icon={<ToolOutlined />} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: 'New client John Doe was registered',
      description: '4 hours ago',
      avatar: <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />,
    },
    {
      title: 'Device DEV-003-2024 completed maintenance',
      description: '6 hours ago',
      avatar: <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#faad14' }} />,
    },
    {
      title: 'Client therapy session completed',
      description: '8 hours ago',
      avatar: <Avatar icon={<MedicineBoxOutlined />} style={{ backgroundColor: '#722ed1' }} />,
    },
  ];

  const deviceUtilization = Math.round((stats.activeDevices / stats.totalDevices) * 100);
  const clientActive = Math.round((stats.activeClients / stats.totalClients) * 100);

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>
      
      {/* Forms Dashboard */}
      <FormsDashboard />
      
      <Divider />
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Total Devices'
              value={stats.totalDevices}
              prefix={<ToolOutlined />}
              suffix={
                <Space>
                  <ArrowUpOutlined style={{ color: '#3f8600' }} />
                  <Text type='success'>12%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Active Devices'
              value={stats.activeDevices}
              prefix={<CheckCircleOutlined />}
              suffix={
                <Space>
                  <ArrowUpOutlined style={{ color: '#3f8600' }} />
                  <Text type='success'>8%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Total Clients'
              value={stats.totalClients}
              prefix={<UserOutlined />}
              suffix={
                <Space>
                  <ArrowUpOutlined style={{ color: '#3f8600' }} />
                  <Text type='success'>24%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Active Clients'
              value={stats.activeClients}
              prefix={<MedicineBoxOutlined />}
              suffix={
                <Space>
                  <ArrowDownOutlined style={{ color: '#cf1322' }} />
                  <Text type='danger'>2%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Utilization Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title='Device Utilization' extra={<Text>{deviceUtilization}%</Text>}>
            <Progress 
              percent={deviceUtilization} 
              status={deviceUtilization > 80 ? 'success' : 'normal'}
              strokeColor={deviceUtilization > 80 ? '#52c41a' : '#1890ff'}
            />
            <div style={{ marginTop: 16 }}>
              <Text type='secondary'>
                {stats.activeDevices} of {stats.totalDevices} devices are currently active
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title='Client Activity' extra={<Text>{clientActive}%</Text>}>
            <Progress 
              percent={clientActive} 
              status={clientActive > 70 ? 'success' : 'normal'}
              strokeColor={clientActive > 70 ? '#52c41a' : '#1890ff'}
            />
            <div style={{ marginTop: 16 }}>
              <Text type='secondary'>
                {stats.activeClients} of {stats.totalClients} clients are in active care
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Devices */}
        <Col xs={24} lg={12}>
          <Card title='Recent Devices' extra={<a href='/devices'>View All</a>}>
            <Table
              columns={deviceColumns}
              dataSource={recentDevices}
              pagination={false}
              size='small'
              rowKey='id'
            />
          </Card>
        </Col>

        {/* Recent Clients */}
        <Col xs={24} lg={12}>
          <Card title='Recent Clients' extra={<a href='/clients'>View All</a>}>
            <Table
              columns={clientColumns}
              dataSource={recentClients}
              pagination={false}
              size='small'
              rowKey='id'
            />
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24}>
          <Card title='Recent Activity'>
            <List
              itemLayout='horizontal'
              dataSource={activityData}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.avatar}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
