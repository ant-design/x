import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Line } from '@antv/gpt-vis';
import { Button, Flex, Skeleton } from 'antd';
import React from 'react';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis) \n\n

Here’s a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

<line axisXTitle="year" axisYTitle="sale">[{"time":2013,"value":59.3},{"time":2014,"value":64.4},{"time":2015,"value":68.9},{"time":2016,"value":74.4},{"time":2017,"value":82.7},{"time":2018,"value":91.9},{"time":2019,"value":99.1},{"time":2020,"value":101.6},{"time":2021,"value":114.4},{"time":2022,"value":121}]</line>
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
  const [hasNextChunk, setHasNextChunk] = React.useState(false);
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      setHasNextChunk(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20);
  };

  React.useEffect(() => {
    if (index === text.length) return;
    setHasNextChunk(true);
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
          <XMarkdown
            components={{ line: LineCompt }}
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
