import React from 'react';
import { Card, Descriptions, Tag, Space } from 'antd';
import { UserOutlined, MailOutlined, SafetyOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card title="Profile" style={{ margin: '20px' }}>
        <p>User information not available</p>
      </Card>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title={
          <Space>
            <UserOutlined />
            User Profile
          </Space>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item 
            label={
              <Space>
                <UserOutlined />
                Username
              </Space>
            }
          >
            {user.username}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Space>
                <MailOutlined />
                Email
              </Space>
            }
          >
            {user.email}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Space>
                <SafetyOutlined />
                Roles
              </Space>
            }
          >
            <Space wrap>
              {user.roles.map(role => (
                <Tag key={role} color="blue">
                  {role}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={
              <Space>
                <KeyOutlined />
                Permissions
              </Space>
            }
          >
            <Space wrap>
              {user.permissions.map(permission => (
                <Tag key={permission} color="green">
                  {permission}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
