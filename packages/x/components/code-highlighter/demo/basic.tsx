import React from 'react';
import CodeHighlighter from '../index';

const App: React.FC = () => {
  const code = `import React from 'react';
import { Button } from 'antd';

const App = () => (
  <div>
    <Button type="primary">Primary Button</Button>
  </div>
);

export default App;`;

  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>JavaScript Code</h3>
      <CodeHighlighter lang="javascript">{code}</CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>CSS Code</h3>
      <CodeHighlighter lang="css">
        {`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>HTML Code</h3>
      <CodeHighlighter lang="html">
        {`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`}
      </CodeHighlighter>
    </div>
  );
};

export default App;
