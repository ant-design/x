import type { Token } from '@ant-design/x-markdown';
import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const ZH_Markdown = `请查看：[这是一个链接](https://xxxxx)`;

const EN_Markdown = `Please check: [This is a link](https://xxxxx)`;

const App: React.FC = () => {
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? ZH_Markdown : EN_Markdown;
  const message = locale === 'zh-CN' ? '当前链接不合法' : 'Invalid link';

  const walkTokens = (token: Token) => {
    if (token.type === 'link') {
      // 请求接口判断是否合法
      // await fetch(token.href);
      delete token.tokens;
      token.raw = message;
      token.text = message;
      token.type = 'text';
    }
  };

  return (
    <XMarkdown className={className} config={{ walkTokens }}>
      {content}
    </XMarkdown>
  );
};

export default App;
