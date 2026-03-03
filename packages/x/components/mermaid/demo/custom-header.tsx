import { Mermaid } from '@ant-design/x';
import { Button, Space } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const header = (
    <div
      style={{
        padding: '12px 16px',
        border: '1px solid #f0f0f0',
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        backgroundColor: '#fafafa',
      }}
    >
      <Space size="middle">
        <span style={{ fontWeight: 500, color: '#1a1a1a' }}>Login Flow</span>
        <Button type="primary" size="small">
          Export
        </Button>
        <Button size="small">Reset</Button>
      </Space>
    </div>
  );
  return (
    <div style={{ padding: 24 }}>
      <Mermaid header={header}>
        {`flowchart LR
    A[User Login] --> B{Validate}
    B -->|Success| C[System Entry]
    B -->|Failed| D[Error Message]
    C --> E[Dashboard]
    D --> A`}
      </Mermaid>
    </div>
  );
};
export default App;
