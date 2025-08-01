import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import React from 'react';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const roles: GetProp<typeof Bubble.List, 'role'> = {
  user: {
    placement: 'end',
    styles: { avatar: { background: '#87d068' } },
    components: {
      avatar: <UserOutlined />,
    },
  },
  text: {
    placement: 'start',
    styles: { avatar: { background: '#fde3cf' } },
    components: {
      avatar: <UserOutlined />,
    },
  },
  suggestion: {
    placement: 'start',
    styles: { avatar: { visibility: 'hidden' } },
    components: {
      avatar: <UserOutlined />,
    },
    variant: 'borderless',
    contentRender: (content) => (
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

type AgentUserMessage = {
  type: 'user';
  content: string;
};

type AgentAIMessage = {
  type: 'ai';
  content?: string;
  list?: (
    | {
        type: 'text';
        content: string;
      }
    | {
        type: 'suggestion';
        content: string[];
      }
  )[];
};

type AgentMessage = AgentUserMessage | AgentAIMessage;

const App = () => {
  const [content, setContent] = React.useState('');

  // Agent for request
  const [agent] = useXAgent<AgentMessage, { message: AgentMessage }, Record<string, any>>({
    request: async ({ message }, { onSuccess }) => {
      await sleep();
      const { content } = message || {};
      onSuccess([
        {
          type: 'ai',
          list: [
            {
              type: 'text',
              content: `Do you want?`,
            },
            {
              type: 'suggestion',
              content: [`Look at: ${content}`, `Search: ${content}`, `Try: ${content}`],
            },
          ],
        },
      ]);
    },
  });

  // Chat messages
  const { onRequest, parsedMessages } = useXChat({
    agent,
    defaultMessages: [
      {
        id: 'init',
        message: {
          type: 'ai',
          content: 'Hello, what can I do for you?',
        },
        status: 'success',
      },
    ],

    requestPlaceholder: {
      type: 'ai',
      content: 'Waiting...',
    },

    // Convert AgentMessage to BubbleMessage
    parser: (agentMessages) => {
      const list = agentMessages.content ? [agentMessages] : (agentMessages as AgentAIMessage).list;
      return (list || []).map((msg) => ({
        role: msg.type,
        content: msg.content,
      }));
    },
  });

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        role={roles}
        style={{ maxHeight: 300 }}
        items={parsedMessages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          ...message,
        }))}
      />
      <Sender
        loading={agent.isRequesting()}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest({
            type: 'user',
            content: nextContent,
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
