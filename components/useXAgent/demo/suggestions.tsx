import React from 'react';
import { Bubble, Sender, useXAgent } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const App = () => {
  const [content, setContent] = React.useState('');

  const { onRequest, messages, requesting } = useXAgent<{
    role: 'ai' | 'user';
    content: string;
  }>({
    request: async ({ content }) => {
      await sleep();

      return [
        {
          role: 'ai',
          content: `You said: ${content}`,
        },
      ];
    },
    requestPlaceholder: {
      role: 'ai',
      content: 'Waiting...',
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
