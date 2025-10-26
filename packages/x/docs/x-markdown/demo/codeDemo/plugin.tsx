import { type ComponentProps, type Token, XMarkdown } from '@ant-design/x-markdown';
import { Popover } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const ZH_Markdown = `| 组件          | 功能                                |  
|---------------|-------------------------------------|  
| Bubble      | 消息气泡，支持用户/AI 消息布局        |  
| Conversations  [^1][^3][^9] | 管理多轮对话历史记录                |
| Notification | 系统通知|`;

const EN_Markdown = `| Component      | Function                                 |  
|---------------|------------------------------------------|  
| Bubble        | Message bubble, supports user/AI layout   |  
| Conversations [^1][^3][^9] | Manage multi-turn conversation history |
| Notification  | System notification |`;

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
    <span
      onClick={() => window.open(props.href)}
      style={{
        backgroundColor: '#9A9A9A33',
        width: 20,
        height: 20,
        borderRadius: 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        marginLeft: 8,
        verticalAlign: 'middle',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </span>
  </Popover>
);

const App: React.FC = () => {
  const [className] = useMarkdownTheme();
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? ZH_Markdown : EN_Markdown;
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
      return `<footnote href="${currentUrl}" title="${currentTitle}" >${text}</footnote>`;
    },
  };

  return (
    <XMarkdown
      className={className}
      config={{ extensions: [footNoteExtension] }}
      components={{ footnote: Footnote }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
