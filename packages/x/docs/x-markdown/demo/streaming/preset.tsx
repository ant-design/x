import { SettingOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { ComponentProps, StreamingOption } from '@ant-design/x-markdown';
import { Button, Flex, Popover, Space, Switch, Tag, Typography, theme } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const { Text } = Typography;

// A long answer: headings, inline markup, fenced code and tables — the mix
// that made every chunk re-render the whole document before `incremental`.
const section = (i: number) =>
  [
    `## ${i + 1}. Section ${i + 1}`,
    '',
    `This paragraph has **bold**, *emphasis*, \`inline code\` and a [link](https://x.ant.design). ` +
      'It keeps going for a while so the typewriter has something to pace.',
    '',
    '```ts',
    `export function step${i}(a: number, b: number): number {`,
    `  // section ${i + 1}`,
    '  return a * b + 1;',
    '}',
    '```',
    '',
    '| key | value |',
    '| --- | --- |',
    `| step | ${i + 1} |`,
    `| total | ${(i + 1) * 3} |`,
    '',
  ].join('\n');

const text = `# Streaming preset\n\n${Array.from({ length: 12 }, (_, i) => section(i)).join('')}`;

const CHUNK = 40;
const INTERVAL_MS = 40;

interface ToggleItemProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, checked, disabled, onChange }) => (
  <Flex align="center" justify="space-between" gap={16} style={{ minWidth: 220 }}>
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Switch size="small" checked={checked} disabled={disabled} onChange={onChange} />
  </Flex>
);

const App = () => {
  const [usePreset, setUsePreset] = React.useState(true);
  const [incremental, setIncremental] = React.useState(true);
  const [complete, setComplete] = React.useState(true);
  const [typewriter, setTypewriter] = React.useState(true);
  const [sentence, setSentence] = React.useState(false);
  const [tail, setTail] = React.useState(true);

  const [index, setIndex] = React.useState(0);
  const [isStreaming, setIsStreaming] = React.useState(true);
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const contentRef = React.useRef<HTMLDivElement>(null);

  // How many times the custom `code` component rendered since the last run.
  // With `incremental` on, finished sections are skipped and this stays small.
  const codeRendersRef = React.useRef(0);
  const [codeRenders, setCodeRenders] = React.useState(0);

  // Custom components must keep a stable identity across renders, so they
  // live in a memo (or outside the component) rather than inline.
  const components = React.useMemo(
    () => ({
      code: ({ children, lang, block }: ComponentProps) => {
        codeRendersRef.current += 1;
        return block ? (
          <pre className={`language-${lang ?? ''}`}>
            <code>{children}</code>
          </pre>
        ) : (
          <code>{children}</code>
        );
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (index >= text.length) {
      setIsStreaming(false);
      return;
    }
    const timer = setTimeout(() => {
      setIndex(Math.min(index + CHUNK, text.length));
      setCodeRenders(codeRendersRef.current);
    }, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [index]);

  React.useEffect(() => {
    const el = contentRef.current;
    if (el && index > 0 && index < text.length && el.scrollHeight > el.clientHeight) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [index]);

  const manual = React.useMemo<StreamingOption>(
    () => ({
      hasNextChunk: isStreaming,
      incremental,
      incompleteMarkdown: complete ? 'complete' : 'placeholder',
      typewriter: typewriter ? { unit: sentence ? 'sentence' : 'char' } : false,
      tail,
    }),
    [isStreaming, incremental, complete, typewriter, sentence, tail],
  );

  // The whole preset is `streaming={isStreaming}`; the object form is the
  // same thing with each option spelled out.
  const streaming = usePreset ? isStreaming : manual;

  const configContent = (
    <Flex vertical gap={10}>
      <ToggleItem label="Preset: streaming={isStreaming}" checked={usePreset} onChange={setUsePreset} />
      <ToggleItem label="incremental" checked={usePreset || incremental} disabled={usePreset} onChange={setIncremental} />
      <ToggleItem label="incompleteMarkdown: 'complete'" checked={usePreset || complete} disabled={usePreset} onChange={setComplete} />
      <ToggleItem label="typewriter" checked={usePreset || typewriter} disabled={usePreset} onChange={setTypewriter} />
      <ToggleItem label="typewriter unit: sentence" checked={!usePreset && sentence} disabled={usePreset || !typewriter} onChange={setSentence} />
      <ToggleItem label="tail" checked={usePreset || tail} disabled={usePreset} onChange={setTail} />
    </Flex>
  );

  return (
    <div style={{ height: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Space align="center" style={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0, marginBottom: 8 }} wrap>
        <Space size={4}>
          <Tag>{isStreaming ? `streaming ${Math.ceil(index / CHUNK)} chunks` : 'done'}</Tag>
          <Tag color={incremental || usePreset ? 'green' : 'default'}>code renders: {codeRenders}</Tag>
        </Space>
        <Space>
          <Popover trigger="click" placement="bottomRight" content={<div style={{ padding: 4 }}>{configContent}</div>}>
            <Button size="small" icon={<SettingOutlined />}>
              Config
            </Button>
          </Popover>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              codeRendersRef.current = 0;
              setCodeRenders(0);
              setIndex(0);
              setIsStreaming(true);
            }}
          >
            Run Stream
          </Button>
        </Space>
      </Space>

      <Flex vertical style={{ flex: 1, minHeight: 0, overflow: 'auto' }} ref={contentRef}>
        <Bubble
          style={{ width: '100%' }}
          styles={{ body: { width: '100%' } }}
          variant="borderless"
          content={text.slice(0, index)}
          className={className}
          contentRender={(content) => (
            <XMarkdown streaming={streaming} components={components}>
              {content}
            </XMarkdown>
          )}
        />
      </Flex>
    </div>
  );
};

export default App;
