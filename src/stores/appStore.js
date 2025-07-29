import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // State
  isFullscreen: false,
  sidebarVisible: false,
  isOnline: navigator.onLine,
  inputValue: '',

  // Actions
  setFullscreen: (fullscreen) => {
    set({ isFullscreen: fullscreen });
    
    // Update body classes
    if (fullscreen) {
      document.body.classList.add('fullscreen-mode');
      // Show sidebar on large screens
      if (window.innerWidth >= 1024) {
        set({ sidebarVisible: true });
      }
    } else {
      document.body.classList.remove('fullscreen-mode');
      set({ sidebarVisible: false });
    }
  },

  toggleFullscreen: () => {
    const { isFullscreen } = get();
    get().setFullscreen(!isFullscreen);
  },

  setSidebarVisible: (visible) => set({ sidebarVisible: visible }),

  setOnline: (online) => set({ isOnline: online }),

  setInputValue: (value) => {
    set({ inputValue: value });
    
    // Auto-save draft
    if (value) {
      sessionStorage.setItem('chatDraft', value);
    } else {
      sessionStorage.removeItem('chatDraft');
    }
  },

  clearInputValue: () => {
    set({ inputValue: '' });
    sessionStorage.removeItem('chatDraft');
  },

  // Initialize app
  initializeApp: () => {
    // Check screen size for auto fullscreen
    const isLargeScreen = window.innerWidth >= 1024;
    if (isLargeScreen) {
      get().setFullscreen(true);
    }

    // Set initial online status
    get().setOnline(navigator.onLine);

    // Load draft
    try {
      const draft = sessionStorage.getItem('chatDraft');
      if (draft) {
        set({ inputValue: draft });
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }

    // Add online/offline listeners
    const handleOnline = () => get().setOnline(true);
    const handleOffline = () => get().setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Add resize listener
    const handleResize = () => {
      const { isFullscreen } = get();
      if (isFullscreen && window.innerWidth >= 1024) {
        set({ sidebarVisible: true });
      } else if (window.innerWidth < 1024) {
        set({ sidebarVisible: false });
      }
    };

    window.addEventListener('resize', handleResize);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }
}));