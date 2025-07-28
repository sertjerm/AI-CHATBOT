import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // State
  isFullscreen: false,
  sidebarCollapsed: false,
  theme: 'light',
  
  // Actions
  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }));
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },
  
  setTheme: (theme) => {
    set({ theme });
  },
}));
