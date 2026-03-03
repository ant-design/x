import { Sources } from '@ant-design/x';
import React from 'react';

const App = () => {
  const items = [
    {
      title: '1. Data source',
      key: '1',
      url: 'https://x.ant.design/components/overview',
      description:
        'Artificial Intelligence, often abbreviated as AI, is a broad branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence.',
    },
    {
      title: '2. Data source',
      key: '2',
      url: 'https://x.ant.design/components/overview',
    },
    {
      title: '3. Data source',
      key: '3',
      url: 'https://x.ant.design/components/overview',
    },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>Use the inline mode in the text</span>
      <Sources title={'1'} activeKey="1" items={items} inline={true} />
      <span>Use the inline mode in the text</span>
      <Sources title={'2'} activeKey="2" items={items} inline={true} />
    </div>
  );
};

export default App;
