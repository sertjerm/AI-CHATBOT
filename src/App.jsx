import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ChatInput } from './components/chat/ChatInput';
import { useAppStore } from './stores/appStore';
import { useChatStore } from './stores/chatStore';
import { useChat } from './hooks/useChat';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <i className="fas fa-exclamation-triangle" style={{
              fontSize: '3rem',
              color: '#f59e0b',
              marginBottom: '1rem'
            }}></i>
            <h2 style={{ marginBottom: '1rem', color: '#374151' }}>
              เกิดข้อผิดพลาด
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              ขออภัย เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              รีโหลดหน้า
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const chatWrapperRef = useRef(null);
  
  // Store hooks
  const { 
    isFullscreen, 
    initializeApp, 
    setInputValue 
  } = useAppStore();
  
  const { 
    loadChatHistory, 
    hideSamplePrompts 
  } = useChatStore();
  
  // Custom hooks
  const { sendMessage, clearChat, testConnection } = useChat();

  // Initialize app on mount
  useEffect(() => {
    const cleanup = initializeApp();
    loadChatHistory();
    
    // Test API connection
    setTimeout(() => {
      testConnection();
    }, 1000);

    // Cleanup function
    return cleanup;
  }, []);

  // Update wrapper class when fullscreen changes
  useEffect(() => {
    if (chatWrapperRef.current) {
      if (isFullscreen) {
        chatWrapperRef.current.classList.add('fullscreen');
      } else {
        chatWrapperRef.current.classList.remove('fullscreen');
      }
    }
  }, [isFullscreen]);

  // Handle prompt click from sidebar or sample prompts
  const handlePromptClick = (prompt) => {
    setInputValue(prompt);
    hideSamplePrompts();
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts(clearChat);

  return (
    <div className="chat-wrapper" ref={chatWrapperRef}>
      {/* Header */}
      <Header onClearChat={clearChat} />

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <Sidebar onPromptClick={handlePromptClick} />

        {/* Chat Area */}
        <div className="chat-area">
          <ChatArea onPromptClick={handlePromptClick} />
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;