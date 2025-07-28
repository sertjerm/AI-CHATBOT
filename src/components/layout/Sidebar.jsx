import React from 'react';
import { Layout, Card, Button, Typography, Statistic, Space } from 'antd';
import {
  MessageOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useChatStore } from '../../stores/chatStore';
import PropTypes from 'prop-types';

const { Sider } = Layout;
const { Paragraph } = Typography;

const quickPrompts = [
  'AI ยี่ห้อไหนเก่งเรื่อง flowchart',
  'วิเคราะห์ข้อดีข้อเสียของ ChatGPT vs Claude',
  'อธิบายการทำงานของ Neural Network แบบง่ายๆ',
  'แนะนำเทคนิคการเขียน prompt ที่ดี',
  'ความแตกต่างระหว่าง Machine Learning กับ Deep Learning',
];

export const Sidebar = ({ collapsed, onQuickPrompt }) => {
  const { messages } = useChatStore();
  if (collapsed) return null;

  return (
    <Sider
      width={340}
      className="hidden lg:flex flex-col bg-gradient-to-br from-indigo-400/80 via-purple-400/60 to-blue-300/80 border-none shadow-2xl backdrop-blur-xl !rounded-2xl m-4 h-[92vh]"
      collapsed={false}
      style={{
        minWidth: 320,
        maxWidth: 360,
        border: 'none',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      }}
    >
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
        {/* Chat History Section */}
        <Card
          size="small"
          className="rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-md"
          title={
            <Space>
              <MessageOutlined className="text-indigo-500" />
              <span className="font-semibold text-indigo-700">
                การสนทนาล่าสุด
              </span>
            </Space>
          }
        >
          <div className="space-y-2">
            <div className="p-3 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 rounded-xl border border-blue-200 flex flex-col items-start shadow-sm">
              <div className="font-medium text-sm text-indigo-700">
                การสนทนาปัจจุบัน
              </div>
              <div className="text-xs text-gray-500">ตอนนี้</div>
            </div>
          </div>
        </Card>

        {/* Quick Prompts Section */}
        <Card
          size="small"
          className="rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-md"
          title={
            <Space>
              <BulbOutlined className="text-yellow-500" />
              <span className="font-semibold text-yellow-700">
                คำถามยอดนิยม
              </span>
            </Space>
          }
        >
          <div className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                type="default"
                size="middle"
                onClick={() => onQuickPrompt(prompt)}
                className="w-full text-left h-auto whitespace-normal p-3 rounded-xl font-medium bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 shadow-sm border-0 transition-all duration-200"
                style={{ boxShadow: '0 2px 8px 0 rgba(102,126,234,0.08)' }}
              >
                <BulbOutlined className="mr-2 text-yellow-400" />
                {prompt}
              </Button>
            ))}
          </div>
        </Card>

        {/* About Section */}
        <Card
          size="small"
          className="rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-md"
          title={
            <Space>
              <InfoCircleOutlined className="text-blue-500" />
              <span className="font-semibold text-blue-700">เกี่ยวกับ AI</span>
            </Space>
          }
        >
          <Paragraph className="text-base text-gray-700 mb-4 font-medium">
            DeepSeek R1 Turbo{' '}
            <span className="font-bold text-indigo-600">AI</span>{' '}
            ที่มีความสามารถในการคิดและวิเคราะห์อย่างลึกซึ้ง
            <br />
            พร้อมตอบคำถามที่ซับซ้อนได้อย่างแม่นยำ
          </Paragraph>
          <div className="grid grid-cols-2 gap-4">
            <Statistic
              title={<span className="text-xs text-gray-500">ข้อความ</span>}
              value={messages.length}
              prefix={<ExperimentOutlined className="text-indigo-400" />}
              valueStyle={{
                fontSize: '18px',
                color: '#6366f1',
                fontWeight: 600,
              }}
            />
            <Statistic
              title={<span className="text-xs text-gray-500">ความแม่นยำ</span>}
              value={99}
              suffix="%"
              valueStyle={{
                fontSize: '18px',
                color: '#059669',
                fontWeight: 600,
              }}
            />
          </div>
        </Card>
      </div>
    </Sider>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onQuickPrompt: PropTypes.func.isRequired,
};
