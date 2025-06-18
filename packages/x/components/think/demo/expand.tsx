import { Think } from '@ant-design/x';
import { Button } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [value, setValue] = useState(true);
  return (
    <>
      <Button onClick={() => setValue(!value)}>Change expand</Button>
      <Think
        content={'This is deep thinking content.'}
        statusText={'deep thinking'}
        expand={value}
        onExpandChange={(value) => {
          setValue(value);
        }}
      />
    </>
  );
};

export default App;
