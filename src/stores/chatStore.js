import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  isLoading: false,
  isTyping: false,
  messageCount: 0,
  showSamplePrompts: true,

  // Actions
  addMessage: (content, isUser = false, isError = false) => {
    const newMessage = {
      id: Date.now(),
      content: content,
      isUser: isUser,
      isError: isError,
      timestamp: new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      messageCount: state.messageCount + 1,
      showSamplePrompts: false
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),
  
  setTyping: (typing) => set({ isTyping: typing }),

  clearMessages: () => set({
    messages: [],
    messageCount: 0,
    showSamplePrompts: true,
    isLoading: false,
    isTyping: false
  }),

  hideSamplePrompts: () => set({ showSamplePrompts: false }),

  // Save/Load from sessionStorage
  saveChatHistory: () => {
    try {
      const state = get();
      const messageData = state.messages.map(msg => ({
        content: msg.content,
        isUser: msg.isUser,
        isError: msg.isError,
        timestamp: msg.timestamp
      }));
      sessionStorage.setItem('chatHistory', JSON.stringify(messageData));
      sessionStorage.setItem('messageCount', state.messageCount.toString());
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  },

  loadChatHistory: () => {
    try {
      const history = sessionStorage.getItem('chatHistory');
      const savedCount = sessionStorage.getItem('messageCount');
      
      if (savedCount) {
        const count = parseInt(savedCount) || 0;
        set({ messageCount: count });
      }
      
      if (history) {
        const messageData = JSON.parse(history);
        if (messageData && messageData.length > 0) {
          const loadedMessages = messageData.map((msg, index) => ({
            id: Date.now() + index,
            content: msg.content,
            isUser: msg.isUser,
            isError: msg.isError,
            timestamp: msg.timestamp
          }));
          set({
            messages: loadedMessages,
            showSamplePrompts: false,
            messageCount: messageData.length
          });
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      sessionStorage.removeItem('chatHistory');
      sessionStorage.removeItem('messageCount');
    }
  },

  clearChatHistory: () => {
    sessionStorage.removeItem('chatHistory');
    sessionStorage.removeItem('messageCount');
  }
}));