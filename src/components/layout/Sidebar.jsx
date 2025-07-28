import React from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Statistic,
  Space,
  Tag,
  Divider,
} from 'antd';
import {
  MessageOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  ExperimentOutlined,
  StarOutlined,
  RocketOutlined,
  FireOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useChatStore } from '../../stores/chatStore';
import PropTypes from 'prop-types';

const { Sider } = Layout;
const { Paragraph, Text, Title } = Typography;

const quickPrompts = [
  {
    text: 'AI ยี่ห้อไหนเก่งเรื่อง flowchart',
    icon: <RocketOutlined />,
    category: 'เทคนิค',
  },
  {
    text: 'วิเคราะห์ข้อดีข้อเสียของ ChatGPT vs Claude',
    icon: <ExperimentOutlined />,
    category: 'เปรียบเทียบ',
  },
  {
    text: 'อธิบายการทำงานของ Neural Network แบบง่ายๆ',
    icon: <BulbOutlined />,
    category: 'การเรียนรู้',
  },
  {
    text: 'แนะนำเทคนิคการเขียน prompt ที่ดี',
    icon: <StarOutlined />,
    category: 'เทคนิค',
  },
  {
    text: 'ความแตกต่างระหว่าง Machine Learning กับ Deep Learning',
    icon: <FireOutlined />,
    category: 'การเรียนรู้',
  },
];

export const Sidebar = ({ collapsed, onQuickPrompt }) => {
  const { messages } = useChatStore();

  if (collapsed) return null;

  return (
    <Sider
      width={360}
      className="hidden lg:flex flex-col sidebar-morphism m-4 h-[calc(100vh-2rem)] rounded-3xl shadow-glass border-0"
      collapsed={false}
      style={{
        minWidth: 340,
        maxWidth: 380,
      }}
    >
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
        {/* Welcome Section */}
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
            <RobotOutlined className="text-3xl text-white" />
          </div>
          <Title level={4} className="!mb-2 text-white font-bold">
            AI Assistant
          </Title>
          <Text className="text-white/80 text-sm">
            พร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง
          </Text>
        </div>

        <Divider className="border-white/20 my-4" />

        {/* Stats Section */}
        <Card
          size="small"
          className="glass-card border-white/30 bg-white/90"
          bodyStyle={{ padding: '16px' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Statistic
              title={
                <span className="text-surface-600 text-xs font-semibold">
                  ข้อความทั้งหมด
                </span>
              }
              value={messages.length}
              valueStyle={{
                color: '#667eea',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
              suffix={<MessageOutlined className="text-primary-500" />}
            />
            <Statistic
              title={
                <span className="text-surface-600 text-xs font-semibold">
                  การสนทนา
                </span>
              }
              value="1"
              valueStyle={{
                color: '#f093fb',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
              suffix={<StarOutlined className="text-pink-500" />}
            />
          </div>
        </Card>

        {/* Quick Prompts Section */}
        <Card
          size="small"
          className="glass-card border-white/30 bg-white/90"
          title={
            <Space className="w-full justify-between">
              <Space>
                <BulbOutlined className="text-primary-500" />
                <span className="font-bold text-surface-700">คำถามแนะนำ</span>
              </Space>
              <Tag color="processing" className="rounded-full px-2">
                ใหม่
              </Tag>
            </Space>
          }
          bodyStyle={{ padding: '16px' }}
        >
          <div className="space-y-3">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                onClick={() => onQuickPrompt(prompt.text)}
                className="quick-prompt-btn hover:scale-[1.02] active:scale-[0.98] group"
                block
              >
                <div className="flex items-start gap-3 text-left">
                  <div className="text-lg mt-0.5 group-hover:scale-110 transition-transform">
                    {prompt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-2 mb-1">
                      {prompt.text}
                    </div>
                    <Tag
                      size="small"
                      className="rounded-full text-xs"
                      color={prompt.category === 'เทคนิค' ? 'blue' : 'purple'}
                    >
                      {prompt.category}
                    </Tag>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Tips Section */}
        <Card
          size="small"
          className="glass-card border-white/30 bg-white/90"
          title={
            <Space>
              <InfoCircleOutlined className="text-blue-500" />
              <span className="font-bold text-surface-700">
                เคล็ดลับการใช้งาน
              </span>
            </Space>
          }
          bodyStyle={{ padding: '16px' }}
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <Paragraph className="text-surface-600 text-sm !mb-0">
                <strong>Enter</strong> เพื่อส่งข้อความ
              </Paragraph>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <Paragraph className="text-surface-600 text-sm !mb-0">
                <strong>Shift+Enter</strong> เพื่อขึ้นบรรทัดใหม่
              </Paragraph>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
              <Paragraph className="text-surface-600 text-sm !mb-0">
                ใช้ประโยคที่ชัดเจนเพื่อผลลัพธ์ที่ดีที่สุด
              </Paragraph>
            </div>
          </div>
        </Card>

        {/* Version Info */}
        <div className="mt-auto pt-4">
          <div className="text-center">
            <Text className="text-white/60 text-xs">
              KUSCC AI Chatbot v1.0.0
            </Text>
          </div>
        </div>
      </div>
    </Sider>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onQuickPrompt: PropTypes.func.isRequired,
};
