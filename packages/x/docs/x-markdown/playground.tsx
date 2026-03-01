import XMarkdown from '@ant-design/x-markdown';
import type { ComponentProps } from '@ant-design/x-markdown';
import { Button, Card, Flex, Input, Segmented, Space, Switch, theme, Typography } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const { Text } = Typography;
const { TextArea } = Input;

const DEFAULT_SOURCE = `# XMarkdown Playground

Type Markdown in the editor and see real-time rendering.

## Features

- CommonMark and GFM
- Streaming-friendly rendering
- Safe HTML handling with configurable escaping

\`\`\`tsx
const message = 'Hello, XMarkdown';
console.log(message);
\`\`\`

## Streaming Preview

1. Click "Run Stream"
2. Observe incomplete syntax handling
3. Continue typing in the editor for instant full preview

| Step | Status |
| --- | --- |
| Parse | Done |
| Render | Running |

[Link example](https://x.ant.design/x-markdowns/introduce)

## HTML and Security
<div style="padding: 8px; border: 1px solid #aaa;">
  Inline raw HTML block
</div>

Try toggling \`escapeRawHtml\` to compare behavior.
`;

const getDataRaw = (rest: ComponentProps['rest']) => {
  if (!rest || typeof rest !== 'object') {
    return '';
  }

  return typeof (rest as Record<string, unknown>)['data-raw'] === 'string'
    ? ((rest as Record<string, unknown>)['data-raw'] as string)
    : '';
};

const IncompleteLoadingComponents = {
  'loading-link': ({ rest }: ComponentProps) => {
    const raw = getDataRaw(rest);
    return <span style={{ opacity: 0.6, borderBottom: '1px dashed #999' }}>{raw || '...'}</span>;
  },
  'loading-image': () => (
    <span style={{ opacity: 0.6, display: 'inline-block', width: 96, height: 24 }}>
      Loading image...
    </span>
  ),
  'loading-table': () => (
    <span style={{ opacity: 0.6, display: 'inline-block', width: 96, height: 24 }}>
      Loading table...
    </span>
  ),
  'loading-html': ({ rest }: ComponentProps) => {
    const raw = getDataRaw(rest);
    return <span style={{ opacity: 0.6 }}>{raw || '<html />'}</span>;
  },
};

interface ToggleItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, checked, onChange }) => (
  <Space
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 0',
      minHeight: 32,
      lineHeight: 1,
    }}
  >
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Switch size="small" checked={checked} onChange={onChange} />
  </Space>
);

const Playground: React.FC = () => {
  const [source, setSource] = React.useState<string>(DEFAULT_SOURCE);
  const [cursor, setCursor] = React.useState<number>(source.length);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [enableAnimation, setEnableAnimation] = React.useState<boolean>(true);
  const [escapeRawHtml, setEscapeRawHtml] = React.useState<boolean>(false);
  const [openLinksInNewTab, setOpenLinksInNewTab] = React.useState<boolean>(true);
  const [protectCustomTagNewlines, setProtectCustomTagNewlines] = React.useState<boolean>(false);
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>('light');
  const timerRef = React.useRef<number | null>(null);
  const { token } = theme.useToken();
  const markdownClassName = themeMode === 'light' ? 'x-markdown-light' : 'x-markdown-dark';
  const isDarkMode = themeMode === 'dark';
  const viewportHeight = 'clamp(440px, 68vh, 760px)';

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  React.useEffect(() => {
    clearTimer();
    setCursor(source.length);
  }, [source, clearTimer]);

  React.useEffect(() => {
    if (!isStreaming) {
      return;
    }

    if (cursor >= source.length) {
      setIsStreaming(false);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setCursor((prev) => Math.min(source.length, prev + 6));
    }, 45);
  }, [isStreaming, cursor, source.length]);

  const runStream = () => {
    clearTimer();
    setCursor(0);
    setIsStreaming(true);
  };

  const previewContent = isStreaming ? source.slice(0, cursor) : source;
  const hasNextChunk = isStreaming && cursor < source.length;

  return (
    <div style={{ padding: token.padding, maxWidth: 1400, margin: '0 auto' }}>
      <Flex vertical gap={14}>
        <Card
          size="small"
          title="Control Panel"
          style={{
            borderRadius: token.borderRadiusLG,
            borderColor: token.colorBorderSecondary,
          }}
          bodyStyle={{ padding: 12 }}
        >
          <Flex gap={10} align="center" justify="space-between" wrap>
            <Space size={8} wrap>
              <Segmented
                size="small"
                value={themeMode}
                onChange={(value) => setThemeMode(value as 'light' | 'dark')}
                options={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                ]}
              />
              <ToggleItem
                label="Animation"
                checked={enableAnimation}
                onChange={setEnableAnimation}
              />
              <ToggleItem
                label="Escape Raw HTML"
                checked={escapeRawHtml}
                onChange={setEscapeRawHtml}
              />
              <ToggleItem
                label="Open Links In New Tab"
                checked={openLinksInNewTab}
                onChange={setOpenLinksInNewTab}
              />
              <ToggleItem
                label="Protect Custom Tag Newlines"
                checked={protectCustomTagNewlines}
                onChange={setProtectCustomTagNewlines}
              />
            </Space>

            <Button type="primary" size="small" onClick={runStream} disabled={source.length === 0}>
              Run Stream
            </Button>
          </Flex>
        </Card>

        <Flex gap={12} wrap>
          <Card title="Markdown Input" style={{ flex: '1 1 420px', minWidth: 320 }}>
            <TextArea
              value={source}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSource(event.target.value)
              }
              spellCheck={false}
              bordered={false}
              style={{
                padding: 12,
                height: viewportHeight,
                resize: 'none',
                overflowY: 'auto',
                fontFamily: 'Menlo, Monaco, Consolas, monospace',
              }}
            />
          </Card>

          <Card
            title="Preview"
            style={{ flex: '1 1 420px', minWidth: 320 }}
            styles={{ body: { padding: 1 } }}
          >
            <div
              style={{
                background: isDarkMode ? '#141414' : token.colorBgContainer,
                height: viewportHeight,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className={markdownClassName}
                style={{ padding: 12, flex: 1, overflowY: 'auto' }}
              >
                <XMarkdown
                  content={previewContent}
                  className={markdownClassName}
                  escapeRawHtml={escapeRawHtml}
                  openLinksInNewTab={openLinksInNewTab}
                  protectCustomTagNewlines={protectCustomTagNewlines}
                  streaming={{
                    hasNextChunk,
                    enableAnimation,
                    incompleteMarkdownComponentMap: {
                      link: 'loading-link',
                      image: 'loading-image',
                      table: 'loading-table',
                      html: 'loading-html',
                    },
                  }}
                  components={IncompleteLoadingComponents}
                />
              </div>
            </div>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
};

export default Playground;
