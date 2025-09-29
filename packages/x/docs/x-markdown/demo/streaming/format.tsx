import XMarkdown from '@ant-design/x-markdown';
import { Button, Card, Skeleton } from 'antd';
import React, { useState } from 'react';

const demos = [
  {
    title: 'Mixed Syntax',
    content:
      '# Complex Mixed Syntax\n\nThis is a **comprehensive example** with:\n\n- **Bold items** with [Ant Design X](https://github.com/ant-design/x)\n- *Italic text* with `inline code`\n- Images: ![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)\n\n## Code Example\n\n```javascript\nconst mixed = "Hello **world** with [link](https://example.com)";\n```\n\n> **Note**: This is a *blockquote* with **mixed** syntax.',
  },
  {
    title: 'Image Syntax',
    content:
      "Here's an image: \n\n![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)",
  },
  {
    title: 'Link Syntax',
    content: 'Visit [Ant Design X](https://github.com/ant-design/x) for more details.',
  },
  {
    title: 'Emphasis',
    content:
      'This is **bold text** and this is *italic text*. You can also use ***bold and italic***.',
  },
  {
    title: 'Code Block',
    content:
      '```typescript\nconst greet = (name: string) => {\n  console.log(`Hello, ${name}!`);\n};\n```\n\nInline code: `const x = 1`',
  },
];

const ImageSkeleton = () => <Skeleton.Image active style={{ width: 60, height: 60 }} />;

const LinkSkeleton = () => (
  <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }} />
);

const StreamDemo: React.FC<{ content: string }> = ({ content }) => {
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxHeight: 300 }}>
      <Card title="Markdown Source" size="small">
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
            height: 200,
            overflow: 'auto',
          }}
        >
          {displayText || 'Click Stream to start'}
        </div>
      </Card>

      <Card
        title="Rendered Output"
        size="small"
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
            height: 200,
            overflow: 'auto',
          }}
        >
          <XMarkdown
            content={displayText}
            components={{ 'incomplete-image': ImageSkeleton, 'incomplete-link': LinkSkeleton }}
            streaming={{ hasNextChunk: true }}
          />
        </div>
      </Card>
    </div>
  );
};

const App = () => {
  const [currentDemo, setCurrentDemo] = useState(0);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
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
      </div>

      <StreamDemo key={currentDemo} content={demos[currentDemo].content} />
    </div>
  );
};

export default App;
