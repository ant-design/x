import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';
import { Actions, Bubble } from '@ant-design/x';
import { Avatar, Flex } from 'antd';
import React from 'react';

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

const App = () => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="外气泡尾外气泡尾"
          components={{
            header: 'footer',
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (content) => (
              <Actions items={actionItems} onClick={() => console.log(content)} />
            ),
          }}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="内气泡尾内气泡尾"
          placement="end"
          footerPlacement="inner-end"
          components={{
            header: 'footer',
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (content) => (
              <Actions items={actionItems} onClick={() => console.log(content)} />
            ),
          }}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="外气泡尾外气泡尾-右对齐"
          footerPlacement="outer-end"
          components={{
            header: 'footer',
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (content) => (
              <Actions items={actionItems} onClick={() => console.log(content)} />
            ),
          }}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="内气泡尾内气泡尾-左对齐"
          placement="end"
          footerPlacement="inner-start"
          components={{
            header: 'footer',
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (content) => (
              <Actions items={actionItems} onClick={() => console.log(content)} />
            ),
          }}
        />
      </div>
    </Flex>
  </Flex>
);

export default App;
