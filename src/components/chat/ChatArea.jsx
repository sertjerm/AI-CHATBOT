import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useChatStore } from '../../stores/chatStore';
import { Message } from './Message';
import { FAQ } from '../../utils/constants';

// ดึงตัวอย่างคำถามจาก title/submenu แรกของแต่ละ intent
const samplePrompts = FAQ.flatMap((faq) =>
  Array.isArray(faq.submenus) && faq.submenus.length > 0
    ? faq.submenus[0].title
      ? [faq.submenus[0].title]
      : [faq.submenus[0]]
    : []
);

const WelcomeMessage = () => (
  <div className="welcome-message">
    <i
      className="fas fa-comments"
      style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}
    ></i>
    สวัสดีครับ! ฉันคือ AI Assistant ที่ใช้ DeepSeek R1 Turbo
    <br />
    พร้อมตอบคำถามและช่วยเหลือคุณในการวิเคราะห์และคิดอย่างลึกซึ้ง
    <br />
    <small style={{ color: '#94a3b8', marginTop: '10px', display: 'block' }}>
      พิมพ์ข้อความเพื่อเริ่มการสนทนา
    </small>
  </div>
);

const SamplePrompts = ({ onPromptClick }) => (
  <div className="sample-prompts">
    <h4>ตัวอย่างคำถาม:</h4>
    <div className="sample-prompts-grid">
      {samplePrompts.map((prompt, index) => (
        <button
          key={index}
          className="sample-prompt-btn"
          onClick={() => onPromptClick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="message ai">
    <div className="avatar ai">
      <i className="fas fa-robot"></i>
    </div>
    <div className="typing-indicator">
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  </div>
);

export const ChatArea = ({ onPromptClick }) => {
  const { messages, showSamplePrompts, isTyping } = useChatStore();
  const messagesContainerRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      <div className="chat-messages-inner">
        {/* Welcome message when no messages */}
        {messages.length === 0 && showSamplePrompts && <WelcomeMessage />}

        {/* Messages */}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Sample prompts when no messages */}
        {messages.length === 0 && showSamplePrompts && (
          <SamplePrompts onPromptClick={onPromptClick} />
        )}
      </div>
    </div>
  );
};

SamplePrompts.propTypes = {
  onPromptClick: PropTypes.func.isRequired,
};

ChatArea.propTypes = {
  onPromptClick: PropTypes.func.isRequired,
};
