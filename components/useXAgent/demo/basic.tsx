import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXChat } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import React from 'react';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

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

let mockSuccess = false;

const App = () => {
  const [content, setContent] = React.useState('');

  const { onRequest, messages, requesting } = useXChat<{
    role: 'ai' | 'user';
    content: string;
  }>({
    request: async ({ content }) => {
      await sleep();

      mockSuccess = !mockSuccess;

      if (!mockSuccess) {
        throw new Error('Mock request failed');
      }

      return {
        role: 'ai',
        content: `Mock success. You said: ${content}`,
      };
    },
    requestPlaceholder: {
      role: 'ai',
      content: 'Waiting...',
    },
    requestFallback: {
      role: 'ai',
      content: 'Mock failed. Please try again later.',
    },
  });

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ height: 300 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          ...message,
        }))}
      />
      <Sender
        loading={requesting}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest({
            role: 'user',
            content: nextContent,
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
