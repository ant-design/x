import { Bubble } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Flex, Spin } from 'antd';
import React from 'react';

const text = `
**[Infographic](https://github.com/antvis/Infographic)**, An Infographic Generation and Rendering Framework, bring words to life with AI!

The advantages of an enterprise are generally analyzed from dimensions such as brand influence, technological R&D capabilities, rapid market growth, service satisfaction, comprehensive data assets, and strong innovation capabilities, which are reflected in the final performance.

\`\`\` infographic
infographic sequence-pyramid-simple
data
  title 企业数字化转型层级
  desc 从基础设施到战略创新的五层进阶路径
  items
    - label 战略创新
      desc 数据驱动决策，引领行业变革
      icon ref:search:lightbulb-on
    - label 智能运营
      desc AI赋能业务，实现自动化管理
      icon ref:search:robot
    - label 数据整合
      desc 打通数据孤岛，建立统一平台
      icon ref:search:database-sync
    - label 流程优化
      desc 数字化核心业务流程和协作
      icon ref:search:workflow
    - label 基础设施
      desc 构建云计算和网络基础架构
      icon ref:search:server-network
themeConfig
  palette antv
\`\`\`
`;

type ReactInfographicProps = {
  children: React.ReactNode;
};

/**
 * React wrapper for @antv/infographic
 * Dynamically imports the library to avoid SSR issues
 */
function ReactInfographic(props: ReactInfographicProps) {
  const { children } = props;
  const [isClient, setIsClient] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const infographicInstance = React.useRef<{
    render: (spec: string) => void;
    destroy: () => void;
  } | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let isMounted = true;

    import('@antv/infographic')
      .then(({ Infographic }) => {
        if (!isMounted || !containerRef.current) return;

        infographicInstance.current = new Infographic({
          container: containerRef.current,
        });

        infographicInstance.current.render(children as string);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load infographic:', error);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      infographicInstance.current?.destroy();
      infographicInstance.current = null;
    };
  }, [isClient, children]);

  if (!isClient) {
    return (
      <div
        style={{
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin tip="Loading infographic..." />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        maxHeight: 500,
        overflow: 'auto',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 16,
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <Spin tip="Rendering..." />
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

/**
 * Custom code renderer for XMarkdown
 * Handles 'infographic' language code blocks
 */
const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || '';

  if (typeof children !== 'string') return null;

  if (lang === 'infographic') {
    return <ReactInfographic>{children}</ReactInfographic>;
  }

  return <code>{children}</code>;
};

/**
 * Main application component
 * Demonstrates streaming markdown rendering with infographic support
 */
const App = () => {
  const [index, setIndex] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Streaming text animation
  React.useEffect(() => {
    if (index >= text.length) return;

    timerRef.current = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 5, text.length));
    }, 20);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [index]);

  // Auto-scroll to bottom during streaming
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

  const handleRerender = () => {
    setIndex(0);
  };

  return (
    <Flex vertical gap="small" style={{ height: 800, overflow: 'auto' }} ref={contentRef}>
      <Flex justify="flex-end">
        <Button type="primary" onClick={handleRerender}>
          Re-Render
        </Button>
      </Flex>

      <Bubble
        content={text.slice(0, index)}
        styles={{
          content: {
            width: 700,
          },
        }}
        contentRender={(content) => (
          <XMarkdown components={{ code: Code }} paragraphTag="div">
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
