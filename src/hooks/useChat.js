import { useState } from 'react';
import { useChatStore } from '../stores/chatStore';
import { chatAPI } from '../services/api';
import { notification } from 'antd';

export const useChat = () => {
  const [isTyping, setIsTyping] = useState(false);
  const { addMessage, setLoading, setError, clearMessages } = useChatStore();

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      // Add user message
      addMessage(content, 'user');
      setLoading(true);
      setError(null);
      setIsTyping(true);

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send to API
      const response = await chatAPI.sendMessage(content);
      
      if (response.content) {
        // Add AI response
        addMessage(response.content, 'assistant');
        
        // Log usage info if available
        if (response.usage) {
          console.log('📊 API Usage:', {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
            model: response.model
          });
        }
      } else {
        throw new Error('No response content received');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Show error notification
      notification.error({
        message: 'ข้อผิดพลาด',
        description: errorMessage,
        placement: 'topRight',
        duration: 5,
      });
      
      // Add error message to chat
      addMessage(`❌ เกิดข้อผิดพลาด: ${errorMessage}`, 'assistant');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    clearMessages();
    setError(null);
    notification.success({
      message: 'ล้างแชทแล้ว',
      description: 'ประวัติการสนทนาถูกลบเรียบร้อยแล้ว',
      placement: 'topRight',
      duration: 2,
    });
  };

  return {
    sendMessage,
    clearChat,
    isTyping,
  };
};
