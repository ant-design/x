import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, Think } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import React, { useMemo } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { BubbleListProps } from '@ant-design/x/es/bubble';

interface ChatInput {
  query: string;
}

const fullContent = `
<think>Deep thinking is a systematic and structured cognitive approach that requires individuals to move beyond intuition and superficial information, delving into the essence of a problem and its underlying principles through logical analysis, multi-perspective examination, and persistent inquiry. Unlike quick reactions or heuristic judgments, deep thinking emphasizes ​slow thinking, actively engaging knowledge reserves, critical thinking, and creativity to uncover deeper connections and meanings.
Key characteristics of deep thinking include:
​Probing the Essence: Not settling for "what it is," but continuously asking "why" and "how it works" until reaching the fundamental logic.
​Multidimensional Connections: Placing the issue in a broader context and analyzing it through interdisciplinary knowledge or diverse perspectives.
​Skepticism & Reflection: Challenging existing conclusions, authoritative opinions, and even personal biases, validating them through logic or evidence.
​Long-term Value Focus: Prioritizing systemic consequences and sustainable impact over short-term or localized benefits.
This mode of thinking helps individuals avoid cognitive biases in complex scenarios, improve decision-making, and generate groundbreaking insights in fields such as academic research, business innovation, and social problem-solving.</think>
# Hello Deep Thinking\n - Deep thinking is over.\n- You can use the think tag to package your thoughts.
`;

const splitIntoChunks = (str: string, chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
};

const mockFetch = async () => {
  const chunks = splitIntoChunks(fullContent, 10);
  const response = new Response(
    new ReadableStream({
      async start(controller) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          for (const chunk of chunks) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            if (!controller.desiredSize) {
              // 流已满或关闭，避免写入
              return;
            }

            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.log(error, 333);
        }
      },
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    },
  );

  return response;
};

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

const ThinkComponent = React.memo((props: { children: string; status: string }) => {
  const [title, setTitle] = React.useState('Deep thinking...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.status === 'done') {
      setTitle('Complete thinking');
      setLoading(false);
    }
  }, [props.status]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

const App: React.FC = () => {
  const [content, setContent] = React.useState('');

  let chunks = '';
  const provider = useMemo(
    () =>
      new DefaultChatProvider<string, ChatInput, string>({
        request: XRequest('https://api.example.com/chat', {
          manual: true,
          fetch: mockFetch,
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
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          contentRender:
            status === 'local'
              ? (content) => content.query
              : (content) => (
                  <XMarkdown
                    className="x-markdown-light"
                    paragraphTag="div"
                    content={content as string}
                    components={{
                      think: ThinkComponent,
                    }}
                  />
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
