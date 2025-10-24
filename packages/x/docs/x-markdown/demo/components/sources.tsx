import { Bubble, Sources } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Flex } from 'antd';
import React from 'react';

const text = `Ant Financial has a large number of enterprise-level products.<sup>1</sup> With complex scenarios, designers and developers often need to respond fast due to frequent changes in product demands and concurrent R & D workflow.<sup>2</sup> Many similar contents exist in the process. Through abstraction, we could obtain some stable and highly reusable components and pages.<sup>3</sup>`;

const ThinkComponent = React.memo((props: ComponentProps) => {
  const items = [
    {
      title: '1. Data source',
      key: 1,
      url: 'https://x.ant.design/components/overview',
      description:
        'Artificial Intelligence, often abbreviated as AI, is a broad branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence.',
    },
    {
      title: '2. Data source',
      key: 2,
      url: 'https://x.ant.design/components/overview',
    },
    {
      title: '3. Data source',
      key: 3,
      url: 'https://x.ant.design/components/overview',
    },
  ];
  return (
    <Sources
      activeKey={parseInt(`${props?.children}` || '0')}
      title={props.children}
      items={items}
      inline={true}
    />
  );
});

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
          <XMarkdown components={{ sup: ThinkComponent }} paragraphTag="div">
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
