import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex } from 'antd';

const App = () => {
  const [count, setCount] = React.useState(3);

  return (
    <Flex vertical gap="small">
      <Bubble.List
        style={{ maxHeight: 300 }}
        data={Array.from({ length: count }).map((_, i) => {
          const isStart = !!(i % 2);
          const placement = isStart ? 'start' : 'end';
          const content = isStart ? 'Mock response content. '.repeat(10) : 'Mock request content.';

          return {
            placement,
            content,
            avatar: { icon: <UserOutlined /> },
            typing: {
              step: 5,
            },
          };
        })}
      />

      <Button
        style={{ alignSelf: 'flex-end' }}
        onClick={() => {
          setCount((i) => i + 1);
        }}
      >
        Add Bubble
      </Button>
    </Flex>
  );
};

export default App;
