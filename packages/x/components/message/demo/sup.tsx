import { Bubble, Message } from '@ant-design/x';
import React from 'react';

const App = () => {
  const message1 = (
    <div style={{ display: 'flex' }}>
      use in message
      <Message type="sup" content={'1'} popoverTitle="Title" popoverContent={'Content'} />
    </div>
  );

  return (
    <>
      <Bubble variant="outlined" content={message1} />
    </>
  );
};

export default App;
