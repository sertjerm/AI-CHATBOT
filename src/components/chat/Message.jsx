// src/components/chat/Message.jsx
import React from 'react';
import { Avatar, Button, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined, CopyOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatTime, copyToClipboard } from '../../utils';
import { notification } from 'antd';
import PropTypes from 'prop-types';

export const Message = ({ message: msg }) => {
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    const success = await copyToClipboard(msg.content);
    if (success) {
      notification.success({
        message: 'คัดลอกแล้ว',
        description: 'คัดลอกข้อความไปยังคลิปบอร์ดแล้ว',
        placement: 'topRight',
        duration: 2,
      });
    } else {
      notification.error({
        message: 'ไม่สามารถคัดลอกได้',
        description: 'เกิดข้อผิดพลาดในการคัดลอก',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  return (
    <div
      className={`flex gap-3 mb-4 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        className={isUser ? 'chat-gradient text-white' : 'bg-blue-500'}
        size="large"
      />

      <div
        className={`message-bubble relative group ${
          isUser
            ? 'chat-gradient text-white ml-auto'
            : 'bg-white shadow-md border'
        }`}
      >
        <div className="prose prose-sm max-w-none">
          {isUser ? (
            <p className="mb-0 text-white">{msg.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>

        <div
          className={`flex items-center justify-between mt-2 text-xs ${
            isUser ? 'text-white/80' : 'text-gray-500'
          }`}
        >
          <span>{formatTime(msg.timestamp)}</span>

          <Tooltip title="คัดลอก">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                isUser ? 'text-white/80 hover:text-white' : ''
              }`}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};
