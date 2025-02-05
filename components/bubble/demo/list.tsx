import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Button, Flex, Switch } from 'antd';
import type { GetProp, GetRef } from 'antd';
import React from 'react';

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

const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
  const RenderIndex: BubbleProps['messageRender'] = (content) => (
    <Flex>
      #{index}: {content}
    </Flex>
  );
  switch (bubbleData.role) {
    case 'ai':
      return {
        placement: 'start' as const,
        avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
        typing: { step: 5, interval: 20 },
        style: {
          maxWidth: 600,
        },
        messageRender: RenderIndex,
      };
    case 'user':
      return {
        placement: 'end' as const,
        avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
        messageRender: RenderIndex,
      };
    default:
      return {
        messageRender: RenderIndex,
      };
  }
};

const App = () => {
  const [count, setCount] = React.useState(3);
  const [useRolesAsFunction, setUseRolesAsFunction] = React.useState(false);
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);

  return (
    <Flex vertical gap="small">
      <Flex gap="small" justify="space-between">
        <Flex gap="large" align="center">
          Use roles as:
          <Switch
            checked={useRolesAsFunction}
            onChange={(checked) => setUseRolesAsFunction(checked)}
            checkedChildren="Function"
            unCheckedChildren="Object"
          />
        </Flex>

        <Flex gap="small">
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
      </Flex>

      <Bubble.List
        ref={listRef}
        style={{ maxHeight: 300 }}
        roles={useRolesAsFunction ? rolesAsFunction : rolesAsObject}
        items={Array.from({ length: count }).map((_, i) => {
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
