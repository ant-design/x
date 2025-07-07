import { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Line, LineProps } from '@antv/gpt-vis';
import { Button, Flex } from 'antd';
import React from 'react';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis) \n\n

Here’s a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

<div><Line data=[{"time":2013,"value":59.3},{"time":2014,"value":64.4},{"time":2015,"value":68.9},{"time":2016,"value":74.4},{"time":2017,"value":82.7},{"time":2018,"value":91.9},{"time":2019,"value":99.1},{"time":2020,"value":101.6},{"time":2021,"value":114.4},{"time":2022,"value":121}] axisXTitle="year" axisYTitle="sale" ></Line></div>
`;

const LineCompt = (props: LineProps) => {
  const { data, axisXTitle, axisYTitle } = props;
  return <Line data={JSON.parse(data || '')} axisXTitle={axisXTitle} axisYTitle={axisYTitle} />;
};

const RenderMarkdown: BubbleProps['messageRender'] = (content) => (
  <XMarkdown
    components={{
      line: LineCompt,
    }}
    streaming={{ hasNextChunk: true }}
  >
    {content}
  </XMarkdown>
);

const App = () => {
  const [rerenderKey, setRerenderKey] = React.useState(0);

  return (
    <Flex vertical gap="small" key={rerenderKey}>
      <Button
        style={{ alignSelf: 'flex-end' }}
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
