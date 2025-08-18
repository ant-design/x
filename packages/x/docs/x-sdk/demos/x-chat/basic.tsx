import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { BubbleListProps } from '@ant-design/x/es/bubble';
import { DefaultChatProvider, useXChat, XRequest, XRequestOptions } from '@ant-design/x-sdk';
import { Avatar, Flex } from 'antd';
import React from 'react';

interface ChatInput {
  query: string;
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const role: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
    components: {
      avatar: <Avatar icon={<UserOutlined />} />,
    },
    typing: true,
    style: {
      maxWidth: 600,
    },
  },
  local: {
    placement: 'end',
    components: {
      avatar: <Avatar icon={<UserOutlined />} style={{ background: '#87d068' }} />,
    },
    contentRender(content: any) {
      return content?.query;
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
        role={role}
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
