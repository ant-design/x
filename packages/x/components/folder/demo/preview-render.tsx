import { Folder } from '@ant-design/x';
import { Card, Tag } from 'antd';
import React from 'react';

const treeData = [
  {
    title: 'src',
    path: 'src',
    children: [
      { title: 'index.js', path: 'index.js', content: 'console.log("Hello");' },
      { title: 'App.tsx', path: 'App.tsx', content: 'const App = () => <div>App</div>;' },
    ],
  },
  { title: 'package.json', path: 'package.json', content: '{"name": "demo"}' },
];

const App: React.FC = () => {
  // Function form with new API including originNode
  const customPreview = (
    {
      content,
      path,
      title,
      language,
    }: {
      content?: string;
      path: string[];
      title?: React.ReactNode;
      language: string;
    },
    { originNode }: { originNode: React.ReactNode },
  ) => (
    <Card title={title} extra={<Tag>{language}</Tag>}>
      <div>Path: {path.join('/')}</div>
      <pre>{content}</pre>
      <div style={{ marginTop: 16 }}>
        <strong>Original preview:</strong>
        {originNode}
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ height: 300, border: '1px solid #f0f0f0', marginBottom: 24 }}>
        <Folder treeData={treeData} previewRender={customPreview} />
      </div>
    </div>
  );
};

export default App;
