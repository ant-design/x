import { CodeHighlighter } from '@ant-design/x';
import React from 'react';

const App: React.FC = () => {
  const code = `function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

const result = fibonacci(10);
console.log(result); // 55`;

  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>Show Line Number</h3>
      <CodeHighlighter lang="javascript" showLineNumbers>
        {code}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>Wrap Long Lines</h3>
      <CodeHighlighter lang="javascript" wrapLongLines>
        {`const config = { apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", endpoint: "https://api.example.com/v1/chat/completions", model: "gpt-4" };`}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>Hide Copy Button</h3>
      <CodeHighlighter lang="javascript" showCopyButton={false}>
        {code}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>All Combined</h3>
      <CodeHighlighter lang="javascript" showLineNumbers wrapLongLines showCopyButton={false}>
        {code}
      </CodeHighlighter>
    </div>
  );
};

export default App;