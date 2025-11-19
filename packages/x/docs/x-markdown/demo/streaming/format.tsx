import { Welcome } from '@ant-design/x';
import XMarkdown, { ComponentProps } from '@ant-design/x-markdown';
import { Button, Card, Skeleton } from 'antd';
import React, { useState } from 'react';
import { useMarkdownTheme } from '../_utils';

const demos = [
  {
    title: 'Mixed Syntax',
    content: `## Ant Design X｜AI interface solution 
![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)
    
Ant Design X is a comprehensive toolkit for AI applications, integrating a UI component library, streaming Markdown rendering engine, and AI SDK.

### @ant-design/x

A React UI library based on the Ant Design system, designed for **AI-driven interfaces**. [Click here for details.](/components/introduce/).

### @ant-design/x-markdown

An optimized Markdown rendering solution for **streaming content**. [Click here for details.](/x-markdowns/introduce).

### @ant-design/x-sdk

Provides a complete set of **tool APIs**. [Click here for details.](/x-sdks/introduce).
<welcome data-icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" title="Hello, I'm Ant Design X" data-description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"></welcome>

| Repo | Description |
| ------ | ----------- |
| @ant-design/x   | A React UI library based on the Ant Design system. |
| @ant-design/x-markdown | An optimized Markdown rendering solution for **streaming content**. |
| @ant-design/x-sdk    | Provides a complete set of **tool APIs**. |
`,
  },
  {
    title: 'Link Syntax',
    content: 'Visit [Ant Design X](https://github.com/ant-design/x)  for more details.',
  },
  {
    title: 'Image Syntax',
    content:
      '![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)',
  },
  {
    title: 'Html',
    content: `<welcome data-icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" title="Hello, I'm Ant Design X" data-description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"></welcome>`,
  },
  {
    title: 'Table',
    content: `
| Repo | Description |
| ------ | ----------- |
| @ant-design/x   | A React UI library based on the Ant Design system. |
| @ant-design/x-markdown | An optimized Markdown rendering solution for streaming content. |
| @ant-design/x-sdk    | Provides a complete set of tool APIs. |`,
  },
  {
    title: 'Emphasis',
    content:
      'This is **bold text** and this is *italic text*. You can also use ***bold and italic***.',
  },
];

const ImageSkeleton = () => <Skeleton.Image active style={{ width: 60, height: 60 }} />;

const IncompleteLink = (props: ComponentProps) => {
  const text = decodeURIComponent(String(props['data-raw'] || ''));

  // 提取链接文本，格式为 [text](url)
  const linkTextMatch = text.match(/^\[([^\]]*)\]/);
  const displayText = linkTextMatch ? linkTextMatch[1] : text.slice(1);

  return (
    <a style={{ pointerEvents: 'none' }} href="#">
      {displayText}
    </a>
  );
};

const TableSkeleton = () => <Skeleton.Node active style={{ width: 160 }} />;

const HtmlSkeleton = () => <Skeleton.Node active style={{ width: 383, height: 120 }} />;

const IncompleteEmphasis = (props: ComponentProps) => {
  const text = decodeURIComponent(String(props['data-raw'] || ''));

  const match = text.match(/^([*_]{1,3})([^*_]*)/);
  if (!match || !match[2]) return null;

  const [, symbols, content] = match;
  const level = symbols.length;

  switch (level) {
    case 1:
      return <em>{content}</em>;
    case 2:
      return <strong>{content}</strong>;
    case 3:
      return (
        <em>
          <strong>{content}</strong>
        </em>
      );
    default:
      return null;
  }
};

const WelcomeCard = (props: Record<string, any>) => (
  <Welcome
    styles={{ icon: { flexShrink: 0 } }}
    icon={props['data-icon']}
    title={props.title}
    description={props['data-description']}
  />
);

const StreamDemo: React.FC<{ content: string }> = ({ content }) => {
  const [displayText, setDisplayText] = useState(content);
  const [isStreaming, setIsStreaming] = useState(false);
  const [className] = useMarkdownTheme();

  const startStream = React.useCallback(() => {
    setDisplayText('');
    setIsStreaming(true);
    let index = 0;

    const stream = () => {
      if (index <= content.length) {
        setDisplayText(content.slice(0, index));
        index++;
        setTimeout(stream, 30);
      } else {
        setIsStreaming(false);
      }
    };

    stream();
  }, [content]);

  React.useEffect(() => {
    startStream();
  }, [startStream]);

  return (
    <div style={{ display: 'flex', gap: 16, width: '100%' }}>
      <Card title="Markdown Source" size="small" style={{ flex: 1 }}>
        <div
          style={{
            background: '#f5f5f5',
            padding: 12,
            borderRadius: 4,
            fontSize: 13,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            maxHeight: 800,
            overflow: 'auto',
          }}
        >
          {displayText || 'Click Stream to start'}
        </div>
      </Card>

      <Card
        title="Rendered Output"
        size="small"
        style={{ flex: 1, overflow: 'scroll' }}
        extra={
          <Button type="primary" onClick={startStream} loading={isStreaming}>
            Re-Render
          </Button>
        }
      >
        <div
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 4,
            padding: 12,
            maxHeight: 800,
            overflow: 'scroll',
          }}
        >
          <XMarkdown
            content={displayText}
            className={className}
            // paragraphTag="div"
            openLinksInNewTab
            dompurifyConfig={{ ADD_ATTR: ['icon', 'description'] }}
            components={{
              'incomplete-image': ImageSkeleton,
              'incomplete-link': IncompleteLink,
              'incomplete-table': TableSkeleton,
              'incomplete-html': HtmlSkeleton,
              'incomplete-emphasis': IncompleteEmphasis,
              welcome: WelcomeCard,
            }}
            streaming={{ hasNextChunk: isStreaming }}
          />
        </div>
      </Card>
    </div>
  );
};

const App = () => {
  const [currentDemo, setCurrentDemo] = useState(0);

  return (
    <div style={{ padding: 24 }}>
      {demos.map((demo, index) => (
        <Button
          key={index}
          type={currentDemo === index ? 'primary' : 'default'}
          onClick={() => setCurrentDemo(index)}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          {demo.title}
        </Button>
      ))}

      <StreamDemo key={currentDemo} content={demos[currentDemo].content} />
    </div>
  );
};

export default App;
