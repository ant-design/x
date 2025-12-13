import type { ComponentProps } from '@ant-design/x-markdown';
import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const ZH_Markdown = '# 将html代码渲染成字符串\n\n<html><form><button>测试</button><form></html>';

const EN_Markdown = '# Render Code Text\n\n<html><form><button>Test</button><form></html>';

const DataRender: React.FC<ComponentProps> = (props) => {
  return props?.['data-info'] as string;
};

const App: React.FC = () => {
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? ZH_Markdown : EN_Markdown;

  return (
    <XMarkdown
      className={className}
      components={{
        data: DataRender,
      }}
      config={{
        renderer: {
          html(token) {
            return `<data data-info="${token.text}"></data>`;
          },
          heading({ tokens, depth }) {
            const text = this.parser.parseInline(tokens);
            return `<h${depth}>🚀 ${text}</h${depth}>`;
          },
        },
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
