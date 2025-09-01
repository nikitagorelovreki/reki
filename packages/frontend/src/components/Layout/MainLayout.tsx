import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from 'antd';
import {
  DashboardOutlined,
  FormOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/devices',
      icon: <ToolOutlined />,
      label: 'Devices',
    },
    {
      key: '/clients',
      icon: <TeamOutlined />,
      label: 'Clients',
    },
    {
      key: '/forms',
      icon: <FormOutlined />,
      label: 'Forms',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme='light'
        style={{
          boxShadow: '2px 0 8px 0 rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Space direction='vertical' size='small'>
            <MedicineBoxOutlined 
              style={{ 
                fontSize: collapsed ? '24px' : '32px', 
                color: '#1890ff',
                transition: 'all 0.2s'
              }} 
            />
            {!collapsed && (
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                CUIS
              </Title>
            )}
          </Space>
        </div>
        
        <Menu
          theme='light'
          mode='inline'
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space size='middle'>
            <Button 
              type='text' 
              icon={<UserOutlined />}
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
            <Avatar 
              size='default' 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
            />
            <Button 
              type='text' 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              danger
            >
              Logout
            </Button>
          </Space>
        </Header>
        
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
