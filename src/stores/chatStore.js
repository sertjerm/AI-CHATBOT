import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  isLoading: false,
  error: null,
  
  // Actions
  addMessage: (content, role) => {
    const message = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setError: (error) => {
    set({ error });
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
  
  updateLastMessage: (content) => {
    const { messages } = get();
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.role === 'assistant') {
      const updatedMessages = [...messages];
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        content,
      };
      
      set({ messages: updatedMessages });
    }
  },
}));
