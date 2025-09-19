import { ComponentProps, Token, XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import './plugin.css';
import '@ant-design/x-markdown/themes/light.css';
import { Popover } from 'antd';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../../_utils';
import { Adx_Markdown_En, Adx_Markdown_Zh } from '../../_utils/adx-markdown';

const referenceList = [
  { url: 'https://x.ant.design', title: 'link1' },
  { url: 'https://x.ant.design', title: 'link2' },
  { url: 'https://x.ant.design', title: 'link3' },
  { url: 'https://x.ant.design', title: 'link4' },
  { url: 'https://x.ant.design', title: 'link5' },
  { url: 'https://x.ant.design', title: 'link6' },
  { url: 'https://x.ant.design', title: 'link7' },
  { url: 'https://x.ant.design', title: 'link8' },
  { url: 'https://x.ant.design', title: 'link9' },
];

const Footnote: React.FC<ComponentProps<{ href?: string; title?: string }>> = (props) => (
  <Popover content={props.title} title="Footnote" trigger="hover">
    <span onClick={() => window.open(props.href)} className="markdown-cite">
      {props.children}
    </span>
  </Popover>
);

const App = () => {
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Adx_Markdown_Zh : Adx_Markdown_En;
  const footNoteExtension = {
    name: 'footnote',
    level: 'inline' as const,
    tokenizer(src: string) {
      const match = src.match(/^\[\^(\d+)\]/);
      if (match) {
        const content = match[0].trim();
        return {
          type: 'footnote',
          raw: content,
          text: content?.replace(/^\[\^(\d+)\]/g, '$1'),
          renderType: 'component',
        };
      }
    },
    renderer(token: Token) {
      if (!referenceList) {
        return '';
      }
      const { text } = token;
      const order = Number(text) - 1;
      const currentUrl = referenceList?.[order]?.url;
      const currentTitle = referenceList?.[order]?.title;
      if (!currentUrl) {
        return null;
      }
      return `<footnote href="${currentUrl}" title="${currentTitle}">${text}</footnote>`;
    },
  };

  return (
    <XMarkdown
      className={className}
      config={{ extensions: [footNoteExtension] }}
      components={{
        footnote: Footnote,
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
