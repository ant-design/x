import { useXAgent } from '@ant-design/x';
import React from 'react';

const App = () => {
  useXAgent({
    baseURL: 'https://mocks-server.ant.design',
    key: 'x-agent-demo',
    model: 'todo',
  });

  return <div>Wait for XFetch & XStream</div>;
};

export default App;
