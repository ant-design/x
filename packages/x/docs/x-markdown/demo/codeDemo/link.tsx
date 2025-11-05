import { Bubble } from '@ant-design/x';
import XMarkdown, { Token } from '@ant-design/x-markdown';
import { Button, Flex, Skeleton } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';

const content =
  '[点此访问：Ant Design X](https://ant.design/index-cn)\n\nhttps://www.abc.com(abc)\n\n**AntDesign的官网是：https://ant.design/index-cn/在官网上，您可以了解更多AntDesign的信息**\n\nAntDesign的官网是：https://ant.design/index-cn/1?a=1&b=2。在官网上，您可以了解更多AntDesign的信息\n\nAntDesign的官网是：https://ant.design/index-cn/。在官网上，您可以了解更多AntDesign的信息\n\nAntDesign的官网是：https://ant.design/index-cn/1?a=1&b=2，在官网上，您可以了解更多AntDesign的信息';

const LOCALE_MARKDOWN = {
  'en-US': {
    reRender: 'Re-Render',
  },
  'zh-CN': {
    reRender: '重新渲染',
  },
};

const findFirstForbiddenCharIndex = (str: string): number => {
  if (typeof str !== 'string' || str.length === 0) {
    return -1;
  }

  // 定义不允许的字符集合
  const forbiddenChars = /[()[\]{}（）「」]/u;

  // 使用Intl.Segmenter进行高效的中文分词（现代浏览器支持）
  if ('Intl' in window && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' });
      let index = 0;
      for (const segment of segmenter.segment(str)) {
        const char = segment.segment;
        // 如果遇到不允许的字符，返回其位置
        if (forbiddenChars.test(char)) {
          return index;
        }
        index += segment.segment.length;
      }
      return -1;
    } catch {
      // 降级到正则表达式方法
    }
  }

  // 高性能正则表达式方法，检查不允许的字符
  const match = str.match(forbiddenChars);
  return match ? match.index! : -1;
};

const LinkSkeleton = () => (
  <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }} />
);

const App = () => {
  const { locale } = useIntl();
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<any>(-1);

  const renderStream = () => {
    if (index >= content.length) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20);
  };

  React.useEffect(() => {
    if (index === content.length) return;
    renderStream();
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  const renderer = {
    link: (token: Token) => {
      const markdownLinkRegex = /\[[^\]]+\]\([^\s()<>]+(?:\([^\s()<>]*\))?\)/;
      if (!markdownLinkRegex.test(token.raw)) {
        const firstChineseIndex = findFirstForbiddenCharIndex(token.href);
        if (firstChineseIndex > 0) {
          return `<a href=${token.href.slice(0, firstChineseIndex)} target="_blank">${token.href.slice(0, firstChineseIndex)}</a>${token.href.slice(firstChineseIndex)}`;
        }
      }
      return `<a href=${token.href} target="_blank">${token?.text || token.href}</a>`;
    },
  };

  return (
    <Flex vertical gap="small">
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
        {LOCALE_MARKDOWN[locale as keyof typeof LOCALE_MARKDOWN].reRender}
      </Button>
      <Flex gap="middle">
        <Bubble
          style={{
            width: '50%',
          }}
          content={content.slice(0, index)}
          contentRender={(content) => (
            <XMarkdown paragraphTag="div">{`### 未处理\n\n${content}`}</XMarkdown>
          )}
          variant="outlined"
        />
        <Bubble
          style={{
            width: '50%',
          }}
          content={content.slice(0, index)}
          contentRender={(currContent) => (
            <XMarkdown
              streaming={{ hasNextChunk: index !== content.length }}
              components={{ 'incomplete-link': LinkSkeleton }}
              config={{
                renderer,
              }}
              paragraphTag="div"
            >
              {`### 已处理\n\n${currContent}`}
            </XMarkdown>
          )}
          variant="outlined"
        />
      </Flex>
    </Flex>
  );
};

export default App;
