import React from 'react';
import PropTypes from 'prop-types';

export const Message = ({ message }) => {
  const { content, isUser, isError, timestamp } = message;

  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className={`avatar ${isUser ? 'user' : 'ai'}`}>
        <i className={`fas fa-${isUser ? 'user' : (isError ? 'exclamation-triangle' : 'robot')}`}></i>
      </div>
      <div className={`message-content ${isError ? 'error-message' : ''}`}>
        {isUser ? (
          <div>{content}</div>
        ) : (
          <div dangerouslySetInnerHTML={{__html: content}} />
        )}
        <div className="message-time">{timestamp}</div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    isUser: PropTypes.bool.isRequired,
    isError: PropTypes.bool,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
};