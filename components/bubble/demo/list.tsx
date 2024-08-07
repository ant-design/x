import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex } from 'antd';
import type { GetProp, GetRef } from 'antd';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const App = () => {
  const [count, setCount] = React.useState(3);
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);

  return (
    <Flex vertical gap="small">
      <Flex gap="small" style={{ alignSelf: 'flex-end' }}>
        <Button
          onClick={() => {
            setCount((i) => i + 1);
          }}
        >
          Add Bubble
        </Button>

        <Button
          onClick={() => {
            listRef.current?.scrollTo({ key: 0, block: 'nearest' });
          }}
        >
          Scroll To First
        </Button>
      </Flex>

      <Bubble.List
        ref={listRef}
        style={{ maxHeight: 300 }}
        roles={roles}
        data={Array.from({ length: count }).map((_, i) => {
          const isAI = !!(i % 2);
          const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.';

          return {
            key: i,
            role: isAI ? 'ai' : 'user',
            content,
          };
        })}
      />
    </Flex>
  );
};

export default App;
