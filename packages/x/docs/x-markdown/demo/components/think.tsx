import { Bubble, Think } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { Button, Flex } from 'antd';

const text = `
<think>Deep thinking is a systematic and structured cognitive approach that requires individuals to move beyond intuition and superficial information, delving into the essence of a problem and its underlying principles through logical analysis, multi-perspective examination, and persistent inquiry. Unlike quick reactions or heuristic judgments, deep thinking emphasizes ​slow thinking, actively engaging knowledge reserves, critical thinking, and creativity to uncover deeper connections and meanings.
Key characteristics of deep thinking include:
​Probing the Essence: Not settling for "what it is," but continuously asking "why" and "how it works" until reaching the fundamental logic.
​Multidimensional Connections: Placing the issue in a broader context and analyzing it through interdisciplinary knowledge or diverse perspectives.
​Skepticism & Reflection: Challenging existing conclusions, authoritative opinions, and even personal biases, validating them through logic or evidence.
​Long-term Value Focus: Prioritizing systemic consequences and sustainable impact over short-term or localized benefits.
This mode of thinking helps individuals avoid cognitive biases in complex scenarios, improve decision-making, and generate groundbreaking insights in fields such as academic research, business innovation, and social problem-solving.</think>
# Hello Deep Thinking\n - Deep thinking is over.\n- You can use the think tag to package your thoughts.
`;

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

const App = () => {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20);
  };

  React.useEffect(() => {
    if (index === text.length) return;
    renderStream();
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <Flex vertical gap="small">
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
        Re-Render
      </Button>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown components={{ think: ThinkComponent }} paragraphTag="div">
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
