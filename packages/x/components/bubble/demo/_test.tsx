import {
  AntDesignOutlined,
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
  RedoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { BubbleItemType, BubbleListProps } from '@ant-design/x';
import { Actions, Bubble, FileCard, FileCardProps } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { GetRef } from 'antd';
import { Avatar, Button, Flex, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

const genItem = (isAI: boolean, config?: Partial<BubbleItemType>): BubbleItemType => {
  const key = getKey();
  return {
    key,
    role: isAI ? 'ai' : 'user',
    content: `${id} : ${isAI ? 'Mock AI content'.repeat(50) : 'Mock user content.'}`,
    ...config,
    // cache: true,
  };
};

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

function useBubbleList(initialItems: BubbleItemType[] = []) {
  const [items, setItems] = React.useState<BubbleItemType[]>(initialItems);

  const add = useCallback((item: BubbleItemType) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback(
    (
      key: string | number,
      data:
        | Omit<Partial<BubbleItemType>, 'key' | 'role'>
        | ((item: BubbleItemType) => Partial<BubbleItemType>),
    ) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.key !== key) return item;
          return { ...item, ...(typeof data === 'function' ? data(item) : data) };
        }),
      );
    },
    [],
  );

  return [items, setItems, add, update] as const;
}

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, set, add, update] = useBubbleList();
  const [autoScroll, setAutoScroll] = useState(true);

  const timer = useRef<any>(null);

  const memoRole: BubbleListProps['role'] = React.useMemo(
    () => ({
      ai: {
        typing: true,
        header: 'AI',
        avatar: () => <Avatar icon={<AntDesignOutlined />} />,
        footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />,
      },
      user: (data) => ({
        placement: 'end',
        typing: false,
        header: `User-${data.key}`,
        avatar: () => <Avatar icon={<UserOutlined />} />,
      }),
    }),
    [],
  );

  return (
    <Flex vertical style={{ height: 320 }} gap={20}>
      <Flex gap="small">
        <Button
          type="primary"
          onClick={() => {
            timer.current = setInterval(() => {
              set((items) => {
                const chatItems = items.filter(
                  (item) => item.role === 'ai' || item.role === 'user',
                );
                const isAI = !!(chatItems.length % 2);
                const item = genItem(isAI, { typing: { effect: 'fade-in', step: [30, 50] } });
                return [...items, item];
              });
            }, 1000);
          }}
        >
          start
        </Button>
        <Button
          onClick={() => {
            clearInterval(timer.current);
            timer.current = null;
          }}
        >
          stop
        </Button>
        <Button
          onClick={() => {
            clearInterval(timer.current);
            timer.current = null;
            set([]);
          }}
        >
          clear
        </Button>
        <Button
          onClick={() => {
            setAutoScroll(!autoScroll);
          }}
        >
          autoScroll
        </Button>
      </Flex>
      <Bubble.List ref={listRef} role={memoRole} items={items} autoScroll={autoScroll} />
    </Flex>
  );
};

export default App;
