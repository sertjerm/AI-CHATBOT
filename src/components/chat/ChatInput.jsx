import React, { useState, useRef } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SendOutlined, AudioOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = 'พิมพ์ข้อความของคุณที่นี่...',
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <Input.TextArea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="flex-1 rounded-xl"
        />

        <div className="flex gap-2">
          <Tooltip title="บันทึกเสียง (เร็วๆ นี้)">
            <Button icon={<AudioOutlined />} disabled className="rounded-xl" />
          </Tooltip>

          <Tooltip title="ส่งข้อความ">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              className="rounded-xl bg-primary-500 hover:bg-primary-600"
            />
          </Tooltip>
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
