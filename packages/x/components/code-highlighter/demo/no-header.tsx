import React from 'react';
import CodeHighlighter from '../index';

const App: React.FC = () => {
  const code = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55`;

  return (
    <div>
      <h3>No Header Example</h3>
      <p>When header is set to null, the header section will not be displayed.</p>
      <CodeHighlighter lang="javascript" header={null}>
        {code}
      </CodeHighlighter>
    </div>
  );
};

export default App;
