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

const findFirstForbiddenCharIndex = (() => {
  // 预定义常量，避免重复创建
  const FORBIDDEN_CHARS = new Set([
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '（',
    '）',
    '「',
    '」',
    '。',
    '，',
  ]);
  const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

  let segmenter: any = null;

  // 检查是否支持 Intl.Segmenter
  const isSegmenterSupported = (): boolean => {
    return typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in (Intl as any);
  };

  // 获取或初始化 segmenter
  const getSegmenter = (): any => {
    if (segmenter !== null) return segmenter;

    if (isSegmenterSupported()) {
      try {
        segmenter = new (Intl as any).Segmenter('zh', { granularity: 'grapheme' });
      } catch {
        segmenter = null;
      }
    }
    return segmenter;
  };

  // 检查字符是否为禁止字符
  const isForbiddenChar = (char: string): boolean => {
    return FORBIDDEN_CHARS.has(char) || CHINESE_REGEX.test(char);
  };

  return (str: string): number => {
    // 简化的空值检查
    if (!str) return -1;

    const seg = getSegmenter();

    // 使用 Intl.Segmenter 进行 Unicode 感知处理
    if (seg) {
      let index = 0;
      for (const segment of seg.segment(str)) {
        const char = segment.segment;
        if (isForbiddenChar(char)) return index;
        index += char.length;
      }
    } else {
      // 降级到直接字符遍历
      for (let i = 0; i < str.length; i++) {
        if (isForbiddenChar(str[i])) return i;
      }
    }

    return -1;
  };
})();

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
        const firstForbiddenCharIndex = findFirstForbiddenCharIndex(token.href);
        if (firstForbiddenCharIndex > 0) {
          return `<a href=${token.href.slice(0, firstForbiddenCharIndex)} target="_blank">${token.href.slice(0, firstForbiddenCharIndex)}</a>${token.href.slice(firstForbiddenCharIndex)}`;
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
