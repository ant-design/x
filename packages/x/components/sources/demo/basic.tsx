import { Sources } from '@ant-design/x';
import React from 'react';

const App = () => {
  const items = [
    {
      title: '1. Data source',
      url: 'https://x.ant.design/components/overview',
    },
    {
      title: '2. Data source',
      url: 'https://x.ant.design/components/overview',
    },
    {
      title: '3. Data source',
      url: 'https://x.ant.design/components/overview',
    },
  ];

  return (
    <>
      <Sources title={'Used 3 sources'} items={items} />
    </>
  );
};

export default App;
