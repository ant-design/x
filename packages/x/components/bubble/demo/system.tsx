import { Bubble } from '@ant-design/x';
import { Flex, Space, Typography } from 'antd';
import React from 'react';

const text = `Hello, this is a system message`;

const App = () => (
  <Flex gap={16} vertical>
    <Bubble.System content={text} />
    <Bubble.System
      variant="outlined"
      shape="round"
      content={
        <Space>
          {text}
          <Typography.Link>ok</Typography.Link>
        </Space>
      }
    />
    <Bubble.System
      variant="borderless"
      content={
        <Space>
          {text}
          <Typography.Link>cancel</Typography.Link>
        </Space>
      }
    />
  </Flex>
);

export default App;
