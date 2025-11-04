import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Flex, Slider, Spin } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../_utils';
import { Adx_Markdown_En, Adx_Markdown_Zh } from '../_utils/adx-markdown';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const Footer = React.memo(() => {
  return <Spin />;
});

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [speed, setSpeed] = React.useState(10);
  const [hasNextChunk, setHasNextChunk] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Adx_Markdown_Zh : Adx_Markdown_En;

  const renderStream = React.useCallback(() => {
    if (index >= content.length) {
      if (timer.current) clearTimeout(timer.current);

      setHasNextChunk(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20 * speed);
  }, [index, content.length, speed]);

  const onChange = React.useCallback((newValue: number) => {
    setSpeed(newValue);
  }, []);

  React.useEffect(() => {
    if (index === content.length) return;

    if (!hasNextChunk) {
      setHasNextChunk(true);
    }

    renderStream();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, hasNextChunk, content.length, renderStream]);

  return (
    <Flex vertical gap="small">
      <Flex justify="flex-end" align="center" gap="small">
        <div>Render Speed</div>
        <Slider
          min={1}
          max={20}
          step={1}
          tooltip={{
            open: true,
            formatter: () => `${20 * speed} ms`,
          }}
          onChange={onChange}
          value={speed}
          style={{ width: 150 }}
        />
        <Button onClick={() => setIndex(0)}>Re-Render</Button>
      </Flex>

      <Bubble
        content={content.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown streaming={{ hasNextChunk }} footer={Footer} className={className}>
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
