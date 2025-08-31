import { Button, Row, Col, Card, Typography, Input } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Code = (props: { class: string; children: string }) => {
  const { class: className, children } = props;
  const lang = className?.replace('language-', '');
  return <HighlightCode lang={lang}>{children}</HighlightCode>;
};

const App: React.FC = () => {
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [hasNextChunk, setHasNextChunk] = useState(false);
  const [className, setClassName] = useState('x-markdown-light');
  const [inputValue, setInputValue] = useState(`#### Image

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original" />

### Link

[Ant Design X](https://x.ant.design/components/overview)

### Emphasis

*This is emphasis text*

### Bold

**This is bold text**

### Code

\`\`\`tsx
import React from 'react';
import XMarkdown from '@ant-design/x-markdown';

const App = () => <XMarkdown content="Hello World!" />;

export default App;
\`\`\``);

  const [reactMarkdownContent, setReactMarkdownContent] = useState('');
  const [xMarkdownContent, setXMarkdownContent] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const theme = urlParams.get('theme');
      setClassName(theme === 'dark' ? 'x-markdown-dark' : 'x-markdown-light');
    }
  }, []);

  const startComparison = () => {
    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 重置内容
    setReactMarkdownContent('');
    setXMarkdownContent('');
    setHasNextChunk(true);

    let currentContent = '';
    const fullContent = inputValue;

    intervalRef.current = setInterval(() => {
      const addCount = Math.floor(Math.random() * 30) + 1;
      currentContent = fullContent.slice(
        0,
        Math.min(currentContent.length + addCount, fullContent.length),
      );

      setReactMarkdownContent(currentContent);

      if (enableStreaming) {
        setXMarkdownContent(currentContent);
      } else {
        setXMarkdownContent(fullContent);
      }

      if (currentContent === fullContent) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setHasNextChunk(false);
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          React-Markdown vs XMarkdown 对比演示
        </Title>
        <Text type="secondary">
          使用相同的Markdown内容，左侧展示react-markdown渲染效果，右侧展示XMarkdown渲染效果
        </Text>
      </div>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <TextArea
            rows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入Markdown内容进行对比..."
          />
        </Col>
      </Row>

      <Row justify="end" style={{ marginBottom: 24 }}>
        <Button
          style={{ marginRight: 8 }}
          onClick={() => {
            setEnableStreaming(!enableStreaming);
          }}
        >
          Streaming: {enableStreaming ? 'On' : 'Off'}
        </Button>
        <Button type="primary" onClick={startComparison}>
          开始对比
        </Button>
      </Row>

      <Row gutter={24} style={{ flex: 1 }}>
        <Col span={12}>
          <Card
            title="React-Markdown"
            style={{ height: 850 }}
            bodyStyle={{ height: 'calc(850px - 57px)', overflow: 'auto' }}
          >
            <div style={{ padding: 16 }} className={className}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {reactMarkdownContent}
              </ReactMarkdown>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="XMarkdown"
            style={{ height: 850 }}
            bodyStyle={{ height: 'calc(850px - 57px)', overflow: 'auto' }}
          >
            <div style={{ padding: 16 }}>
              <XMarkdown
                className={className}
                content={xMarkdownContent}
                streaming={{ hasNextChunk: enableStreaming && hasNextChunk }}
                components={{ code: Code }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
