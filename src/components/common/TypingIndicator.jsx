import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-2">
      <div className="flex space-x-1">
        <div className="typing-dot" style={{ animationDelay: '0ms' }} />
        <div className="typing-dot" style={{ animationDelay: '150ms' }} />
        <div className="typing-dot" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-gray-500 text-sm ml-2">AI กำลังพิมพ์...</span>
    </div>
  );
};
