import React from 'react';
import { Layout, Button, Space, Typography, Tooltip, Badge } from 'antd';
import {
  ExpandOutlined,
  CompressOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeleteOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import PropTypes from 'prop-types';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

export const Header = ({ onClearChat }) => {
  const { isFullscreen, sidebarCollapsed, toggleFullscreen, toggleSidebar } =
    useAppStore();

  return (
    <AntHeader className="header-gradient sticky top-0 z-50 px-6 flex items-center justify-between h-20 border-0 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className="lg:flex hidden text-surface-600 hover:text-primary-600 text-xl p-3 rounded-2xl hover:bg-white/50 transition-all duration-300"
        />
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <RobotOutlined className="text-2xl text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          
          <div className="hidden sm:block">
            <Title level={3} className="!mb-0 text-gradient font-bold">
              KUSCC AI Chatbot
            </Title>
            <div className="flex items-center gap-2">
              <Badge 
                status="processing" 
                className="animate-pulse" 
              />
              <Text className="text-surface-600 text-sm font-medium">
                Powered by DeepSeek R1 Turbo
              </Text>
              <ThunderboltOutlined className="text-yellow-500 text-xs animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <Space size={12}>
        <Tooltip title="ล้างประวัติการสนทนา" placement="bottom">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={onClearChat}
            className="text-surface-600 hover:text-red-500 text-xl p-3 rounded-2xl hover:bg-red-50 transition-all duration-300 hover:scale-105"
          />
        </Tooltip>
        
        <Tooltip 
          title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'โหมดเต็มจอ'} 
          placement="bottom"
        >
          <Button
            type="text"
            icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={toggleFullscreen}
            className="text-surface-600 hover:text-primary-600 text-xl p-3 rounded-2xl hover:bg-primary-50 transition-all duration-300 hover:scale-105"
          />
        </Tooltip>
        
        <div className="hidden sm:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-2xl border border-green-200">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-glow" />
          <Text className="text-green-700 font-semibold text-sm">
            Online
          </Text>
        </div>
      </Space>
      
      {/* Mobile Title */}
      <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
        <Title level={4} className="!mb-0 text-gradient font-bold">
          KUSCC AI
        </Title>
      </div>
    </AntHeader>
  );
};

Header.propTypes = {
  onClearChat: PropTypes.func.isRequired,
};