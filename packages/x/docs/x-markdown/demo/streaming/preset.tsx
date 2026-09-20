import XMarkdown from '@ant-design/x-markdown';
import type { ComponentProps, XMarkdownProps } from '@ant-design/x-markdown';
import { Button, Flex, Segmented, Space, Tag, Typography, theme } from 'antd';
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

// Models deliver text in bursts. A bigger chunk on a longer interval makes
// the difference between the two panes obvious: the left one jumps, the
// right one types.
const PACES = { fast: 60, normal: 250, slow: 600 } as const;
type Pace = keyof typeof PACES;
const CHUNK = 30;

interface PaneStats {
  /** Renders of the custom `code` component */
  codeRenders: number;
  /** React commits of the XMarkdown subtree */
  commits: number;
}

interface PaneProps {
  title?: string;
  content: string;
  streaming?: XMarkdownProps['streaming'];
  className: string;
  statsRef: React.MutableRefObject<PaneStats>;
  stats: PaneStats;
}

// What matters is the work per update, not the number of updates: the
// typewriter pane commits once per animation frame, the other once per
// chunk. "code renders per commit" is how much of the document each update
// re-renders — the whole document on the left, only the last section on the right.
const perCommit = ({ codeRenders, commits }: PaneStats) =>
  commits ? (codeRenders / commits).toFixed(1) : '0';

const Pane: React.FC<PaneProps> = ({ title, content, streaming, className, statsRef, stats }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Custom components must keep a stable identity across renders, so they
  // live in a memo (or outside the component) rather than inline.
  const components = React.useMemo(
    () => ({
      // Block code already arrives wrapped in <pre> by the parser; the
      // component only replaces the <code> element.
      code: ({ children }: ComponentProps) => {
        statsRef.current.codeRenders += 1;
        return <code>{children}</code>;
      },
    }),
    [statsRef],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (el && el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
  });

  const onCommit = React.useCallback(() => {
    statsRef.current.commits += 1;
  }, [statsRef]);

  return (
    <Flex vertical style={{ flex: 1, minWidth: 0 }} gap={6}>
      <Flex align="center" justify="space-between" gap={8}>
        {title ? (
          <Text code style={{ fontSize: 12 }}>
            {title}
          </Text>
        ) : (
          <span />
        )}
        <Tag style={{ marginInlineEnd: 0, whiteSpace: 'nowrap' }} title={`${stats.codeRenders} code renders in ${stats.commits} commits`}>
          code renders / commit: {perCommit(stats)}
        </Tag>
      </Flex>
      <div
        ref={ref}
        className={className}
        style={{
          height: 360,
          overflow: 'auto',
          padding: '0 12px 32px',
          border: '1px solid rgba(128,128,128,0.25)',
          borderRadius: 8,
        }}
      >
        <React.Profiler id={title ?? 'plain'} onRender={onCommit}>
          <XMarkdown streaming={streaming} components={components}>
            {content}
          </XMarkdown>
        </React.Profiler>
      </div>
    </Flex>
  );
};

const App = () => {
  const [pace, setPace] = React.useState<Pace>('normal');
  const [index, setIndex] = React.useState(0);
  const [isStreaming, setIsStreaming] = React.useState(true);
  const emptyStats = (): PaneStats => ({ codeRenders: 0, commits: 0 });
  const [leftStats, setLeftStats] = React.useState<PaneStats>(emptyStats);
  const [rightStats, setRightStats] = React.useState<PaneStats>(emptyStats);
  const leftRef = React.useRef<PaneStats>(emptyStats());
  const rightRef = React.useRef<PaneStats>(emptyStats());
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';

  React.useEffect(() => {
    if (index >= text.length) {
      setIsStreaming(false);
      return;
    }
    const timer = setTimeout(() => {
      setIndex(Math.min(index + CHUNK, text.length));
      setLeftStats({ ...leftRef.current });
      setRightStats({ ...rightRef.current });
    }, PACES[pace]);
    return () => clearTimeout(timer);
  }, [index, pace]);

  const content = text.slice(0, index);

  return (
    <Flex vertical gap={12} style={{ maxWidth: 960, margin: '0 auto' }}>
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
              leftRef.current = emptyStats();
              rightRef.current = emptyStats();
              setLeftStats(emptyStats());
              setRightStats(emptyStats());
              setIndex(0);
              setIsStreaming(true);
            }}
          >
            Run Stream
          </Button>
        </Space>
      </Flex>

      <Flex gap={12}>
        <Pane content={content} className={className} statsRef={leftRef} stats={leftStats} />
        <Pane
          title="streaming={isStreaming}"
          content={content}
          streaming={isStreaming}
          className={className}
          statsRef={rightRef}
          stats={rightStats}
        />
      </Flex>
    </Flex>
  );
};

export default App;
