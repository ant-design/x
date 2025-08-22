import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Line, LineProps } from '@antv/gpt-vis';
import { Button, Flex } from 'antd';
/* eslint-disable react/no-danger */
import React from 'react';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis) \n\n

Here’s a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

<line axisXTitle="year" axisYTitle="sale" data='[{"time":2013,"value":59.3},{"time":2014,"value":64.4},{"time":2015,"value":68.9},{"time":2016,"value":74.4},{"time":2017,"value":82.7},{"time":2018,"value":91.9},{"time":2019,"value":99.1},{"time":2020,"value":101.6},{"time":2021,"value":114.4},{"time":2022,"value":121}]' />
`;

const LineCompt = (props: LineProps) => {
  const { data, axisXTitle, axisYTitle } = props;
  return <Line data={JSON.parse(data || '')} axisXTitle={axisXTitle} axisYTitle={axisYTitle} />;
};

const App = () => {
  const [index, setIndex] = React.useState(text.length);
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
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(1)}>
        Re-Render
      </Button>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown
            style={{ whiteSpace: 'normal' }}
            components={{ line: LineCompt }}
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
