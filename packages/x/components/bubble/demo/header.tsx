import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Flex } from 'antd';
import React from 'react';

const App = () => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="左对齐 header"
          components={{
            header: 'header',
            avatar: <Avatar icon={<UserOutlined />} />,
          }}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="右对齐 header"
          placement="end"
          components={{
            header: 'header',
            avatar: <Avatar icon={<UserOutlined />} />,
          }}
        />
      </div>
    </Flex>
  </Flex>
);

export default App;
