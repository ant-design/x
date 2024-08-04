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
          const placement = i % 2 ? 'start' : 'end';

          return {
            placement,
            content: 'Mock bubble content!',
            avatar: { icon: <UserOutlined /> },
            typing: true,
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
