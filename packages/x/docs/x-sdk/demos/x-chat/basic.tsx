import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { DefaultChatProvider, useXChat, XRequest, XRequestOptions } from '@ant-design/x-sdk';
import { Flex, type GetProp } from 'antd';
import React from 'react';

interface ChatInput {
  query: string;
}

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
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
    messageRender(content) {
      return content.query;
    },
  },
};

const App = () => {
  const [content, setContent] = React.useState('');
  const [provider] = React.useState(
    new DefaultChatProvider<string, ChatInput, string>({
      request: XRequest('https://api.example.com/chat', {
        manual: true,
        fetch: async (
          _: Parameters<typeof fetch>[0],
          options: XRequestOptions<ChatInput, string>,
        ) => {
          await sleep();
          const params = options?.params;
          return Promise.resolve(
            new Response(JSON.stringify([`Mock success return. You said: ${params?.query}`]), {
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        },
      }),
    }),
  );

  // Chat messages
  const { onRequest, messages, isRequesting } = useXChat({
    provider,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ maxHeight: 300 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          role: status === 'local' ? 'local' : 'ai',
          content: message,
        }))}
      />
      <Sender
        loading={isRequesting()}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest({
            query: nextContent,
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
