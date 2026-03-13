import { SettingOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Input, Popover, Space, Switch, Typography, theme } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const text = `
# Ant Design X: AI Conversation UI Framework

> "Easily build AI-driven interfaces"
>
> — Ant Design X Team

## Features

- Best practices from enterprise-level AI products
- Flexible atomic components covering most AI scenarios
- Stream-friendly, extensible, and high-performance Markdown renderer
- Out-of-the-box model/agent integration
- Efficient management of large model data streams
- Rich template support
- Full TypeScript coverage
- Deep theme customization

## Atomic Components

Based on the RICH interaction paradigm:

### Core Components
- **Bubble**: Message bubble for displaying chat messages
- **Bubble.List**: Virtualized message list
- **Sender**: Input box for sending messages
- **Conversations**: Conversation history management
- **Welcome**: Welcome screen component

> Ant Design X is more than just a component library—it's a complete solution for building AI-powered applications.
`;

const { Text } = Typography;

interface ToggleItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, checked, onChange }) => (
  <Flex align="center" justify="space-between" gap={16} style={{ minWidth: 180 }}>
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Switch size="small" checked={checked} onChange={onChange} />
  </Flex>
);

interface InputItemProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const InputItem: React.FC<InputItemProps> = ({ label, value, onChange, disabled }) => (
  <Flex align="center" justify="space-between" gap={16} style={{ minWidth: 180 }}>
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Input
      size="small"
      style={{ width: 80 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </Flex>
);

const App = () => {
  const [enableAnimation, setEnableAnimation] = React.useState(true);
  const [enableTail, setEnableTail] = React.useState(false);
  const [tailContent, setTailContent] = React.useState('▋');
  const [enableDebug, setEnableDebug] = React.useState(false);
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
      setIndex(Math.min(index + 2, text.length));
    }, 40);

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

  const configContent = (
    <Flex vertical gap={10}>
      <ToggleItem label="Animation" checked={enableAnimation} onChange={setEnableAnimation} />
      <ToggleItem label="Tail" checked={enableTail} onChange={setEnableTail} />
      <InputItem
        label="Tail Content"
        value={tailContent}
        onChange={setTailContent}
        disabled={!enableTail}
      />
      <ToggleItem label="Debug Panel" checked={enableDebug} onChange={setEnableDebug} />
    </Flex>
  );

  return (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Space
        align="center"
        style={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0, marginBottom: 8 }}
        wrap
      >
        <Popover
          trigger="click"
          placement="bottomRight"
          content={<div style={{ padding: 4 }}>{configContent}</div>}
        >
          <Button type="default" size="small" icon={<SettingOutlined />}>
            Config
          </Button>
        </Popover>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setIndex(0);
            setHasNextChunk(true);
          }}
        >
          Run Stream
        </Button>
      </Space>

      <Flex vertical style={{ flex: 1, minHeight: 0, overflow: 'auto' }} ref={contentRef}>
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
              debug={enableDebug}
              streaming={{
                enableAnimation,
                tail: enableTail ? { content: tailContent || '▋' } : false,
                hasNextChunk,
                animationConfig: { fadeDuration: 400 },
              }}
            >
              {content}
            </XMarkdown>
          )}
        />
      </Flex>
    </div>
  );
};

export default App;
