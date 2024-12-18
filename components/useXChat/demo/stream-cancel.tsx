import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat, XStream } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import React, { useRef } from 'react';

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

const contentChunks = [
  'He',
  'llo',
  ', w',
  'or',
  'ld!',
  ' Ant',
  ' Design',
  ' X',
  ' is',
  ' the',
  ' best',
  '!',
];

function mockReadableStream() {
  const sseChunks: string[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    const sseEventPart = `event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n`;
    sseChunks.push(sseEventPart);
  }

  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

const App = () => {
  const [content, setContent] = React.useState('');

  const abortRef = useRef(() => {});

  useEffect(() => {
    return () => {
      abortRef.current();
    };
  }, []);

  // Agent for request
  const [agent] = useXAgent({
    request: async ({}, { onSuccess, onUpdate }) => {
      const stream = XStream({
        readableStream: mockReadableStream(),
      });

      const reader = stream.getReader();
      abortRef.current = () => {
        reader?.cancel();
      };

      let current = '';
      while (reader) {
        const { value, done } = await reader.read();
        if (done) {
          onSuccess(current);
          break;
        }
        if (!value) continue;
        const data = JSON.parse(value.data);
        current += data.content || '';
        onUpdate(current);
      }
    },
  });

  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
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
        loading={agent.isRequesting()}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          setContent('');
        }}
        onCancel={() => abortRef.current()}
      />
    </Flex>
  );
};

export default App;
