import React, { useState } from 'react';
import { Avatar, Button, Tooltip, Tag } from 'antd';
import { 
  UserOutlined, 
  RobotOutlined, 
  CopyOutlined, 
  CheckOutlined,
  LikeOutlined,
  DislikeOutlined 
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatTime, copyToClipboard } from '../../utils';
import { notification } from 'antd';
import PropTypes from 'prop-types';

export const Message = ({ message: msg }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null); // null, true, false
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    const success = await copyToClipboard(msg.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const handleLike = (isLike) => {
    setLiked(isLike);
    notification.success({
      message: isLike ? 'ขอบคุณสำหรับการติชม' : 'ขอบคุณสำหรับความคิดเห็น',
      description: 'เราจะนำไปปรับปรุงระบบให้ดีขึ้น',
      placement: 'topRight',
      duration: 2,
    });
  };

  return (
    <div className={`flex gap-4 mb-6 animate-fade-in-up group ${
      isUser ? 'flex-row-reverse' : ''
    }`}>
      
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          className={`enhanced-avatar ${
            isUser 
              ? 'chat-gradient text-white shadow-glow' 
              : 'bg-white text-primary-600 shadow-glass'
          }`}
          size={48}
        />
        {!isUser && (
          <div className="text-center mt-2">
            <Tag 
              color="processing" 
              className="text-xs rounded-full px-2"
            >
              AI
            </Tag>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Message Bubble */}
        <div className={`message-bubble ${
          isUser 
            ? 'user-message ml-auto text-right' 
            : 'ai-message mr-auto text-left'
        } relative overflow-hidden`}>
          
          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {isUser ? (
              <p className="mb-0 text-white font-medium leading-relaxed">
                {msg.content}
              </p>
            ) : (
              <ReactMarkdown
                className="text-surface-800 leading-relaxed"
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-4">
                        <div className="bg-surface-800 text-white px-4 py-2 rounded-t-xl flex items-center justify-between text-sm">
                          <span className="font-mono">{match[1]}</span>
                          <Button
                            type="text"
                            icon={<CopyOutlined />}
                            size="small"
                            className="text-white/70 hover:text-white"
                            onClick={() => copyToClipboard(String(children))}
                          />
                        </div>
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          className="!mt-0 !rounded-t-none"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code 
                        className="bg-surface-100 text-primary-600 px-2 py-1 rounded-lg text-sm font-mono" 
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gradient mb-4 mt-6">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-surface-800 mb-3 mt-5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-surface-700 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary-400 pl-4 py-2 bg-primary-50 rounded-r-lg italic text-surface-700 my-4">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-3 text-surface-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-3 text-surface-700">
                      {children}
                    </ol>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Message Actions */}
          <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
            isUser 
              ? 'border-white/20' 
              : 'border-surface-200'
          }`}>
            
            {/* Timestamp */}
            <span className={`text-xs font-medium ${
              isUser 
                ? 'text-white/70' 
                : 'text-surface-500'
            }`}>
              {formatTime(msg.timestamp)}
            </span>

            {/* Action Buttons */}
            <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              isUser ? 'flex-row-reverse' : ''
            }`}>
              
              <Tooltip title={copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}>
                <Button
                  type="text"
                  size="small"
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={handleCopy}
                  className={`transition-all duration-200 ${
                    isUser 
                      ? 'text-white/70 hover:text-white hover:bg-white/10' 
                      : 'text-surface-500 hover:text-primary-600 hover:bg-primary-50'
                  } ${copied ? 'text-green-500' : ''}`}
                />
              </Tooltip>

              {/* Feedback buttons for AI messages */}
              {!isUser && (
                <>
                  <Tooltip title="ชอบคำตอบนี้">
                    <Button
                      type="text"
                      size="small"
                      icon={<LikeOutlined />}
                      onClick={() => handleLike(true)}
                      className={`transition-all duration-200 ${
                        liked === true 
                          ? 'text-green-500 bg-green-50' 
                          : 'text-surface-500 hover:text-green-600 hover:bg-green-50'
                      }`}
                    />
                  </Tooltip>
                  
                  <Tooltip title="ไม่ชอบคำตอบนี้">
                    <Button
                      type="text"
                      size="small"
                      icon={<DislikeOutlined />}
                      onClick={() => handleLike(false)}
                      className={`transition-all duration-200 ${
                        liked === false 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-surface-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    />
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User name tag */}
        {isUser && (
          <div className="text-right mt-2">
            <Tag className="rounded-full px-3 text-xs bg-gradient-primary text-white border-0">
              คุณ
            </Tag>
          </div>
        )}
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