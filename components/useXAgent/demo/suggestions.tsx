import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender, useXAgent } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import React from 'react';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (content) => (
      <Prompts
        vertical
        items={(content as any as string[]).map((text) => ({
          key: text,
          icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
          description: text,
        }))}
      />
    ),
  },
};

type Message = {
  role: 'ai' | 'user' | 'suggestion';
  content: string | string[];
};

const App = () => {
  const [content, setContent] = React.useState('');

  const { onRequest, messages, requesting } = useXAgent<Message>({
    request: async (info) => {
      const content = info.content as string;

      await sleep();

      const result: Message[] = [
        {
          role: 'ai',
          content: `Do you want?`,
        },
        {
          role: 'suggestion',
          content: [`Look at: ${content}`, `Search: ${content}`, `Try: ${content}`],
        },
      ];

      return result;
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
