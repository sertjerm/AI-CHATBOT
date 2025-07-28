import React, { Component } from 'react';
import { Result, Button } from 'antd';
import PropTypes from 'prop-types';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="เกิดข้อผิดพลาด"
          subTitle="ขออภัย มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง"
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              รีโหลดหน้า
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
