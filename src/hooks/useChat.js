import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAppStore } from '../stores/appStore';

const API_URL = '/api/chat_proxy.php';

export const useChat = () => {
  const {
    addMessage,
    setLoading,
    setTyping,
    clearMessages,
    saveChatHistory,
    clearChatHistory,
  } = useChatStore();

  const { clearInputValue } = useAppStore();

  // Convert markdown to HTML (same as original)
  const markdownToHtml = useCallback((text) => {
    // Escape HTML first
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Convert markdown patterns
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');

    // Handle lists
    text = text.replace(/^- (.*)$/gm, '<li>$1</li>');
    text = text.replace(/^\d+\. (.*)$/gm, '<li>$1</li>');

    // Convert newlines
    text = text.replace(/\n/g, '<br>');

    // Wrap consecutive <li> tags in <ul>
    text = text.replace(
      /(<li>.*?<\/li>)(?:\s*<br>\s*<li>.*?<\/li>)*/g,
      function (match) {
        return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
      }
    );

    return text;
  }, []);

  // Send message to API
  const sendMessage = useCallback(
    async (msg) => {
      // Support both string and object (with message/memberNo)
      let message = msg;
      let memberNo = '';
      if (typeof msg === 'object' && msg !== null) {
        message = msg.message;
        memberNo = msg.memberNo || '';
      }
      if (!message || typeof message !== 'string' || !message.trim()) return;

      try {
        // Add user message
        addMessage(message, true);

        // Clear input
        clearInputValue();

        // Set loading states
        setLoading(true);
        setTyping(true);

        // API request
        const requestData = { input: message };
        if (memberNo) requestData.member_no = memberNo;
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        setTyping(false);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let aiResponse = 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล';

        if (
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message
        ) {
          aiResponse = data.choices[0].message.content.trim();
        } else if (data && data.error) {
          aiResponse = `ข้อผิดพลาดจาก API: ${data.error}`;
          addMessage(aiResponse, false, true);
          return;
        } else {
          console.error('Unexpected response format:', data);
          aiResponse = 'ได้รับการตอบสนองที่ไม่คาดคิดจาก API';
          addMessage(aiResponse, false, true);
          return;
        }

        // Add AI response with markdown processing
        const processedResponse = markdownToHtml(aiResponse);
        addMessage(processedResponse, false);

        // Log usage info if available
        if (data.usage) {
          console.log('API Usage:', {
            prompt_tokens: data.usage.prompt_tokens,
            completion_tokens: data.usage.completion_tokens,
            total_tokens: data.usage.total_tokens,
          });
        }

        // Save chat history
        setTimeout(() => {
          saveChatHistory();
        }, 100);
      } catch (error) {
        console.error('Error:', error);
        setTyping(false);

        let errorMessage = 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage =
            'ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.message}`;
        }

        addMessage(errorMessage, false, true);
      } finally {
        setLoading(false);
      }
    },
    [
      addMessage,
      clearInputValue,
      setLoading,
      setTyping,
      saveChatHistory,
      markdownToHtml,
    ]
  );

  // Clear chat
  const clearChat = useCallback(() => {
    if (window.confirm('คุณต้องการล้างประวัติการสนทนาทั้งหมดหรือไม่?')) {
      clearMessages();
      clearChatHistory();
      clearInputValue();
    }
  }, [clearMessages, clearChatHistory, clearInputValue]);

  // Test API connection
  const testConnection = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'test' }),
      });

      if (response.ok) {
        console.log('API connection successful');
        return true;
      } else {
        console.warn('API returned non-OK status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }, []);

  return {
    sendMessage,
    clearChat,
    testConnection,
    markdownToHtml,
  };
};
