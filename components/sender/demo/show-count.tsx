import React from 'react';
import { Flex } from 'antd';
import { Sender } from '@ant-design/x';

const App: React.FC = () => (
  <Flex vertical gap={32}>
    <Sender
      showCount
      maxLength={100}
      placeholder="disable resize"
      style={{ height: 120, resize: 'none' }}
    />
  </Flex>
);

export default App;
