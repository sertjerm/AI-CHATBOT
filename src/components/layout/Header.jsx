// src/components/layout/Header.jsx
import React from 'react';
import { Layout, Button, Space, Typography, Tooltip } from 'antd';
import {
  ExpandOutlined,
  CompressOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeleteOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import PropTypes from 'prop-types';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header = ({ onClearChat }) => {
  const { isFullscreen, sidebarCollapsed, toggleFullscreen, toggleSidebar } =
    useAppStore();

  return (
    <AntHeader
      style={{
        background: '#fff',
        boxShadow: '0 2px 8px #f0f1f2',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Button
          type="text"
          icon={
            sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={toggleSidebar}
          style={{
            color: '#595959',
            fontSize: 20,
            display: 'none',
            marginRight: 16,
          }}
          className="lg:flex"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RobotOutlined style={{ fontSize: 32, color: '#1677ff' }} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#222' }}>
              KUSCC AI Chatbot
            </Title>
            <span style={{ color: '#888', fontSize: 14 }}>
              Powered by DeepSeek R1 Turbo
            </span>
          </div>
        </div>
      </div>
      <Space size={16}>
        <Tooltip title="ล้างแชท">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={onClearChat}
            style={{ color: '#595959', fontSize: 20 }}
          />
        </Tooltip>
        <Tooltip title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'โหมดเต็มจอ'}>
          <Button
            type="text"
            icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={toggleFullscreen}
            style={{ color: '#595959', fontSize: 20 }}
          />
        </Tooltip>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#52c41a',
            fontSize: 14,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: '#52c41a',
              borderRadius: '50%',
              marginRight: 4,
              animation: 'pulse 1.2s infinite alternate',
            }}
          />
          <span style={{ color: '#52c41a' }}>Online</span>
        </div>
      </Space>
    </AntHeader>
  );
};

Header.propTypes = {
  onClearChat: PropTypes.func.isRequired,
};
