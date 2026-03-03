import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { theme } from 'antd';

const content = `# Hello XMarkdown

> Streaming-friendly, extensible Markdown renderer for LLM output.

## Features

- **Streaming** – syntax recovery and progressive rendering
- **Extensible** – map any node to your React components (\`components\`)
- **Plugins** – Latex, code highlighting, Mermaid, etc.

Inline code: \`npm install @ant-design/x-markdown\`. See [docs](/x-markdowns/introduce) for more.
`;

const App: React.FC = () => {
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';

  return <XMarkdown content={content} className={className} />;
};

export default App;
