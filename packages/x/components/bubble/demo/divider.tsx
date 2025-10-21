import { Bubble } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => (
  <Flex gap={16} vertical>
    <Bubble content="message 1" />
    <Bubble.Divider content="Solid" />
    <Bubble content="message 2" placement="end" />
    <Bubble.Divider content="Dashed" dividerProps={{ variant: 'dashed' }} />
    <Bubble content="message 3" />
    <Bubble.Divider content="Dotted" dividerProps={{ variant: 'dotted' }} />
    <Bubble content="message 4" placement="end" />
    <Bubble.Divider content="Plain Text" dividerProps={{ plain: true }} />
    <Bubble content="message 5" />
  </Flex>
);

export default App;
