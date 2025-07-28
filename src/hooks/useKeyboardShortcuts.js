import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export const useKeyboardShortcuts = (onClearChat) => {
  const { toggleFullscreen, isFullscreen } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // F11 - Toggle fullscreen
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
      
      // Ctrl/Cmd + K - Clear chat
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onClearChat();
      }
      
      // Escape - Exit fullscreen
      if (event.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, isFullscreen, onClearChat]);
};
