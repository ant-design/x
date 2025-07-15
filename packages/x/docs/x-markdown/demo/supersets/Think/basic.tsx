import type { BubbleProps } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex } from 'antd';
import React from 'react';
import { Think } from '@ant-design/x';

const text = `<div><think>Deep thinking is a systematic and structured cognitive approach that requires individuals to move beyond intuition and superficial information, delving into the essence of a problem and its underlying principles through logical analysis, multi-perspective examination, and persistent inquiry. Unlike quick reactions or heuristic judgments, deep thinking emphasizes ​slow thinking, actively engaging knowledge reserves, critical thinking, and creativity to uncover deeper connections and meanings.
Key characteristics of deep thinking include:
​Probing the Essence: Not settling for "what it is," but continuously asking "why" and "how it works" until reaching the fundamental logic.
​Multidimensional Connections: Placing the issue in a broader context and analyzing it through interdisciplinary knowledge or diverse perspectives.
​Skepticism & Reflection: Challenging existing conclusions, authoritative opinions, and even personal biases, validating them through logic or evidence.
​Long-term Value Focus: Prioritizing systemic consequences and sustainable impact over short-term or localized benefits.
This mode of thinking helps individuals avoid cognitive biases in complex scenarios, improve decision-making, and generate groundbreaking insights in fields such as academic research, business innovation, and social problem-solving.</think></div>
`;

const RenderMarkdown: BubbleProps['messageRender'] = (content) => (
  <XMarkdown
    components={{
      think: (props: { children: string }) => (
        <Think title={'deep thinking'}>{props.children}</Think>
      ),
    }}
  >
    {content}
  </XMarkdown>
);

const App = () => {
  const [rerenderKey, setRerenderKey] = React.useState(0);

  return (
    <Flex vertical gap="small" key={rerenderKey}>
      <Button
        style={{ alignSelf: 'flex-start' }}
        onClick={() => {
          setRerenderKey((prev) => prev + 1);
        }}
      >
        Re-Render
      </Button>

      <Bubble
        typing={{ step: 50, interval: 150 }}
        content={text}
        messageRender={RenderMarkdown}
        avatar={{
          src: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp',
        }}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
