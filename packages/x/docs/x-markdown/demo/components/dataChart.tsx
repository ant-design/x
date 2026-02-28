import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Line } from '@antv/gpt-vis';
import { Button, Flex, Skeleton } from 'antd';
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis) \n\n
Here’s a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

<custom-line data-axis-x-title="year" data-axis-y-title="sale">[{"time":2013,"value":59.3},{"time":2014,"value":64.4},{"time":2015,"value":68.9},{"time":2016,"value":74.4},{"time":2017,"value":82.7},{"time":2018,"value":91.9},{"time":2019,"value":99.1},{"time":2020,"value":101.6},{"time":2021,"value":114.4},{"time":2022,"value":121}]</custom-line>
`;

const LineCompt = (props: Record<string, any>) => {
  const { children, streamstatus } = props;

  const resolvedAxisXTitle = props['data-axis-x-title'] || '';
  const resolvedAxisYTitle = props['data-axis-y-title'] || '';
  const resolvedStreamStatus = streamstatus || 'done';

  // Extract JSON from children - children can be array or string
  let jsonData: any = [];
  if (Array.isArray(children) && children.length > 0) {
    jsonData = children[0];
  } else if (typeof children === 'string') {
    jsonData = children;
  }

  if (resolvedStreamStatus === 'loading') {
    return <Skeleton.Image active={true} style={{ width: 901, height: 408 }} />;
  }

  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    return (
      <Line data={parsedData} axisXTitle={resolvedAxisXTitle} axisYTitle={resolvedAxisYTitle} />
    );
  } catch (error) {
    console.error('Failed to parse Line data:', jsonData, error);
    return <div>Error rendering chart</div>;
  }
};

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [hasNextChunk, setHasNextChunk] = React.useState(true);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index >= text.length) return;

    timer.current = setTimeout(() => {
      setIndex(Math.min(index + 5, text.length));
    }, 20);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [index]);

  useEffect(() => {
    if (index >= text.length) {
      setHasNextChunk(false);
    } else if (!hasNextChunk) {
      setHasNextChunk(true);
    }
  }, [index, hasNextChunk]);

  useEffect(() => {
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
      <Flex justify="flex-end">
        <Button
          onClick={() => {
            setIndex(0);
            setHasNextChunk(true);
          }}
        >
          Re-Render
        </Button>
      </Flex>

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
