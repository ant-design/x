import { Bubble } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Flex } from 'antd';
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

function ReactInfographic(props: ReactInfographicProps) {
  const { children } = props;
  const [isClient, setIsClient] = React.useState(false);

  const $container = React.useRef<HTMLDivElement>(null);
  const infographicInstance = React.useRef<any>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient || !$container.current) return;
    // 动态导入 Infographic 以避免 SSR 问题
    import('@antv/infographic').then(({ Infographic }) => {
      // 确保 container 不为 null
      if ($container.current) {
        infographicInstance.current = new Infographic({
          container: $container.current,
        });
        infographicInstance.current?.render(children as string);
      }
    });
    return () => {
      infographicInstance.current?.destroy?.();
    };
  }, [isClient, children]);

  if (!isClient) {
    return <div style={{ minHeight: 400 }}>Loading infographic...</div>;
  }

  return <div ref={$container} />;
}

const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || '';

  if (typeof children !== 'string') return null;
  if (lang === 'infographic') {
    return <ReactInfographic>{children}</ReactInfographic>;
  }
  return <code>{children}</code>;
};

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
    <Flex vertical gap="small" style={{ height: 800, overflow: 'auto' }} ref={contentRef}>
      <Flex justify="flex-end">
        <Button onClick={() => setIndex(0)}>Re-Render</Button>
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
