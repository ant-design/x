import { Sources } from '@ant-design/x';
import { Button } from 'antd';
import React, { useState } from 'react';

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
  const [value, setValue] = useState(true);
  return (
    <>
      <Button onClick={() => setValue(!value)} style={{ marginBottom: '8px' }}>
        Change expand
      </Button>
      <br />
      <Sources
        title={'Used 3 sources'}
        items={items}
        expanded={value}
        onExpand={(value) => {
          setValue(value);
        }}
      />
    </>
  );
};

export default App;
