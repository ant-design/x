import { Tag } from 'antd';
import React from 'react';
import CodeHighlighter from '../index';

const App: React.FC = () => {
  const code = `const greeting = "Hello, World!";
console.log(greeting);`;

  const customHeader = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: '#f0f0f0',
        borderRadius: '6px 6px 0 0',
      }}
    >
      <div>
        <Tag color="blue">JavaScript</Tag>
        <span style={{ marginLeft: 8 }}>Example Code</span>
      </div>
      <span style={{ fontSize: 12, color: '#666' }}>2 lines</span>
    </div>
  );

  return (
    <div>
      <h3>Custom Header Example</h3>
      <CodeHighlighter lang="javascript" header={customHeader}>
        {code}
      </CodeHighlighter>
    </div>
  );
};

export default App;
