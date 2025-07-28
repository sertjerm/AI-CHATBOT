import React, { useEffect, useRef } from 'react';
import { Empty } from 'antd';
import { useChatStore } from '../../stores/chatStore';
import { Message } from './Message';
import { TypingIndicator } from '../common/TypingIndicator';
import { useChat } from '../../hooks/useChat';

export const ChatArea = () => {
  const { messages } = useChatStore();
  const { isTyping } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Empty
          description={
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                สวัสดีครับ! ✨
              </h3>
              <p className="text-gray-500">
                ฉันคือ AI Assistant ที่ใช้ DeepSeek R1 Turbo
                <br />
                พร้อมตอบคำถามและช่วยเหลือคุณในการวิเคราะห์อย่างลึกซึ้ง
              </p>
              <p className="text-sm text-gray-400 mt-2">
                พิมพ์ข้อความเพื่อเริ่มการสนทนา
              </p>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs">AI</span>
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
