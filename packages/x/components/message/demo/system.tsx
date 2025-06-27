import { Message } from '@ant-design/x';
import React from 'react';

const App = () => {
  return (
    <>
      <Message type="system" content={'16:03:00'} />
      <Message type="system" content={'16:03:00'} divider={false} />
      <Message type="system" content={'16:03:00'} divider={'double'} />
      <Message type="system" content={'16:03:00'} divider={'dashed'} />
    </>
  );
};

export default App;
