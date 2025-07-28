import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const App = () => {
  // State variables
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showSamplePrompts, setShowSamplePrompts] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Refs
  const messageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatWrapperRef = useRef(null);

  // API Configuration
  const API_URL = 'https://cors-anywhere.herokuapp.com/https://apps4.coop.ku.ac.th/chatbotai/itkuscc_chat_proxy.php';

  // Sample prompts from original HTML
  const samplePrompts = [
    'AI ยี่ห้อไหนเก่งเรื่อง flowchart',
    'วิเคราะห์ข้อดีข้อเสียของ ChatGPT vs Claude',
    'อธิบายการทำงานของ Neural Network แบบง่ายๆ',
    'แนะนำเทคนิคการเขียน prompt ที่ดี'
  ];

  // Sidebar quick buttons
  const sidebarPrompts = [
    'AI ยี่ห้อไหนเก่งเรื่อง flowchart',
    'วิเคราะห์ข้อดีข้อเสียของ ChatGPT vs Claude',
    'อธิบายการทำงานของ Neural Network แบบง่ายๆ',
    'แนะนำเทคนิคการเขียน prompt ที่ดี',
    'ความแตกต่างระหว่าง Machine Learning กับ Deep Learning'
  ];

  // Initialize app on mount
  useEffect(() => {
    checkScreenSize();
    loadChatHistory();
    restoreDraft();
    testConnection();
    
    // Focus input
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleClearChat();
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update fullscreen class on body
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('fullscreen-mode');
      if (chatWrapperRef.current) {
        chatWrapperRef.current.classList.add('fullscreen');
      }
    } else {
      document.body.classList.remove('fullscreen-mode');
      if (chatWrapperRef.current) {
        chatWrapperRef.current.classList.remove('fullscreen');
      }
    }
  }, [isFullscreen]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Save draft on input change
  useEffect(() => {
    if (inputValue) {
      sessionStorage.setItem('chatDraft', inputValue);
    } else {
      sessionStorage.removeItem('chatDraft');
    }
  }, [inputValue]);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  // Check screen size for auto fullscreen
  const checkScreenSize = () => {
    const isLargeScreen = window.innerWidth >= 1024;
    if (isLargeScreen && !isFullscreen) {
      setIsFullscreen(true);
    }
  };

  // Format current time
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Convert markdown to HTML (same as original)
  const markdownToHtml = (text) => {
    // Escape HTML first
    text = text.replace(/&/g, '&amp;')
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
    text = text.replace(/(<li>.*?<\/li>)(?:\s*<br>\s*<li>.*?<\/li>)*/g, function(match) {
      return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
    });
    
    return text;
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Add message to chat
  const addMessage = (content, isUser = false, isError = false) => {
    const newMessage = {
      id: Date.now(),
      content: content,
      isUser: isUser,
      isError: isError,
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageCount(prev => prev + 1);
    setShowSamplePrompts(false);
  };

  // Handle send message
  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    addMessage(message, true);
    
    // Clear input and disable controls
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const requestData = { input: message };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      setIsTyping(false);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let aiResponse = 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล';
      
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
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
      
      // Add AI response
      addMessage(aiResponse, false);

      // Log usage info if available
      if (data.usage) {
        console.log('API Usage:', {
          prompt_tokens: data.usage.prompt_tokens,
          completion_tokens: data.usage.completion_tokens,
          total_tokens: data.usage.total_tokens
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      
      let errorMessage = 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.message}`;
      }
      
      addMessage(errorMessage, false, true);
    } finally {
      setIsLoading(false);
      
      // Focus input
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  };

  // Handle clear chat
  const handleClearChat = () => {
    if (window.confirm('คุณต้องการล้างประวัติการสนทนาทั้งหมดหรือไม่?')) {
      setMessages([]);
      setMessageCount(0);
      setShowSamplePrompts(true);
      
      // Clear storage
      sessionStorage.removeItem('chatHistory');
      sessionStorage.removeItem('messageCount');
      
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  };

  // Handle toggle fullscreen
  const handleToggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fill prompt
  const fillPrompt = (text) => {
    setInputValue(text);
    setShowSamplePrompts(false);
    
    if (messageInputRef.current) {
      messageInputRef.current.focus();
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = Math.min(messageInputRef.current.scrollHeight, 120) + 'px';
    }
  };

  // Save chat history
  const saveChatHistory = () => {
    try {
      const messageData = messages.map(msg => ({
        content: msg.content,
        isUser: msg.isUser,
        isError: msg.isError,
        timestamp: msg.timestamp
      }));
      sessionStorage.setItem('chatHistory', JSON.stringify(messageData));
      sessionStorage.setItem('messageCount', messageCount.toString());
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Load chat history
  const loadChatHistory = () => {
    try {
      const history = sessionStorage.getItem('chatHistory');
      const savedCount = sessionStorage.getItem('messageCount');
      
      if (savedCount) {
        setMessageCount(parseInt(savedCount) || 0);
      }
      
      if (history) {
        const messageData = JSON.parse(history);
        if (messageData && messageData.length > 0) {
          const loadedMessages = messageData.map((msg, index) => ({
            id: index,
            content: msg.content,
            isUser: msg.isUser,
            isError: msg.isError,
            timestamp: msg.timestamp
          }));
          setMessages(loadedMessages);
          setShowSamplePrompts(false);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      sessionStorage.removeItem('chatHistory');
      sessionStorage.removeItem('messageCount');
    }
  };

  // Restore draft
  const restoreDraft = () => {
    try {
      const draft = sessionStorage.getItem('chatDraft');
      if (draft) {
        setInputValue(draft);
      }
    } catch (error) {
      console.error('Error restoring draft:', error);
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: 'test' })
      });
      
      setIsOnline(response.ok);
      
      if (response.ok) {
        console.log('API connection successful');
      } else {
        console.warn('API returned non-OK status:', response.status);
      }
    } catch (error) {
      console.error('API connection test failed:', error);
      setIsOnline(false);
    }
  };

  // Render welcome message
  const renderWelcomeMessage = () => (
    <div className="welcome-message">
      <i className="fas fa-comments" style={{fontSize: '2rem', marginBottom: '10px', display: 'block'}}></i>
      สวัสดีครับ! ฉันคือ AI Assistant ที่ใช้ DeepSeek R1 Turbo<br/>
      พร้อมตอบคำถามและช่วยเหลือคุณในการวิเคราะห์และคิดอย่างลึกซึ้ง<br/>
      <small style={{color: '#94a3b8', marginTop: '10px', display: 'block'}}>พิมพ์ข้อความเพื่อเริ่มการสนทนา</small>
    </div>
  );

  // Render sample prompts
  const renderSamplePrompts = () => (
    <div className="sample-prompts">
      <h4>ตัวอย่างคำถาม:</h4>
      <div className="sample-prompts-grid">
        {samplePrompts.map((prompt, index) => (
          <button
            key={index}
            className="sample-prompt-btn"
            onClick={() => fillPrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );

  // Render typing indicator
  const renderTypingIndicator = () => (
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

  // Render message
  const renderMessage = (message) => {
    const processedContent = message.isUser ? message.content : markdownToHtml(message.content);
    
    return (
      <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
        <div className={`avatar ${message.isUser ? 'user' : 'ai'}`}>
          <i className={`fas fa-${message.isUser ? 'user' : (message.isError ? 'exclamation-triangle' : 'robot')}`}></i>
        </div>
        <div className={`message-content ${message.isError ? 'error-message' : ''}`}>
          <div dangerouslySetInnerHTML={{__html: processedContent}} />
          <div className="message-time">{message.timestamp}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-wrapper" ref={chatWrapperRef}>
      {/* Header */}
      <div className="chat-header">
        <div className="header-controls">
          <button 
            type="button" 
            className="control-btn fullscreen-btn" 
            onClick={handleToggleFullscreen}
          >
            <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
            <span>{isFullscreen ? 'ย่อจอ' : 'เต็มจอ'}</span>
          </button>
          <button type="button" className="control-btn" onClick={handleClearChat}>
            <i className="fas fa-trash"></i>
            <span>ล้างแชท</span>
          </button>
        </div>
        <h1><i className="fas fa-robot"></i> KUSCC AI Chatbot</h1>
        <p>Powered by DeepSeek R1 Turbo API</p>
        <div className="api-info">KUSCC API</div>
        <div className="status-indicator">
          <div className="status-dot" style={{background: isOnline ? '#4ade80' : '#ef4444'}}></div>
          <span style={{fontSize: '0.8rem'}}>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className={`sidebar ${isFullscreen && window.innerWidth >= 1024 ? 'visible' : ''}`}>
          <div className="sidebar-section">
            <h4>การสนทนาล่าสุด</h4>
            <div className="chat-history">
              <div className="history-item active">
                <div className="history-title">การสนทนาปัจจุบัน</div>
                <div className="history-time">ตอนนี้</div>
              </div>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h4>คำถามยอดนิยม</h4>
            <div className="popular-questions">
              {sidebarPrompts.map((prompt, index) => (
                <button 
                  key={index}
                  className="sidebar-quick-btn" 
                  onClick={() => fillPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h4>เกี่ยวกับ AI</h4>
            <div className="about-info">
              <p>DeepSeek R1 Turbo - AI ที่มีความสามารถในการคิดและวิเคราะห์อย่างลึกซึ้ง พร้อมตอบคำถามที่ซับซ้อนได้อย่างแม่นยำ</p>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">{messageCount}</span>
                  <span className="stat-label">ข้อความ</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99%</span>
                  <span className="stat-label">ความแม่นยำ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {/* Messages Container */}
          <div className="chat-messages" ref={messagesContainerRef}>
            <div className="chat-messages-inner">
              {messages.length === 0 && showSamplePrompts && renderWelcomeMessage()}
              
              {messages.map(renderMessage)}
              
              {isTyping && renderTypingIndicator()}
              
              {messages.length === 0 && showSamplePrompts && renderSamplePrompts()}
            </div>
          </div>

          {/* Input Area */}
          <div className="chat-input">
            <div className="input-container-wrapper">
              <div className="input-container">
                <textarea 
                  ref={messageInputRef}
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
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
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
        </div>
      </div>
    </div>
  );
};

export default App;