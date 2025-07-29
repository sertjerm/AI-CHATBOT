import React from 'react';
import PropTypes from 'prop-types';
import { useAppStore } from '../../stores/appStore';

export const Header = ({ onClearChat }) => {
  const { isFullscreen, isOnline, toggleFullscreen } = useAppStore();

  return (
    <div className="chat-header">
      <div className="header-controls">
        <button 
          type="button" 
          className="control-btn fullscreen-btn" 
          onClick={toggleFullscreen}
        >
          <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
          <span>{isFullscreen ? 'ย่อจอ' : 'เต็มจอ'}</span>
        </button>
        <button type="button" className="control-btn" onClick={onClearChat}>
          <i className="fas fa-trash"></i>
          <span>ล้างแชท</span>
        </button>
      </div>
      
      <h1>
        <i className="fas fa-robot"></i> KUSCC AI Chatbot
      </h1>
      <p>Powered by DeepSeek R1 Turbo API</p>
      
      <div className="api-info">KUSCC API</div>
      
      <div className="status-indicator">
        <div 
          className="status-dot" 
          style={{background: isOnline ? '#4ade80' : '#ef4444'}}
        ></div>
        <span style={{fontSize: '0.8rem'}}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

Header.propTypes = {
  onClearChat: PropTypes.func.isRequired,
};