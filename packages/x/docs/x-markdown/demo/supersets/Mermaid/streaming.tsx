import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import React, { useMemo } from 'react';
import { mockFetch } from '../../_utils';

const fullContent = `
Here are several Mermaid diagram examples

#### 1. Flowchart (Vertical)

\`\`\` mermaid
graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b
\`\`\`

#### 2. Sequence Diagram

\`\`\` mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>Server: POST /api/data
    Server->>Database: INSERT record
    Database-->>Server: Success
    Server-->>Client: 201 Created
\`\`\`

#### 3. Quadrant Chart

\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\`
`;

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
  },
  local: {
    placement: 'end',
  },
};

interface MessageType {
  role: 'ai' | 'user';
  content: string;
}

const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || '';

  if (typeof children !== 'string') return null;
  if (lang === 'mermaid') {
    return <Mermaid>{children}</Mermaid>;
  }
  return <code>{children}</code>;
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
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          contentRender:
            status === 'local'
              ? (content) => content.query
              : (content) => (
                  <XMarkdown
                    content={content as string}
                    components={{
                      code: Code,
                    }}
                  />
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
            role: 'user',
          });
          setContent('');
        }}
      />
    </div>
  );
};

export default App;
