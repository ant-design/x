import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { Button, Flex } from 'antd';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../_utils';
import { Adx_Markdown_En, Adx_Markdown_Zh } from '../_utils/adx-markdown';

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [hasNextChunk, setHasNextChunk] = React.useState(false);
  const timer = React.useRef<any>(-1);
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Adx_Markdown_Zh : Adx_Markdown_En;
  const renderStream = () => {
    if (index >= content.length) {
      clearTimeout(timer.current);
      setHasNextChunk(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20);
  };

  React.useEffect(() => {
    if (index === content.length) return;
    setHasNextChunk(true);
    renderStream();
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <Flex vertical gap="small">
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
        Re-Render
      </Button>

      <Bubble
        content={content.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown streaming={{ hasNextChunk }} className={className}>
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
