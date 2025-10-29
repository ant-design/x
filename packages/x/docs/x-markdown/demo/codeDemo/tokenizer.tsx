import type { Token } from '@ant-design/x-markdown';
import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const ZH_Markdown = `% 一级标题\n %% 二级标题\n %%% 三级标题\n %%%% 四级标题`;

const EN_Markdown = `% Level 1 Heading\n %% Level 2 Heading \n %%% Level 3 Heading\n %%%% Level 4 Heading`;

interface PercentHeadingToken extends Token {
  type: 'percentHeading';
  depth: number;
  text: string;
}

const percentHeading = {
  name: 'percentHeading',
  level: 'block' as const,
  start(src: string): number {
    return src.indexOf('%');
  },
  tokenizer(src: string): PercentHeadingToken | undefined {
    const rule = /^%+([^\n]+)(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      const depth = match[0].match(/^%+/)?.[0].length || 0;
      return {
        type: 'percentHeading',
        raw: match[0],
        depth: Math.min(depth, 6),
        text: match[1].trim(),
        tokens: [],
      };
    }
    return undefined;
  },
  renderer(token: PercentHeadingToken): string {
    return `<h${token.depth}>${token.text}</h${token.depth}>\n`;
  },
};

const App: React.FC = () => {
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? ZH_Markdown : EN_Markdown;

  return (
    <XMarkdown className={className} config={{ extensions: [percentHeading] }}>
      {content}
    </XMarkdown>
  );
};

export default App;
