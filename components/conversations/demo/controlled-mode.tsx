import React, { useState } from 'react';
import { Card, type GetProp, Flex, Button } from 'antd';
import { Conversations, type ConversationsProps } from '@ant-design/x';

const data: GetProp<ConversationsProps, 'data'> = Array.from({ length: 3 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
}));

const App = () => {
  const [activeKey, setActiveKey] = useState<string>('item1');

  return (
    <Flex vertical gap="small" align="flex-start">
      <Card style={{ width: 320 }} size="small">
        <Conversations activeKey={activeKey} onActiveChange={(v) => setActiveKey(v)} data={data} />
      </Card>

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
