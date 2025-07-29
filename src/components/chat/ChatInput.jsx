import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';

export const ChatInput = ({ onSendMessage }) => {
  const { inputValue, setInputValue } = useAppStore();
  const { isLoading, hideSamplePrompts } = useChatStore();
  const inputRef = useRef(null);
  const [memberNo, setMemberNo] = useState('012938'); // Default member number

  // Focus input on mount and when loading changes
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Handle input change with auto-resize
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle send
  const handleSend = () => {
    const message = inputValue.trim();
    if (message && memberNo && !isLoading) {
      hideSamplePrompts(); // Hide sample prompts when user starts typing
      onSendMessage({ message, memberNo }); // ส่งเป็น object
    }
  };

  return (
    <div className="chat-input">
      <div className="input-container-wrapper">
        <div className="input-container">
          {/* เพิ่มช่องกรอก member_no */}
          <input
            type="text"
            className="member-no-input"
            placeholder="กรอกหมายเลขสมาชิก"
            value={memberNo}
            onChange={(e) => setMemberNo(e.target.value)}
            disabled={isLoading}
            style={{ marginRight: 8, width: 140 }}
          />
          <textarea
            ref={inputRef}
            className="input-field"
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
            rows="1"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button
            type="button"
            className="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim() || !memberNo || isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};
