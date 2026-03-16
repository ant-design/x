import { Think } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import { Button, Card, Flex, Segmented } from 'antd';
import React from 'react';

const samples = {
  setext: {
    label: 'Setext Guard',
    content: 'test\n- test',
  },
  customTag: {
    label: 'Custom Tag Guard',
    content: '<think>\n\n- test\n\ntest</think> outer,',
  },
} as const;

const ThinkBlock = React.memo((props: ComponentProps) => (
  <Think
    title={props.streamStatus === 'loading' ? 'Streaming think...' : 'Think complete'}
    loading={props.streamStatus === 'loading'}
    expanded
  >
    {props.children}
  </Think>
));

const App = () => {
  const [sampleKey, setSampleKey] = React.useState<keyof typeof samples>('setext');
  const [index, setIndex] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);
  const sample = samples[sampleKey];
  const hasNextChunk = index < sample.content.length;

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => clearTimer, [clearTimer]);

  React.useEffect(() => {
    clearTimer();
    setIndex(0);
  }, [sampleKey, clearTimer]);

  React.useEffect(() => {
    if (index >= sample.content.length) {
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, sample.content.length));
    }, 35);
  }, [index, sample.content.length]);

  const preview = sample.content.slice(0, index);

  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between" wrap gap={12}>
        <Segmented
          value={sampleKey}
          onChange={(value) => setSampleKey(value as keyof typeof samples)}
          options={Object.entries(samples).map(([value, item]) => ({
            label: item.label,
            value,
          }))}
        />
        <Button
          onClick={() => {
            clearTimer();
            setIndex(0);
          }}
        >
          Re-Render
        </Button>
      </Flex>

      <Flex gap={12} wrap>
        <Card title="Source Stream" style={{ flex: '1 1 240px', minWidth: 260 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {preview}
          </pre>
        </Card>

        <Card title="Legacy" style={{ flex: '1 1 240px', minWidth: 260 }}>
          <XMarkdown
            content={preview}
            components={{ think: ThinkBlock }}
            paragraphTag="div"
            streaming={{ hasNextChunk }}
          />
        </Card>

        <Card title="parsingGuards" style={{ flex: '1 1 240px', minWidth: 260 }}>
          <XMarkdown
            content={preview}
            components={{ think: ThinkBlock }}
            paragraphTag="div"
            streaming={{
              hasNextChunk,
              parsingGuards: {
                setextHeading: true,
                customTags: true,
              },
            }}
          />
        </Card>
      </Flex>
    </Flex>
  );
};

export default App;
