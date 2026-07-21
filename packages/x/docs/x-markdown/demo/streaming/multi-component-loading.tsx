import { Bubble } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Flex, Skeleton, Tag, theme } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

/**
 * Demo: Multiple custom components with independent loading states (Issue #1949)
 *
 * During streaming, each custom component should independently enter/exit the
 * loading state based on whether its own closing tag has arrived — not all
 * components loading together when only one is still streaming.
 */

// A custom component that shows different content based on streamStatus
const DataCard = React.memo(({ children, streamStatus }: ComponentProps) => {
  if (streamStatus === 'loading') {
    return (
      <div style={{ padding: 12, border: '1px dashed var(--ant-color-border)', borderRadius: 8 }}>
        <Skeleton active paragraph={{ rows: 2 }} title={{ width: 120 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
        border: '1px solid var(--ant-color-border)',
        borderRadius: 8,
        background: 'var(--ant-color-fill-quaternary)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        Data Card <Tag color="green" style={{ fontSize: 11 }}>done</Tag>
      </div>
      <div>{children}</div>
    </div>
  );
});

// Another custom component type to demonstrate cross-type isolation
const InfoPanel = React.memo(({ children, streamStatus }: ComponentProps) => {
  if (streamStatus === 'loading') {
    return (
      <div style={{ padding: 12, border: '1px dashed var(--ant-color-border)', borderRadius: 8 }}>
        <Skeleton.Input active size="small" style={{ width: 200 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
        border: '1px solid var(--ant-color-border-secondary)',
        borderRadius: 8,
        background: 'var(--ant-color-bg-container)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        Info Panel <Tag color="blue" style={{ fontSize: 11 }}>done</Tag>
      </div>
      <div>{children}</div>
    </div>
  );
});

// Markdown content with multiple custom components
const text = `Here are multiple custom components rendered independently:

<data-card>Component A: This is the first data card content.</data-card>

Some text between components.

<info-panel>Component B: This info panel downloads independently.</info-panel>

More text.

<data-card>Component C: Another data card with its own loading state.</data-card>
`;

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';

  React.useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (index >= text.length) {
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    timer.current = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 3, text.length));
    }, 30);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index]);

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [index]);

  return (
    <Flex vertical gap="small" style={{ height: 500 }}>
      <Flex justify="flex-end">
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setIndex(0);
            setIsStreaming(true);
          }}
        >
          Re-Stream
        </Button>
      </Flex>

      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16,
          border: '1px solid var(--ant-color-border)',
          borderRadius: 8,
        }}
      >
        <Bubble
          content={text.slice(0, index)}
          contentRender={(content) => (
            <XMarkdown
              className={className}
              content={content as string}
              paragraphTag="div"
              streaming={{ hasNextChunk: isStreaming }}
              components={{
                'data-card': DataCard,
                'info-panel': InfoPanel,
              }}
            />
          )}
          variant="outlined"
        />
      </div>
    </Flex>
  );
};

export default App;