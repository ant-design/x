import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Button, Flex, type GetProp, theme } from 'antd';
import React, { useState } from 'react';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 3 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
}));

const App = () => {
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
        onActiveChange={(v) => setActiveKey(v)}
        items={items}
        style={style}
      />

      <Flex gap="small">
        <Button
          onClick={() => {
            setActiveKey('item1');
          }}
        >
          Active First
        </Button>
        <Button
          onClick={() => {
            setActiveKey('item3');
          }}
        >
          Active Last
        </Button>
      </Flex>
    </Flex>
  );
};

export default App;
