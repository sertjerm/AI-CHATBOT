import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export const useKeyboardShortcuts = (onClearChat) => {
  const { toggleFullscreen, setFullscreen } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // F11 for fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Ctrl/Cmd + K for clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClearChat();
      }
      
      // Escape to exit fullscreen
      if (e.key === 'Escape') {
        setFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreen, setFullscreen, onClearChat]);
};