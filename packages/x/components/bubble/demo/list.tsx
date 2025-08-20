import {
  AntDesignOutlined,
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
  RedoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Actions, Bubble, FileCard, FileCardProps } from '@ant-design/x';
import type { BubbleData, BubbleListProps } from '@ant-design/x/es/bubble';
import XMarkdown from '@ant-design/x-markdown';
import type { GetRef } from 'antd';
import { Avatar, Button, Divider, Flex, Space, Typography } from 'antd';
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

const genItem = (isAI: boolean, config?: Partial<BubbleData>): BubbleData => {
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

  const add = useCallback((item: BubbleData) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback(
    (key: string | number, data: Omit<Partial<BubbleData>, 'key' | 'role'>) => {
      setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...data } : item)));
    },
    [],
  );

  return [items, setItems, add, update] as const;
}

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, set, add, update] = useBubbleList();

  useEffect(() => {
    set([
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
      user: (data) => ({
        placement: 'end',
        typing: false,
        components: {
          header: `User-${data.key}`,
          avatar: () => <Avatar icon={<UserOutlined />} />,
          footer: () => (
            <Actions
              items={[
                data.editable
                  ? { key: 'done', icon: <CheckOutlined />, label: 'done' }
                  : {
                      key: 'edit',
                      icon: <EditOutlined />,
                      label: 'edit',
                    },
              ]}
              onClick={({ key }) => update(data.key, { editable: key === 'edit' })}
            />
          ),
        },
        onEditConfirm: (content) => {
          console.log(`editing User-${data.key}: `, content);
          update(data.key, { content, editable: false });
        },
        onEditCancel: () => {
          update(data.key, { editable: false });
        },
      }),
      divider: {
        variant: 'borderless',
        styles: { root: { margin: 0 }, body: { width: '100%' } },
        contentRender: (content: string) => <Divider>{content}</Divider>,
      },
      reference: {
        variant: 'borderless',
        // 16px for list item gap
        styles: { root: { margin: 0, marginBottom: -12 } },
        components: { avatar: () => '' },
        contentRender: (content: FileCardProps) => (
          <Space>
            <LinkOutlined />
            <FileCard type="file" size="small" name={content.name} byte={content.byte} />
          </Space>
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
              add(genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } }));
            }}
          >
            Add Bubble
          </Button>
          <Button
            onClick={() => {
              add({
                key: getKey(),
                role: 'ai',
                typing: { effect: 'fade-in', step: 6 },
                content: text,
                contentRender: (content: string) => (
                  <Typography>
                    <XMarkdown content={content} />
                  </Typography>
                ),
              });
            }}
          >
            Add Markdown Msg
          </Button>
          <Button
            onClick={() => {
              set([...items, { key: getKey(), role: 'divider', content: 'Divider' }]);
            }}
          >
            Add Divider
          </Button>
          <Button
            onClick={() => {
              set((pre) => [genItem(false), genItem(true), genItem(false), ...pre]);
            }}
          >
            Add To Pre
          </Button>
          <Button
            onClick={() => {
              set((pre) => [
                ...pre,
                {
                  key: getKey(),
                  role: 'reference',
                  placement: 'end',
                  content: { name: 'Ant-Design-X.pdf' },
                },
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
