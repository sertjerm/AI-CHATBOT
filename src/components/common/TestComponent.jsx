import React from 'react';
import { Button } from 'antd';

export const TestComponent = () => {
  return (
    <div className="p-4 chat-gradient text-white rounded-lg">
      <h3 className="text-lg font-bold mb-2">🎉 Setup Successful!</h3>
      <p className="mb-4">Tailwind CSS and Ant Design are working correctly!</p>
      <Button type="primary">Test Button</Button>
    </div>
  );
};
