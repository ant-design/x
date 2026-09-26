import { CodeHighlighter } from '@ant-design/x';
import React from 'react';

const App: React.FC = () => {
  const code = `import React from 'react';
import { Button } from 'antd';

const App = () => (
  <div>
    <Button type="primary">Primary Button</Button>
  </div>
);

export default App;`;

  const longLineCode = `const aVeryLongVariableName = someFunction(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
console.log(aVeryLongVariableName);`;

  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>显示行号</h3>
      <p style={{ marginBottom: 8, color: '#666' }}>
        通过 <code>showLineNumber</code> 显示代码行号。
      </p>
      <CodeHighlighter lang="javascript" showLineNumber>
        {code}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>自动换行</h3>
      <p style={{ marginBottom: 8, color: '#666' }}>
        通过 <code>wrapLongLines</code> 让超长行自动换行，无需横向滚动。
      </p>
      <CodeHighlighter lang="javascript" wrapLongLines>
        {longLineCode}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>隐藏复制按钮</h3>
      <p style={{ marginBottom: 8, color: '#666' }}>
        通过 <code>showCopyButton={'{false}'}</code> 隐藏默认 Header 中的复制按钮。
      </p>
      <CodeHighlighter lang="javascript" showCopyButton={false}>
        {code}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>组合使用</h3>
      <CodeHighlighter lang="javascript" showLineNumber wrapLongLines showCopyButton={false}>
        {longLineCode}
      </CodeHighlighter>
    </div>
  );
};

export default App;
