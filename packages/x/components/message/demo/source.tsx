import { Message } from '@ant-design/x';
import React from 'react';

const App = () => {
  return (
    <>
      <Message
        type="source"
        title={'Based on 15 search sources as references'}
        items={[
          {
            label: '1. Source 1',
            src: '#',
          },
          {
            label: '2. Source 2',
            src: '#',
          },
        ]}
      />
      <br />
      <Message
        type="source"
        title={'Based on 15 search sources as references'}
        content={
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="#">1. Source 1</a>
            <a href="#">2. Source 2</a>
          </div>
        }
      />
    </>
  );
};

export default App;
