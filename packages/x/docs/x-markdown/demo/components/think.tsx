import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, Think, useXAgent, useXChat } from '@ant-design/x';
import { RolesType } from '@ant-design/x/es/bubble/BubbleList';
import XMarkdown from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';

const fullContent = `
<think>Deep thinking is a systematic and structured cognitive approach that requires individuals to move beyond intuition and superficial information, delving into the essence of a problem and its underlying principles through logical analysis, multi-perspective examination, and persistent inquiry. Unlike quick reactions or heuristic judgments, deep thinking emphasizes ​slow thinking, actively engaging knowledge reserves, critical thinking, and creativity to uncover deeper connections and meanings.
Key characteristics of deep thinking include:
​Probing the Essence: Not settling for "what it is," but continuously asking "why" and "how it works" until reaching the fundamental logic.
​Multidimensional Connections: Placing the issue in a broader context and analyzing it through interdisciplinary knowledge or diverse perspectives.
​Skepticism & Reflection: Challenging existing conclusions, authoritative opinions, and even personal biases, validating them through logic or evidence.
​Long-term Value Focus: Prioritizing systemic consequences and sustainable impact over short-term or localized benefits.
This mode of thinking helps individuals avoid cognitive biases in complex scenarios, improve decision-making, and generate groundbreaking insights in fields such as academic research, business innovation, and social problem-solving.</think>
`;

const roles: RolesType = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
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

  // Agent for request
  const [agent] = useXAgent<string, { message: string }, string>({
    request: async (_, { onSuccess, onUpdate }) => {
      let currentContent = '';

      const id = setInterval(() => {
        const addCount = Math.floor(Math.random() * 30);
        currentContent = fullContent.slice(0, currentContent.length + addCount);
        onUpdate(currentContent);
        if (currentContent === fullContent) {
          const thinkContent = currentContent.replace(
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
          onUpdate(thinkContent);
          clearInterval(id);
          onSuccess([thinkContent]);
        }
      }, 100);
    },
  });

  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
  });

  return (
    <div style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
      <Bubble.List
        roles={roles}
        style={{ flex: 1 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          messageRender:
            status === 'local'
              ? undefined
              : (content) => (
                  <XMarkdown
                    className="x-markdown-light"
                    paragraphTag="div"
                    content={content}
                    components={{
                      think: ThinkComponent,
                    }}
                  />
                ),
        }))}
      />
      <Sender
        loading={agent.isRequesting()}
        value={content}
        onChange={setContent}
        style={{ marginTop: 48 }}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          setContent('');
        }}
      />
    </div>
  );
};

export default App;
