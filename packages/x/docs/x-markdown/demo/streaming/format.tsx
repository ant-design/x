import { Welcome } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Card, Segmented, Skeleton, theme } from 'antd';
import React, { useState } from 'react';

const demos = [
  {
    title: 'Mixed Syntax',
    content: `## Ant Design X｜AI interface solution 
![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)
    
Ant Design X is a comprehensive toolkit for AI applications, integrating a UI component library, streaming Markdown rendering engine, and AI SDK.

- \`npm install @ant-design/x\`
- \`npm install @ant-design/x-markdown\`
- \`npm install @ant-design/x-sdk\`

### \`@ant-design/x\`

A React UI library based on the Ant Design system, designed for **AI-driven interfaces**. [Click here for details.](/components/introduce/).

### \`@ant-design/x-markdown\`

An optimized Markdown rendering solution for **streaming content**. [Click here for details.](/x-markdowns/introduce).

### \`@ant-design/x-sdk\`

Provides a complete set of **tool APIs**. [Click here for details.](/x-sdks/introduce).


| Repo | Description |
| ------ | ----------- |
| @ant-design/x   | A React UI library based on the Ant Design system. |
| @ant-design/x-markdown | An optimized Markdown rendering solution for **streaming content**. |
| @ant-design/x-sdk    | Provides a complete set of **tool APIs**. |

<welcome data-icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" title="Hello, I'm Ant Design X" data-description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"></welcome>
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
    content: `| Repo | Description |
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
  {
    title: 'InlineCode',
    content: 'This is inline code: `npm install @ant-design/x-markdown`.',
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

const IncompleteInlineCode = (props: ComponentProps) => {
  const rawData = String(props['data-raw'] || '');
  if (!rawData) return null;

  const decodedText = decodeURIComponent(rawData)?.slice(1);
  return <code className="inline-code">{decodedText}</code>;
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
  const [hasNextChunk, setHasNextChunk] = React.useState(true);
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const sourceRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback(
    (el: HTMLDivElement | null) => {
      if (el && index > 0) {
        const { scrollHeight, clientHeight } = el;
        if (scrollHeight > clientHeight) {
          el.scrollTo({ top: scrollHeight, behavior: 'smooth' });
        }
      }
    },
    [index],
  );

  React.useEffect(() => {
    if (index >= content.length) {
      setHasNextChunk(false);
      return;
    }

    timer.current = setTimeout(() => {
      setIndex(Math.min(index + 1, content.length));
    }, 30);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [index]);

  React.useEffect(() => {
    if (index > 0) {
      scrollToBottom(sourceRef.current);
      scrollToBottom(contentRef.current);
    }
  }, [index, scrollToBottom]);

  const isLongContent = content.length > 500;
  const previewMinHeight = isLongContent ? 320 : 160;
  const previewMaxHeight = isLongContent ? 420 : 280;

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        width: '100%',
        minHeight: previewMinHeight,
        maxHeight: previewMaxHeight,
        transition: 'max-height 0.25s ease',
      }}
    >
      <Card
        title="Markdown Source"
        size="small"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
        styles={{ body: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <div
          ref={sourceRef}
          style={{
            flex: 1,
            minHeight: 0,
            background: 'var(--ant-color-fill-quaternary)',
            padding: 12,
            borderRadius: 6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'auto',
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {content.slice(0, index)}
        </div>
      </Card>

      <Card
        title="Rendered Output"
        size="small"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
        styles={{ body: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } }}
        extra={
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIndex(0);
              setHasNextChunk(true);
            }}
            size="small"
          >
            Re-Render
          </Button>
        }
      >
        <div
          ref={contentRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            padding: 12,
            borderRadius: 6,
            border: '1px solid var(--ant-color-border-secondary)',
            background: 'var(--ant-color-bg-container)',
          }}
        >
          <XMarkdown
            content={content.slice(0, index)}
            className={className}
            paragraphTag="div"
            openLinksInNewTab
            dompurifyConfig={{ ADD_ATTR: ['icon', 'description'] }}
            components={{
              'incomplete-image': ImageSkeleton,
              'incomplete-link': IncompleteLink,
              'incomplete-table': TableSkeleton,
              'incomplete-html': HtmlSkeleton,
              'incomplete-emphasis': IncompleteEmphasis,
              'incomplete-inline-code': IncompleteInlineCode,
              welcome: WelcomeCard,
            }}
            streaming={{ hasNextChunk }}
          />
        </div>
      </Card>
    </div>
  );
};

const App = () => {
  const [currentDemo, setCurrentDemo] = useState(0);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Segmented
          value={currentDemo}
          onChange={(v) => setCurrentDemo(Number(v))}
          options={demos.map((demo, index) => ({ label: demo.title, value: index }))}
          block
        />
      </div>
      <StreamDemo key={currentDemo} content={demos[currentDemo].content} />
    </div>
  );
};

export default App;
