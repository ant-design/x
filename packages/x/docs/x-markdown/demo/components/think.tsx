import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, Think, useXAgent, useXChat } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { BubbleListProps } from '@ant-design/x/es/bubble';

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

const ThinkComponent = React.memo(
  (props: { streamStatus: string; children: string; status: string }) => {
    const [title, setTitle] = React.useState('Deep thinking...');
    const [loading, setLoading] = React.useState(true);
    const [expand, setExpand] = React.useState(true);

    React.useEffect(() => {
      if (props.streamStatus === 'done') {
        setTitle('Complete thinking');
        setLoading(false);
        setExpand(false);
      }
    }, [props.streamStatus]);

    return (
      <Think title={title} loading={loading} expanded={expand} onClick={() => setExpand(!expand)}>
        {props.children}
      </Think>
    );
  },
);

const App: React.FC = () => {
  const [content, setContent] = React.useState('');
  const [className, setClassName] = React.useState('x-markdown-light');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const theme = urlParams.get('theme');
      setClassName(theme === 'dark' ? 'x-markdown-dark' : 'x-markdown-light');
    }
  }, []);

  // Agent for request
  const [agent] = useXAgent<string, { message: string }, string>({
    request: async (_, { onSuccess, onUpdate }) => {
      let currentContent = '';

      const id = setInterval(() => {
        const addCount = Math.floor(Math.random() * 30);
        currentContent = fullContent.slice(0, currentContent.length + addCount);
        onUpdate(currentContent);
        if (currentContent === fullContent) {
          clearInterval(id);
          onSuccess([currentContent]);
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
        role={roles}
        style={{ flex: 1 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          contentRender:
            status === 'local'
              ? undefined
              : (content) => (
                  <XMarkdown
                    className={className}
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
