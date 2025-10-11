import { Bubble } from '@ant-design/x';
import { Flex, Typography } from 'antd';
import React from 'react';

const text = `Hello, this is a system message`;

const App = () => (
  <Flex gap={16} vertical>
    <Bubble.System content={text} />
    <Bubble.System
      variant="outlined"
      shape="round"
      content={text}
      extra={<Typography.Link>ok</Typography.Link>}
    />
    <Bubble.System
      variant="borderless"
      content={text}
      extra={<Typography.Link>cancel</Typography.Link>}
    />
  </Flex>
);

export default App;
