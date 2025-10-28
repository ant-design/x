import { Bubble } from '@ant-design/x';
import XMarkdown, { Token } from '@ant-design/x-markdown';
import { Button, Flex } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';

const content =
  '**AntDesign的官网是：https://ant.design/index-cn/在官网上，您可以了解更多AntDesign的信息**\n\nAntDesign的官网是：https://ant.design/index-cn/1?a=1&b=2。在官网上，您可以了解更多AntDesign的信息\n\nAntDesign的官网是：https://ant.design/index-cn/。在官网上，您可以了解更多AntDesign的信息\n\nAntDesign的官网是：https://ant.design/index-cn/1?a=1&b=2，在官网上，您可以了解更多AntDesign的信息';
const Locale_Markdown = {
  'en-US': {
    reRender: 'Re-Render',
  },
  'zh-CN': {
    reRender: '重新渲染',
  },
};

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
      const regex =
        /(?:https?|tpf|tpfs):\/\/[a-zA-Z0-9\-.]+(?:\/[a-zA-Z0-9\-.]*)*(?:\?([a-zA-Z0-9\-_&=%+?]+=[a-zA-Z0-9\-_&=%+?]*[\u4e00-\u9fa5a-zA-Z0-9\-_&=%+?]*))?/g;
      const match = token.href.match(regex);
      if (match) {
        const text = token.href.split(match?.[0])[1];
        return `<a href=${match[0]} target="_blank">${match[0]}</a>${text}`;
      }

      return `<a href=${token.href} target="_blank">${token.href}</a>`;
    },
  };
  return (
    <Flex vertical gap="small">
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
        {Locale_Markdown[locale as keyof typeof Locale_Markdown].reRender}
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
          contentRender={(content) => (
            <XMarkdown
              config={{
                renderer,
              }}
              paragraphTag="div"
            >
              {`### 已处理\n\n${content}`}
            </XMarkdown>
          )}
          variant="outlined"
        />
      </Flex>
    </Flex>
  );
};

export default App;
