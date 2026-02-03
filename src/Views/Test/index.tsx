import React from 'react';
import './Test.css';

const Test: React.FC = () => {
  return (
    <div className="test-container">
      <div className="test-content">
        <h1 className="test-title">测试页面</h1>
        <p className="test-description">
          这是一个测试页面，用于验证路由配置是否正常工作。
        </p>
        <div className="test-info">
          <div className="info-card">
            <h3>页面信息</h3>
            <ul>
              <li>路由路径: /test</li>
              <li>组件名称: Test</li>
              <li>状态: 正常运行</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>功能说明</h3>
            <ul>
              <li>路由跳转测试</li>
              <li>组件渲染测试</li>
              <li>样式应用测试</li>
            </ul>
          </div>
        </div>
        <div className="navigation-links">
          <a href="/" className="nav-button">返回首页</a>
        </div>
      </div>
    </div>
  );
};

export default Test;
