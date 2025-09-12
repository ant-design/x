import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import React, { useMemo } from 'react';
import { mockFetch } from '../../_utils';

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

interface MessageType {
  role: 'ai' | 'user';
  content: string;
}

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
  },
  user: {
    placement: 'end',
  },
};

const App = () => {
  const [content, setContent] = React.useState('');

  let chunks = '';
  const provider = useMemo(
    () =>
      new DefaultChatProvider<MessageType, MessageType, MessageType>({
        request: XRequest('https://api.example.com/chat', {
          manual: true,
          fetch: () => mockFetch(fullContent),
          transformStream: new TransformStream<string, MessageType>({
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
              controller.enqueue({
                content: chunks,
                role: 'ai',
              });
            },
          }),
        }),
      }),
    [content],
  );

  const { onRequest, messages, isRequesting } = useXChat({
    provider: provider,
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
        items={messages.map(({ id, message }) => ({
          key: id,
          role: message.role,
          content: message.content,
          contentRender:
            message.role === 'user'
              ? (content) => content
              : (content) => (
                  <XMarkdown content={content as string} config={{ extensions: Latex() }} />
                ),
        }))}
      />
      <Sender
        loading={isRequesting}
        value={content}
        onChange={setContent}
        style={{ marginTop: 48 }}
        onSubmit={(nextContent) => {
          onRequest({
            content: nextContent,
            role: 'ai',
          });
          setContent('');
        }}
      />
    </div>
  );
};

export default App;
