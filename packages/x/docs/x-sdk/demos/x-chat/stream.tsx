import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { useXChat } from '@ant-design/x-sdk';
import { Flex, type GetProp } from 'antd';
import React from 'react';

const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));
const sseData = `event: test\n\ndata: value\n\nevent: test2\n\ndata: value2`;

function mockSSEReadableStream() {
  return new ReadableStream({
    async start(controller) {
      const chunks = sseData.split('\n\n');
      controller.enqueue(new TextEncoder().encode(chunks[0]));
      await sleep();
      controller.enqueue(new TextEncoder().encode(chunks[1]));
      await sleep();
      controller.enqueue(new TextEncoder().encode(chunks[2]));
      await sleep();
      controller.enqueue(new TextEncoder().encode(chunks[3]));
      await sleep();
      controller.close();
    },
  });
}

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const App = () => {
  const [content, setContent] = React.useState('');

  // Chat messages
  const { onRequest, messages, isRequesting } = useXChat({
    baseURL: 'http://localhost:3000',
    requestOptions: {
      fetch: async () => {
        return new Response(mockSSEReadableStream());
      },
    },
  });

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ maxHeight: 300 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
        }))}
      />
      <Sender
        loading={isRequesting()}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
