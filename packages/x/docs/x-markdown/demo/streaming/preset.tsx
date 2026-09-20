import { CodeHighlighter } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { ComponentProps, XMarkdownProps } from '@ant-design/x-markdown';
import { Button, Card, Flex, Segmented, Space, Tag, theme } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

// A long answer: headings, inline markup, fenced code and tables — the mix
// that made every chunk re-render the whole document before `incremental`.
const section = (i: number) =>
  [
    `## ${i + 1}. Section ${i + 1}`,
    '',
    `This paragraph has **bold text that takes a moment to finish**, *emphasis*, \`inline code\` ` +
      'and a [link to the docs](https://x.ant.design). It keeps going for a while so the typewriter has something to pace.',
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

const text = `# Streaming preset\n\n${Array.from({ length: 8 }, (_, i) => section(i)).join('')}`;

// Models deliver text in bursts. A longer interval makes the difference
// between the two panes obvious: the left one jumps, the right one types.
const PACES = { fast: 60, normal: 250, slow: 600 } as const;
type Pace = keyof typeof PACES;
const CHUNK = 30;

// CodeHighlighter draws its own container. Two things would paint a second
// box inside it: the highlighter's own <pre> background (turned off through
// its props) and the x-markdown theme's `pre code` rule, which does not
// recognise CodeHighlighter's inner <code> and gives it a background and
// padding too. The rule below overrides that for this demo's panes only.
const DEMO_CLASS = 'xmd-streaming-preset-demo';
const demoStyle = `.${DEMO_CLASS} pre code { background: transparent !important; padding: 0 !important; margin: 0 !important; }`;
const highlightProps = { customStyle: { background: 'transparent', margin: 0 } };

// Block code goes through CodeHighlighter (it is memoised, so a finished
// block is not re-tokenised while the rest of the answer streams); inline
// code stays a plain <code>. Kept outside the component so its identity is
// stable across renders.
const Code: React.FC<ComponentProps> = ({ block, lang, children }) =>
  block ? (
    <CodeHighlighter lang={lang} highlightProps={highlightProps}>
      {String(children ?? '')}
    </CodeHighlighter>
  ) : (
    <code>{children}</code>
  );
const components = { code: Code };

interface PaneProps {
  content: string;
  streaming?: XMarkdownProps['streaming'];
  className: string;
}

const Pane: React.FC<PaneProps> = ({ content, streaming, className }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (el && el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
  });

  return (
    <Card
      size="small"
      style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}
      styles={{ body: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } }}
    >
      <div
        ref={ref}
        className={`${DEMO_CLASS} ${className}`}
        style={{ height: 400, overflow: 'auto', padding: '0 4px 32px' }}
      >
        <XMarkdown streaming={streaming} components={components}>
          {content}
        </XMarkdown>
      </div>
    </Card>
  );
};

const App = () => {
  const [pace, setPace] = React.useState<Pace>('normal');
  const [index, setIndex] = React.useState(0);
  const [isStreaming, setIsStreaming] = React.useState(true);
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';

  React.useEffect(() => {
    if (index >= text.length) {
      setIsStreaming(false);
      return;
    }
    const timer = setTimeout(() => setIndex(Math.min(index + CHUNK, text.length)), PACES[pace]);
    return () => clearTimeout(timer);
  }, [index, pace]);

  const content = text.slice(0, index);

  // Same width and card chrome as the other demos on this page.
  return (
    <Flex vertical gap={16} style={{ maxWidth: 1200, margin: '0 auto' }}>
      <style>{demoStyle}</style>
      <Flex align="center" justify="space-between" wrap gap={8}>
        <Tag color={isStreaming ? 'processing' : 'default'}>
          {isStreaming ? `streaming · ${Math.ceil(index / CHUNK)} chunks` : 'done'}
        </Tag>
        <Space>
          <Segmented<Pace>
            size="small"
            value={pace}
            onChange={setPace}
            options={[
              { label: 'fast 60ms', value: 'fast' },
              { label: 'normal 250ms', value: 'normal' },
              { label: 'slow 600ms', value: 'slow' },
            ]}
          />
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setIndex(0);
              setIsStreaming(true);
            }}
          >
            Run Stream
          </Button>
        </Space>
      </Flex>

      <Flex gap={16}>
        <Pane content={content} className={className} />
        <Pane content={content} streaming={isStreaming} className={className} />
      </Flex>
    </Flex>
  );
};

export default App;
