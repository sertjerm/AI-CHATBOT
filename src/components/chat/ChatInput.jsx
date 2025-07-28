import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Tooltip, Upload, Dropdown, Space } from 'antd';
import {
  SendOutlined,
  AudioOutlined,
  PaperClipOutlined,
  SmileOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const quickActions = [
  { key: 'summarize', label: 'สรุปเนื้อหา', icon: <ThunderboltOutlined /> },
  { key: 'translate', label: 'แปลภาษา', icon: <ThunderboltOutlined /> },
  { key: 'explain', label: 'อธิบายแบบง่าย', icon: <SmileOutlined /> },
];

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = 'พิมพ์ข้อความของคุณที่นี่... ✨',
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    if (message.trim() && !disabled && !isComposing) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = ({ key }) => {
    const action = quickActions.find((a) => a.key === key);
    if (action && message.trim()) {
      const quickPrompt = `${action.label}: ${message}`;
      onSendMessage(quickPrompt);
      setMessage('');
    }
  };

  const isMessageValid = message.trim() && !disabled;

  return (
    <div className="sticky bottom-0 border-t-0 bg-gradient-glass backdrop-blur-2xl p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Quick Actions (when there's text) */}
        {message.trim() && (
          <div className="mb-4 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-surface-600">
                การดำเนินการด่วน:
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action) => (
                <Button
                  key={action.key}
                  size="small"
                  icon={action.icon}
                  onClick={() => handleQuickAction({ key: action.key })}
                  className="rounded-full bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100 hover:border-primary-300 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="relative">
          <div className="flex items-end gap-3 bg-white rounded-3xl p-4 shadow-glass border border-white/30">
            {/* Text Input */}
            <div className="flex-1 relative">
              <TextArea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder={placeholder}
                disabled={disabled}
                autoSize={{
                  minRows: 1,
                  maxRows: 6,
                }}
                className="border-0 shadow-none resize-none text-surface-800 placeholder:text-surface-400 focus:shadow-none"
                style={{
                  background: 'transparent',
                  boxShadow: 'none',
                }}
              />

              {/* Character Count */}
              {message.length > 100 && (
                <div className="absolute bottom-1 right-2 text-xs text-surface-400">
                  {message.length}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* File Upload */}
              <Tooltip title="แนบไฟล์ (เร็วๆ นี้)">
                <Upload disabled>
                  <Button
                    icon={<PaperClipOutlined />}
                    disabled
                    className="rounded-2xl border-surface-200 text-surface-400 hover:border-surface-300"
                    size="large"
                  />
                </Upload>
              </Tooltip>

              {/* Voice Input */}
              <Tooltip title="บันทึกเสียง (เร็วๆ นี้)">
                <Button
                  icon={<AudioOutlined />}
                  disabled
                  className="rounded-2xl border-surface-200 text-surface-400 hover:border-surface-300"
                  size="large"
                />
              </Tooltip>

              {/* Settings */}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'voice',
                      label: 'การตั้งค่าเสียง',
                      icon: <AudioOutlined />,
                      disabled: true,
                    },
                    {
                      key: 'shortcuts',
                      label: 'คีย์ลัด',
                      icon: <ThunderboltOutlined />,
                    },
                  ],
                }}
                trigger={['click']}
                placement="topRight"
              >
                <Button
                  icon={<SettingOutlined />}
                  className="rounded-2xl border-surface-200 text-surface-500 hover:border-surface-300 hover:text-surface-600"
                  size="large"
                />
              </Dropdown>

              {/* Send Button */}
              <Tooltip
                title={
                  !isMessageValid
                    ? 'พิมพ์ข้อความเพื่อส่ง'
                    : 'ส่งข้อความ (Enter)'
                }
              >
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={!isMessageValid}
                  loading={disabled}
                  className={`enhanced-button rounded-2xl h-12 w-12 ${
                    isMessageValid
                      ? 'shadow-glow hover:shadow-glow-lg'
                      : 'opacity-50'
                  }`}
                  size="large"
                />
              </Tooltip>
            </div>
          </div>

          {/* Input Suggestions */}
          <div className="mt-3 flex items-center justify-between text-xs text-surface-500">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-2 py-1 bg-surface-100 rounded text-surface-600 font-mono">
                  Enter
                </kbd>{' '}
                ส่งข้อความ
              </span>
              <span>
                <kbd className="px-2 py-1 bg-surface-100 rounded text-surface-600 font-mono">
                  Shift + Enter
                </kbd>{' '}
                ขึ้นบรรทัดใหม่
              </span>
            </div>

            {disabled && (
              <div className="flex items-center gap-2 text-primary-500">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="font-medium">AI กำลังตอบ...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};
