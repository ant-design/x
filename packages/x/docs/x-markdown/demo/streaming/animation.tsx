import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Space, Switch, Typography, theme } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const text = `
# Ant Design X: The Ultimate AI Conversation UI Framework

> "Easily build AI-driven interfaces"
>
> — Ant Design X Team

## ✨ Features

- 🌈 Best practices from enterprise-level AI products: Based on RICH interaction paradigms, providing excellent AI interaction experience
- 🧩 Flexible atomic components: Covering most AI scenarios, helping you quickly build personalized AI interaction pages
- ✨ Stream-friendly, extensible, and high-performance Markdown renderer: Supports streaming formulas, code highlighting, mermaid diagrams, etc.
- 🚀 Out-of-the-box model/agent integration: Easily connect to OpenAI-compatible model/agent services
- ⚡️ Efficient management of large model data streams: Provides handy data stream management features for more efficient development
- 📦 Rich template support: Multiple templates for quick LUI app development
- 🛡 Full TypeScript coverage: Developed with TypeScript, providing complete type support for better experience and reliability
- 🎨 Deep theme customization: Fine-grained style adjustments for personalized needs in various scenarios

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide many atomic components for different interaction stages to help you flexibly build your AI application:

### Core Components
- **Bubble**: Message bubble for displaying chat messages
- **Bubble.List**: Virtualized message list for handling large datasets
- **Sender**: Input box for sending messages
- **Conversations**: Conversation history management
- **Welcome**: Welcome screen component

### Input Components
- **Prompts**: Quick suggestion prompts
- **Attachments**: File upload and preview

### Display Components
- **ThoughtChain**: AI reasoning process display
- **Sources**: Reference and citation display
- **FileCard**: File preview cards

## 🔗 Ecosystem

### Related Packages
- **@ant-design/x-markdown**: Advanced markdown rendering with streaming support
- **@ant-design/x-sdk**: AI model integration and data stream management

### Framework Integrations
- **Next.js**: Server-side rendering support
- **Vite**: Fast development experience
- **Create React App**: Zero configuration setup
- **Umi**: Enterprise-grade framework

> Ant Design X is more than just a component library—it's a complete solution for building the next generation of AI-powered applications. Start building today and create experiences that delight your users.
`;

const { Text } = Typography;

const App = () => {
  const [enableAnimation, setEnableAnimation] = React.useState(true);
  const [hasNextChunk, setHasNextChunk] = React.useState(true);
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (index >= text.length) {
      setHasNextChunk(false);
      return;
    }

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
    <Flex vertical gap="small" style={{ height: 600, overflow: 'auto' }} ref={contentRef}>
      <Space align="center" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Text>Animation</Text>
          <Switch checked={enableAnimation} onChange={setEnableAnimation} />
        </Space>

        <Button
          onClick={() => {
            setIndex(0);
            setHasNextChunk(true);
          }}
        >
          Re-Render
        </Button>
      </Space>

      <Bubble
        style={{ width: '100%' }}
        styles={{
          body: { width: '100%' },
        }}
        variant="borderless"
        content={text.slice(0, index)}
        className={className}
        contentRender={(content) => (
          <XMarkdown
            streaming={{ enableAnimation, hasNextChunk, animationConfig: { fadeDuration: 400 } }}
          >
            {content}
          </XMarkdown>
        )}
      />
    </Flex>
  );
};

export default App;
