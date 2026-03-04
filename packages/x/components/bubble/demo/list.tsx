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
import { Avatar, Button, Flex, Space, Switch, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

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

function useBubbleList(initialItems: BubbleItemType[] = []) {
  const [items, setItems] = React.useState<BubbleItemType[]>(initialItems);

  const add = useCallback((item: BubbleItemType) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback(
    (key: string | number, data: Omit<Partial<BubbleItemType>, 'key' | 'role'>) => {
      setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...data } : item)));
    },
    [],
  );

  return [items, setItems, add, update] as const;
}

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [items, set, add, update] = useBubbleList();
  const [enableLocScroll, setEnableLocScroll] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    set([
      { key: getKey(), role: 'system', content: 'Welcome to use Ant Design X' },
      genItem(false, { typing: false }),
      genItem(true, { typing: false }),
      { key: getKey(), role: 'divider', content: 'divider' },
      genItem(false, { typing: false }),
      genItem(true, { typing: false, loading: true }),
    ]);
  }, []);

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
        onEditConfirm: (content) => {
          console.log(`editing User-${data.key}: `, content);
          update(data.key, { content, editable: false });
        },
        onEditCancel: () => {
          update(data.key, { editable: false });
        },
      }),
      reference: {
        variant: 'borderless',
        // 16px for list item gap
        styles: { root: { margin: 0, marginBottom: -12 } },
        avatar: () => '',
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

  const scrollTo: GetRef<typeof Bubble.List>['scrollTo'] = (option) => {
    // 需要等待 Bubble 成功添加后再执行定位跳转，才能到达符合预期的位置
    // setTimeout(() =>
    listRef.current?.scrollTo({ ...option, behavior: 'smooth' });
    // );
  };

  return (
    <Flex vertical style={{ height: 720 }} gap={20}>
      <Flex vertical gap="small">
        <Space align="center">
          <Switch value={autoScroll} onChange={(v) => setAutoScroll(v)} />
          <span>启用 autoScroll / enabled autoScroll</span>
        </Space>
        <Space align="center">
          <Switch value={enableLocScroll} onChange={(v) => setEnableLocScroll(v)} />
          <span>定位到新气泡 / locate to new bubble</span>
        </Space>
      </Flex>
      <Flex gap="small" wrap>
        <Button
          type="primary"
          onClick={() => {
            const chatItems = items.filter((item) => item.role === 'ai' || item.role === 'user');
            const isAI = !!(chatItems.length % 2);
            add(genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } }));
            if (enableLocScroll) {
              scrollTo({ top: 'bottom' });
            }
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
            if (enableLocScroll) {
              scrollTo({ top: 'bottom' });
            }
          }}
        >
          Add Markdown
        </Button>
        <Button
          onClick={() => {
            set([...items, { key: getKey(), role: 'divider', content: 'Divider' }]);
            if (enableLocScroll) {
              scrollTo({ top: 'bottom' });
            }
          }}
        >
          Add Divider
        </Button>
        <Button
          onClick={() => {
            set([...items, { key: getKey(), role: 'system', content: 'This is a system message' }]);
            if (enableLocScroll) {
              scrollTo({ top: 'bottom' });
            }
          }}
        >
          Add System
        </Button>
        <Button
          onClick={() => {
            const item = genItem(false);
            set((pre) => [item, genItem(true), genItem(false), ...pre]);
            if (enableLocScroll) {
              scrollTo({ top: 'top' });
            }
          }}
        >
          Add To Top
        </Button>
        <Button
          onClick={() => {
            set((pre) => [
              ...pre,
              // use a bubble to mock reference
              {
                key: getKey(),
                role: 'reference',
                placement: 'end',
                content: { name: 'Ant-Design-X.pdf' },
              },
              // message bubble
              genItem(false),
            ]);
            if (enableLocScroll) {
              scrollTo({ top: 'bottom' });
            }
          }}
        >
          Add With Ref
        </Button>
      </Flex>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Bubble.List
          style={{ height: 620 }}
          ref={listRef}
          role={memoRole}
          items={items}
          autoScroll={autoScroll}
        />
      </div>
    </Flex>
  );
};

export default App;
