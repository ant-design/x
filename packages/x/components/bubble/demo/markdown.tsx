import type { BubbleProps } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Typography } from 'antd';
/* eslint-disable react/no-danger */
import React from 'react';

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown: BubbleProps['contentRender'] = (content) => {
  return (
    <Typography>
      <XMarkdown content={content} />
    </Typography>
  );
};

const App = () => {
  const [index, setIndex] = React.useState(text.length);
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 1);
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
    <Flex vertical style={{ height: 150 }} gap={16}>
      <Flex>
        <Button type="primary" onClick={() => setIndex(1)}>
          rerender
        </Button>
      </Flex>
      <Flex>
        <Bubble content={text.slice(0, index)} contentRender={renderMarkdown} />
      </Flex>
    </Flex>
  );
};

export default App;
