import { Think } from '@ant-design/x';
import { Button } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [value, setValue] = useState(true);
  return (
    <>
      <div>
        <Button onClick={() => setValue(!value)}>Change expand</Button>
      </div>
      <br />
      <Think
        statusText={'deep thinking'}
        expanded={value}
        onExpand={(value) => {
          setValue(value);
        }}
      >
        This is deep thinking content.
      </Think>
    </>
  );
};

export default App;
