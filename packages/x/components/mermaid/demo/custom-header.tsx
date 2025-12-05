import { Button, Space } from 'antd';
import React from 'react';
import Mermaid from '../Mermaid';

const App: React.FC = () => {
  const header = (
    <Space>
      <span>流程图示例</span>
      <Button type="primary" size="small">
        导出
      </Button>
      <Button size="small">重置</Button>
    </Space>
  );
  return (
    <Mermaid header={header}>
      {`flowchart LR
    A[用户登录] --> B{验证身份}
    B -->|成功| C[进入系统]
    B -->|失败| D[显示错误]
    C --> E[主界面]
    D --> A`}
    </Mermaid>
  );
};
export default App;
