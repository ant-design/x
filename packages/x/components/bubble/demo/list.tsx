import {
  AntDesignOutlined,
  CopyOutlined,
  LinkOutlined,
  RedoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Actions, Bubble } from '@ant-design/x';
import type { BubbleData, BubbleListProps } from '@ant-design/x/es/bubble';
import XMarkdown from '@ant-design/x-markdown';
import type { GetRef } from 'antd';
import { Avatar, Button, Divider, Flex, Typography } from 'antd';
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

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

function useBubbleList(initialItems: BubbleData[] = []) {
  const [items, setItems] = React.useState<BubbleData[]>(initialItems);

  const appendItem = useCallback((item: BubbleData) => {
    setItems((prev) => [...prev, item]);
  }, []);

  return [items, setItems, appendItem] as const;
}

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, setItems, appendItem] = useBubbleList();

  useEffect(() => {
    setItems([
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
      divider: {
        variant: 'borderless',
        styles: { root: { margin: 0 }, body: { width: '100%' } },
        contentRender: (content) => <Divider>{content as string}</Divider>,
      },
      reference: {
        variant: 'borderless',
        // 16px for list item gap
        styles: { root: { margin: 0, marginBottom: -16 } },
        contentRender: (content) => (
          <Typography.Text style={{ textAlign: 'right' }}>
            <LinkOutlined />{' '}
            <Button type="link" style={{ padding: 0 }}>
              {content as string}
            </Button>
          </Typography.Text>
        ),
      },
    }),
    [],
  );

  return (
    <Flex vertical gap="small">
      <Flex gap="small" justify="space-between">
        <Flex gap="small">
          <Button
            type="primary"
            onClick={() => {
              const chatItems = items.filter((item) => item.role === 'ai' || item.role === 'user');
              const isAI = !!(chatItems.length % 2);
              appendItem(genItem(isAI, { typing: { effect: 'fade-in', step: [30, 50] } }));
            }}
          >
            Add Bubble
          </Button>
          <Button
            onClick={() => {
              appendItem({
                key: getKey(),
                role: 'ai',
                typing: { effect: 'fade-in', step: [30, 50] },
                content: text,
                contentRender: (content) => (
                  <Typography>
                    <XMarkdown content={content as string} />
                  </Typography>
                ),
              });
            }}
          >
            Add Markdown Msg
          </Button>
          <Button
            onClick={() => {
              setItems([...items, { key: getKey(), role: 'divider', content: 'Divider' }]);
            }}
          >
            Add Divider
          </Button>
          <Button
            onClick={() => {
              setItems((pre) => [genItem(false), genItem(true), genItem(false), ...pre]);
            }}
          >
            Add To Pre
          </Button>
          <Button
            onClick={() => {
              setItems((pre) => [
                ...pre,
                { key: getKey(), role: 'reference', placement: 'end', content: 'Ant Design X' },
                genItem(false),
              ]);
            }}
          >
            Add With Ref
          </Button>

          <Button
            onClick={() => {
              listRef.current?.scrollTo({ key: items[1].key, block: 'nearest' });
            }}
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
          console.log('scroll', (e.target as any).scrollTop);
        }}
      />
    </Flex>
  );
};

export default App;
