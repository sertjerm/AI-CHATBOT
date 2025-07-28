import React from 'react';
import { Layout, Modal } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ChatInput } from './components/chat/ChatInput';
import { useAppStore } from './stores/appStore';
import { useChatStore } from './stores/chatStore';
import { useChat } from './hooks/useChat';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';

const { Content } = Layout;

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { isFullscreen, sidebarCollapsed } = useAppStore();
  const { isLoading } = useChatStore();
  const { sendMessage, clearChat } = useChat();

  function handleClearChat() {
    Modal.confirm({
      title: 'ล้างประวัติการสนทนา',
      content: 'คุณต้องการล้างประวัติการสนทนาทั้งหมดหรือไม่?',
      okText: 'ล้าง',
      cancelText: 'ยกเลิก',
      onOk: clearChat,
    });
  }

  function handleQuickPrompt(prompt) {
    sendMessage(prompt);
  }

  // Setup keyboard shortcuts
  useKeyboardShortcuts(handleClearChat);

  return (
    <div className={`h-screen ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Layout className="h-full">
        <Header onClearChat={handleClearChat} />
        
        <Layout className="flex-1">
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onQuickPrompt={handleQuickPrompt}
          />
          
          <Layout className="flex-1">
            <Content className="flex flex-col">
              <ChatArea />
              <ChatInput 
                onSendMessage={sendMessage}
                disabled={isLoading}
                placeholder="พิมพ์ข้อความของคุณที่นี่... (Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัดใหม่)"
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
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
