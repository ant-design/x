import { Bubble, Message } from '@ant-design/x';
import React from 'react';

const App = () => {
  return (
    <>
      <Bubble content={<Message content="hello world !" />} />
    </>
  );
};

export default App;
