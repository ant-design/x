import { AntDesignOutlined, CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';
import type { BubbleData, BubbleListProps } from '@ant-design/x';
import { Actions, Bubble } from '@ant-design/x';
import type { GetRef } from 'antd';
import { Avatar, Button, Flex } from 'antd';
import React, { useCallback, useEffect } from 'react';

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

let id = 0;

const getKey = () => `bubble_${id++}`;

const genItem = (isAI: boolean, config?: Partial<BubbleData>) => {
  return {
    key: getKey(),
    role: isAI ? 'ai' : 'user',
    content: `${id} : ${isAI ? 'Mock AI content'.repeat(50) : 'Mock user content.'}`,
    ...config,
    // cache: true,
  };
};

function useBubbleList(initialItems: BubbleData[] = []) {
  const [items, setItems] = React.useState<BubbleData[]>(initialItems);

  const appendItem = useCallback((item: BubbleData) => {
    setItems((prev) => [...prev, item]);
  }, []);

  return [items, setItems, appendItem] as const;
}

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, setItems] = useBubbleList();

  useEffect(() => {
    setItems([
      genItem(false, { typing: false }),
      genItem(true, { typing: false }),
      genItem(false, { typing: false }),
      genItem(true, { typing: false }),
      genItem(false, { typing: false }),
      genItem(true, { typing: false }),
      genItem(false, { typing: false }),
      genItem(true, { typing: false }),
      genItem(false, { typing: false }),
      genItem(true, { typing: false }),
      genItem(false, { typing: false }),
    ]);
  }, []);

  const memoRole: BubbleListProps['role'] = React.useMemo(
    () => ({
      ai: {
        typing: true,
        components: {
          header: 'AI',
          avatar: () => <Avatar icon={<AntDesignOutlined />} />,
          footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />,
        },
      },
      user: {
        placement: 'end',
        typing: false,
        components: {
          header: 'User',
          avatar: () => <Avatar icon={<UserOutlined />} />,
        },
      },
    }),
    [],
  );

  return (
    <Flex vertical gap="small">
      <Flex gap="small" justify="space-between">
        <Flex gap="small">
          <Button type="primary" onClick={() => console.log(listRef.current?.nativeElement)}>
            Get Dom
          </Button>
          <Button onClick={() => listRef.current?.scrollTo({ top: 'top' })}>Scroll To Top</Button>
          <Button onClick={() => listRef.current?.scrollTo({ top: 'bottom', behavior: 'instant' })}>
            Scroll To Bottom
          </Button>
          <Button onClick={() => listRef.current?.scrollTo({ top: Math.random() * 1000 })}>
            Scroll To Ramdom
          </Button>
          <Button
            onClick={() => listRef.current?.scrollTo({ key: items[1].key, block: 'nearest' })}
          >
            Scroll To Second
          </Button>
        </Flex>
      </Flex>

      <Bubble.List
        ref={listRef}
        style={{ maxHeight: 300 }}
        role={memoRole}
        items={items}
        onScroll={(e) => {
          console.log('scroll', (e.target as HTMLDivElement).scrollTop);
        }}
      />
    </Flex>
  );
};

export default App;
