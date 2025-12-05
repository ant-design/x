import { Bubble, Sources } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Flex } from 'antd';
import React from 'react';

const text = `Ant Financial has a large number of enterprise-level products.<sup>1</sup> With complex scenarios, designers and developers often need to respond fast due to frequent changes in product demands and concurrent R & D workflow.<sup>2</sup> Many similar contents exist in the process. Through abstraction, we could obtain some stable and highly reusable components and pages.<sup>3</sup>`;

const SupComponent = React.memo((props: ComponentProps) => {
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
      activeKey={parseInt(`${props?.children}` || '0', 10)}
      title={props.children}
      items={items}
      inline={true}
    />
  );
});

const App = () => {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
    <Flex vertical gap="small" style={{ height: 300, overflow: 'auto' }} ref={contentRef}>
      <Flex justify="flex-end">
        <Button onClick={() => setIndex(0)}>Re-Render</Button>
      </Flex>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown components={{ sup: SupComponent }} paragraphTag="div">
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
