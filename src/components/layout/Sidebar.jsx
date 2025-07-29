import React from 'react';
import PropTypes from 'prop-types';
import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';
import { FAQ } from '../../utils/constants';

// ดึง title/submenu แรกของแต่ละ intent จาก FAQ
const sidebarPrompts = FAQ.flatMap((faq) =>
  Array.isArray(faq.submenus) && faq.submenus.length > 0
    ? faq.submenus[0].title
      ? [faq.submenus[0].title]
      : [faq.submenus[0]]
    : []
);

export const Sidebar = ({ onPromptClick }) => {
  const { sidebarVisible } = useAppStore();
  const { messageCount } = useChatStore();

  if (!sidebarVisible) return null;

  return (
    <div className="sidebar visible">
      <div className="sidebar-section">
        <h4>การสนทนาล่าสุด</h4>
        <div className="chat-history">
          <div className="history-item active">
            <div className="history-title">การสนทนาปัจจุบัน</div>
            <div className="history-time">ตอนนี้</div>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>คำถามยอดนิยม</h4>
        <div className="popular-questions">
          {sidebarPrompts.map((prompt, index) => (
            <button
              key={index}
              className="sidebar-quick-btn"
              onClick={() => onPromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>เกี่ยวกับ AI</h4>
        <div className="about-info">
          <p>
            DeepSeek R1 Turbo - AI
            ที่มีความสามารถในการคิดและวิเคราะห์อย่างลึกซึ้ง
            พร้อมตอบคำถามที่ซับซ้อนได้อย่างแม่นยำ
          </p>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">{messageCount}</span>
              <span className="stat-label">ข้อความ</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">ความแม่นยำ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onPromptClick: PropTypes.func.isRequired,
};
