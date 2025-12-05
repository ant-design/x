import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Line } from '@antv/gpt-vis';
import { Button, Flex, Skeleton } from 'antd';
import React from 'react';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis) \n\n

Here’s a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

<custom-line axisXTitle="year" axisYTitle="sale">[{"time":2013,"value":59.3},{"time":2014,"value":64.4},{"time":2015,"value":68.9},{"time":2016,"value":74.4},{"time":2017,"value":82.7},{"time":2018,"value":91.9},{"time":2019,"value":99.1},{"time":2020,"value":101.6},{"time":2021,"value":114.4},{"time":2022,"value":121}]</custom-line>
`;

const LineCompt = (props: Record<string, any>) => {
  const { children, axisXTitle, axisYTitle, streamStatus } = props;

  if (streamStatus === 'loading') {
    return <Skeleton.Image active={true} style={{ width: 901, height: 408 }} />;
  }
  return <Line data={JSON.parse(children)} axisXTitle={axisXTitle} axisYTitle={axisYTitle} />;
};

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [hasNextChunk, setHasNextChunk] = React.useState(true);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const renderStream = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (index >= text.length) {
      setHasNextChunk(false);
      return;
    }

    timer.current = setTimeout(() => {
      setIndex((prev) => {
        const next = Math.min(prev + 5, text.length);
        if (next < text.length) {
          renderStream();
        }
        return next;
      });
    }, 20);
  }, [index]);

  React.useEffect(() => {
    renderStream();
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [renderStream]);

  React.useEffect(() => {
    if (contentRef.current && index > 0 && index < text.length) {
      const { scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight > clientHeight) {
        contentRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [index]);

  return (
    <Flex vertical gap="small" style={{ height: 600, overflow: 'auto' }} ref={contentRef}>
      <Button
        style={{ alignSelf: 'flex-end' }}
        onClick={() => {
          setIndex(0);
          setHasNextChunk(true);
        }}
      >
        Re-Render
      </Button>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown
            style={{ whiteSpace: 'normal' }}
            components={{ 'custom-line': LineCompt }}
            paragraphTag="div"
            streaming={{ hasNextChunk }}
          >
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
