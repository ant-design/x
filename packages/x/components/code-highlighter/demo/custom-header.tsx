import { CodeHighlighter } from '@ant-design/x';
import { Button, Space } from 'antd';
import React from 'react';

const App = () => {
  const code = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}`;

  const customHeader = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: '#f5f5f5',
        borderBottom: '1px solid #d9d9d9',
      }}
    >
      <Space>
        <span style={{ fontWeight: 500 }}>React 计数器示例</span>
        <span
          style={{
            padding: '2px 8px',
            background: '#e6f7ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#1890ff',
          }}
        >
          JavaScript
        </span>
      </Space>
      <Space>
        <Button size="small" type="text">
          运行
        </Button>
        <Button size="small" type="text">
          分享
        </Button>
      </Space>
    </div>
  );

  return (
    <CodeHighlighter lang="javascript" header={customHeader}>
      {code}
    </CodeHighlighter>
  );
};

export default App;
