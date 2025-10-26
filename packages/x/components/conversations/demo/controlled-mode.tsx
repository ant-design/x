import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations, type ConversationsProps } from '@ant-design/x';
import type { GetProp } from 'antd';
import { Button, Flex, theme } from 'antd';
import React, { useState } from 'react';

const items: GetProp<ConversationsProps, 'items'> = [
  {
    key: 'write',
    label: 'Help Me Write',
    icon: <SignatureOutlined />,
  },
  {
    key: 'coding',
    label: 'AI Coding',
    icon: <CodeOutlined />,
  },
  {
    key: 'createImage',
    label: 'Create Image',
    icon: <FileImageOutlined />,
  },
  {
    key: 'deepSearch',
    label: 'Deep Search',
    icon: <FileSearchOutlined />,
  },
];

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('item1');

  const { token } = theme.useToken();

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  return (
    <Flex vertical gap="small" align="flex-start">
      <Conversations
        activeKey={activeKey}
        onActiveChange={(v) => {
          setActiveKey(v);
        }}
        items={items}
        style={style}
      />

      <Flex gap="small">
        <Button
          onClick={() => {
            setActiveKey('write');
          }}
        >
          Active First
        </Button>
        <Button
          onClick={() => {
            setActiveKey('deepSearch');
          }}
        >
          Active Last
        </Button>
      </Flex>
    </Flex>
  );
};

export default App;
