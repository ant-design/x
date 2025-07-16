import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { GetProp, GetRef } from 'antd';
import { Flex } from 'antd';
import React, { useRef } from 'react';

const rolesAsObject: GetProp<typeof Bubble.List, 'roles'> = {
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
  const count = useRef(30);
  const [scrollTop, setScrollTop] = React.useState(0);
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  return (
    <Flex vertical gap="small">
      <Flex>
        <div>scrollTop: {scrollTop}</div>
      </Flex>
      <Bubble.List
        onScroll={onScroll}
        ref={listRef}
        style={{ maxHeight: 300, paddingInline: 16 }}
        roles={rolesAsObject}
        items={Array.from({ length: count.current }).map((_, i) => {
          const isAI = !!(i % 2);
          const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.';

          return { key: i, role: isAI ? 'ai' : 'user', content };
        })}
      />
    </Flex>
  );
};

export default App;
