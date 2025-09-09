import { UserOutlined } from '@ant-design/icons';
import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import React, { useMemo } from 'react';
import { mockFetch } from '../../_utils';

interface ChatInput {
  query: string;
}

const fullContent = `
### Latex
inline standard: $\\frac{df}{dt}$ \n
block standard：\n
$$
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
$$

inline: \\(\\frac{df}{dt}\\)  \n
block: \n
\\[
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
\\]
`;

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
    components: {
      avatar: <UserOutlined />,
    },
  },
  local: {
    placement: 'end',
    components: {
      avatar: <UserOutlined />,
    },
  },
};

const App = () => {
  const [content, setContent] = React.useState('');

  let chunks = '';
  const provider = useMemo(
    () =>
      new DefaultChatProvider<string, ChatInput, string>({
        request: XRequest('https://api.example.com/chat', {
          manual: true,
          fetch: () => mockFetch(fullContent),
          transformStream: new TransformStream<string, string>({
            transform(chunk, controller) {
              chunks = `${chunks}${chunk}`.replace(
                /<think.*?>([\s\S]*?)<\/think>/gi,
                (match, content) => {
                  try {
                    return `<think status="done">${content}</think>`;
                  } catch (error) {
                    console.error(error);
                    return match;
                  }
                },
              );
              controller.enqueue(chunks);
            },
          }),
        }),
      }),
    [content],
  );

  const { onRequest, messages, isRequesting } = useXChat({
    provider: provider,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });
  return (
    <div
      style={{
        height: 400,
        paddingBlock: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Bubble.List
        role={roles}
        style={{ flex: 1 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          contentRender:
            status === 'local'
              ? (content) => content.query
              : (content) => (
                  <XMarkdown content={content as string} config={{ extensions: Latex() }} />
                ),
        }))}
      />
      <Sender
        loading={isRequesting()}
        value={content}
        onChange={setContent}
        style={{ marginTop: 48 }}
        onSubmit={(nextContent) => {
          onRequest({
            query: nextContent,
          });
          setContent('');
        }}
      />
    </div>
  );
};

export default App;
